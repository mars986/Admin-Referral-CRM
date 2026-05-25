import path from "node:path";
import dotenv from "dotenv";
import { sendTemplateEmail } from "../src/lib/email/sendTemplateEmail";
import type { ResendTemplateAlias } from "../src/lib/email/resendTemplates";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

type TemplateTestCase = {
  alias: ResendTemplateAlias;
  variables: Record<string, string | number>;
};

async function main() {
  const recipient = process.env.APEX_ADMIN_EMAIL;

  if (!recipient) {
    throw new Error("Missing APEX_ADMIN_EMAIL in .env.local");
  }

  const portalUrl =
    process.env.APEX_PORTAL_URL ??
    process.env.APEX_WEBSITE_URL ??
    "http://localhost:3000";
  const websiteUrl = process.env.APEX_WEBSITE_URL ?? portalUrl;
  const supportEmail = process.env.APEX_SUPPORT_EMAIL ?? "support@apexwellness.com";

  const testCases: TemplateTestCase[] = [
    {
      alias: "apex-welcome-account-created",
      variables: {
        CUSTOMER_NAME: "Avery Cole",
        PORTAL_LINK: portalUrl,
        SUPPORT_EMAIL: supportEmail,
        WEBSITE_URL: websiteUrl,
      },
    },
    {
      alias: "apex-order-confirmation",
      variables: {
        CUSTOMER_NAME: "Avery Cole",
        ORDER_NUMBER: "AW-10001",
        ORDER_TOTAL: "$149.99",
        SHIPPING_ADDRESS: "123 Main St, Los Angeles, CA 90001",
        ORDER_LINK: portalUrl,
        SUPPORT_EMAIL: supportEmail,
        WEBSITE_URL: websiteUrl,
      },
    },
    {
      alias: "apex-order-shipped",
      variables: {
        CUSTOMER_NAME: "Avery Cole",
        ORDER_NUMBER: "AW-10001",
        CARRIER: "UPS",
        TRACKING_NUMBER: "1Z999AA10123456784",
        ESTIMATED_DELIVERY: "2026-05-27",
        TRACKING_LINK: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
        SUPPORT_EMAIL: supportEmail,
        WEBSITE_URL: websiteUrl,
      },
    },
    {
      alias: "apex-support-request-confirmation",
      variables: {
        CUSTOMER_NAME: "Avery Cole",
        TICKET_NUMBER: "SUP-10001",
        SUPPORT_TICKET_LINK: portalUrl,
        SUPPORT_EMAIL: supportEmail,
        WEBSITE_URL: websiteUrl,
      },
    },
    {
      alias: "apex-admin-new-order-placed",
      variables: {
        ORDER_NUMBER: "AW-10001",
        CUSTOMER_NAME: "Avery Cole",
        ORDER_TOTAL: "$149.99",
        PAYMENT_STATUS: "Paid",
        ADMIN_ORDER_LINK: `${portalUrl.replace(/\/$/, "")}/admin/crm/orders`,
        SUPPORT_EMAIL: supportEmail,
        WEBSITE_URL: websiteUrl,
      },
    },
  ];

  const results = [];
  for (const testCase of testCases) {
    const response = await sendTemplateEmail({
      to: recipient,
      templateAlias: testCase.alias,
      variables: testCase.variables,
    });

    results.push({
      alias: testCase.alias,
      recipient,
      messageId: response.data?.id ?? null,
      ok: !response.error,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
