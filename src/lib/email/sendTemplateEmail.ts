import { Resend } from "resend";
import { getRuntimeEnv, getServerConfig } from "@/lib/cloudflare/env";
import {
  type ResendTemplateAlias,
  RESEND_TEMPLATES,
} from "./resendTemplates";

export type SendTemplateEmailInput = {
  to: string | string[];
  templateAlias: ResendTemplateAlias;
  variables?: Record<string, string | number | null | undefined>;
  subjectOverride?: string;
};

export async function getDefaultTemplateVariables() {
  const config = await getServerConfig();

  return {
    SUPPORT_EMAIL: config.supportEmail,
    WEBSITE_URL: config.appUrl,
  };
}

function normalizeVariables(
  variables: Record<string, string | number | null | undefined> = {},
) {
  return Object.fromEntries(
    Object.entries(variables).filter(([, value]) => value !== undefined && value !== null),
  ) as Record<string, string | number>;
}

export async function sendTemplateEmail({
  to,
  templateAlias,
  variables,
  subjectOverride,
}: SendTemplateEmailInput) {
  if (typeof window !== "undefined") {
    throw new Error("sendTemplateEmail must only run on the server");
  }

  const env = await getRuntimeEnv();
  const config = await getServerConfig();
  const apiKey = env?.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const from = env?.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? config.resendFromEmail;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL");
  }

  const template = RESEND_TEMPLATES[templateAlias];
  if (!template) {
    throw new Error(`Unknown Resend template alias: ${templateAlias}`);
  }

  const mergedVariables = normalizeVariables({
    ...(await getDefaultTemplateVariables()),
    ...variables,
  });

  const missingVariables = template.requiredVariables.filter((key) => {
    const value = mergedVariables[key];
    return value === undefined || value === null || value === "";
  });

  if (missingVariables.length) {
    throw new Error(
      `Missing required variables for ${templateAlias}: ${missingVariables.join(", ")}`,
    );
  }

  const resend = new Resend(apiKey);
  const response = await resend.emails.send({
    from,
    to,
    subject: subjectOverride ?? template.subject,
    template: {
      id: templateAlias,
      variables: mergedVariables,
    },
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response;
}
