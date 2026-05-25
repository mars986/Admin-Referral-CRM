import { writeFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { Resend } from "resend";
import {
  renderApexEmailHtml,
  renderApexEmailText,
} from "../src/lib/email/renderApexEmailTemplate";
import { RESEND_TEMPLATE_LIST } from "../src/lib/email/resendTemplates";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

type TemplateReportItem = {
  alias: string;
  name: string;
  id: string | null;
  status: "created" | "updated" | "skipped" | "failed";
  created: boolean;
  updated: boolean;
  skipped: boolean;
  published: boolean;
  errors: string[];
};

function createPlaceholderVariables(keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, `{{{${key}}}}`]));
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRateLimitError(message: string | undefined) {
  return (message ?? "").toLowerCase().includes("too many requests");
}

async function withRetry<T extends { error: { message: string } | null }>(
  operation: () => PromiseLike<T>,
  retries = 4,
) {
  let attempt = 0;

  while (attempt <= retries) {
    const response = await operation();
    if (!response.error) {
      await sleep(250);
      return response;
    }

    if (!isRateLimitError(response.error.message) || attempt === retries) {
      await sleep(250);
      return response;
    }

    await sleep(1200);
    attempt += 1;
  }

  return await operation();
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in .env.local");
  }

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL in .env.local");
  }

  const resend = new Resend(apiKey);
  const listResponse = await withRetry(() => resend.templates.list({ limit: 100 }));

  if (listResponse.error) {
    throw new Error(`Unable to list Resend templates: ${listResponse.error.message}`);
  }

  const existingByAlias = new Map(
    listResponse.data.data
      .filter((template) => template.alias)
      .map((template) => [template.alias as string, template]),
  );

  const results: TemplateReportItem[] = [];

  for (const definition of RESEND_TEMPLATE_LIST) {
    const placeholderVariables = createPlaceholderVariables([
      ...new Set([
        ...definition.requiredVariables,
        definition.ctaUrlVariable,
        "SUPPORT_EMAIL",
        "WEBSITE_URL",
        "PREFERENCES_LINK",
        "UNSUBSCRIBE_LINK",
      ]),
    ]);

    const html = renderApexEmailHtml({
      template: definition,
      variables: placeholderVariables,
    });
    const text = renderApexEmailText({
      template: definition,
      variables: placeholderVariables,
    });

    const templateVariables = definition.requiredVariables.map((key) => ({
      key,
      type: "string" as const,
      fallbackValue: placeholderVariables[key] ?? null,
    }));

    const existing = existingByAlias.get(definition.alias);
    const report: TemplateReportItem = {
      alias: definition.alias,
      name: definition.name,
      id: existing?.id ?? null,
      status: "skipped",
      created: false,
      updated: false,
      skipped: false,
      published: false,
      errors: [],
    };

    try {
      if (existing?.id) {
        const updateResponse = await withRetry(() =>
          resend.templates.update(existing.id, {
          alias: definition.alias,
          name: definition.name,
          subject: definition.subject,
          html,
          text,
          from,
          variables: templateVariables,
          }),
        );

        if (updateResponse.error) {
          report.skipped = true;
          report.status = "skipped";
          report.errors.push(`Update skipped: ${updateResponse.error.message}`);
        } else {
          report.updated = true;
          report.status = "updated";
          report.id = updateResponse.data?.id ?? existing.id;
        }
      } else {
        const createResponse = await withRetry(() =>
          resend.templates.create({
          alias: definition.alias,
          name: definition.name,
          subject: definition.subject,
          html,
          text,
          from,
          variables: templateVariables,
          }),
        );

        if (createResponse.error) {
          report.status = "failed";
          report.errors.push(createResponse.error.message);
        } else {
          report.created = true;
          report.status = "created";
          report.id = createResponse.data?.id ?? null;
        }
      }

      if (report.id) {
        const publishResponse = await withRetry(() => resend.templates.publish(report.id!));
        if (publishResponse.error) {
          report.errors.push(`Publish failed: ${publishResponse.error.message}`);
        } else {
          report.published = true;
        }
      }
    } catch (error) {
      report.status = "failed";
      report.errors.push(error instanceof Error ? error.message : "Unknown template error");
    }

    results.push(report);
  }

  const reportPath = path.resolve(process.cwd(), "resend-template-results.json");
  await writeFile(reportPath, JSON.stringify(results, null, 2), "utf8");

  const failedCount = results.filter((item) => item.status === "failed").length;
  console.log(
    JSON.stringify(
      {
        total: results.length,
        created: results.filter((item) => item.created).length,
        updated: results.filter((item) => item.updated).length,
        skipped: results.filter((item) => item.skipped).length,
        failed: failedCount,
        reportPath,
      },
      null,
      2,
    ),
  );

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
