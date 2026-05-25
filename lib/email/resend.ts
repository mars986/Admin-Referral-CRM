import { getServerConfig } from "@/lib/cloudflare/env";
import { createId, first, nowIso, run } from "@/lib/crm/db";
import type { EmailEventType } from "@/lib/crm/types";
import {
  type ResendTemplateAlias,
  isResendTemplateAlias,
} from "@/src/lib/email/resendTemplates";
import { sendTemplateEmail } from "@/src/lib/email/sendTemplateEmail";

type EmailContext = Record<string, string | number | null | undefined>;

const eventTemplateAliases: Record<EmailEventType, ResendTemplateAlias> = {
  user_signup: "apex-welcome-account-created",
  assessment_started: "apex-intake-submitted",
  patient_signup: "apex-intake-submitted",
  product_interest_submitted: "apex-referral-review-update",
  contact_form_submitted: "apex-support-request-confirmation",
  purchase_success: "apex-payment-successful",
  order_status_updated: "apex-order-processing",
  shipment_tracking_added: "apex-shipping-label-created",
  follow_up_due: "apex-intake-started-reminder",
  admin_new_lead: "apex-admin-new-intake-submitted",
  admin_new_purchase: "apex-admin-new-order-placed",
};

function resolveTemplateAlias(
  eventType: EmailEventType,
  templateAlias?: string | null,
) {
  if (templateAlias && isResendTemplateAlias(templateAlias)) {
    return templateAlias;
  }

  return eventTemplateAliases[eventType];
}

export async function sendTransactionalEmail(input: {
  eventType: EmailEventType;
  recipientEmail: string;
  context: EmailContext;
  templateAlias?: ResendTemplateAlias | string | null;
  subjectOverride?: string;
}) {
  const config = await getServerConfig();
  const createdAt = nowIso();
  const logId = createId("elog");
  const templateAlias = resolveTemplateAlias(input.eventType, input.templateAlias);

  const enabledRow = await first<{ is_enabled: number }>(
    "SELECT is_enabled FROM email_settings WHERE event_type = ? LIMIT 1",
    [input.eventType],
  );

  if (enabledRow && enabledRow.is_enabled === 0) {
    await run(
      "INSERT INTO email_logs (id, recipient_email, template_id, event_type, delivery_status, provider_message_id, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        logId,
        input.recipientEmail,
        templateAlias,
        input.eventType,
        "disabled",
        null,
        "Event disabled",
        createdAt,
      ],
    );
    return { ok: false, reason: "disabled" as const };
  }

  if (!process.env.RESEND_API_KEY || !config.resendFromEmail) {
    await run(
      "INSERT INTO email_logs (id, recipient_email, template_id, event_type, delivery_status, provider_message_id, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        logId,
        input.recipientEmail,
        templateAlias,
        input.eventType,
        "skipped",
        null,
        "Missing Resend configuration",
        createdAt,
      ],
    );
    return { ok: false, reason: "missing_config" as const };
  }

  let providerMessageId: string | null = null;
  let errorMessage: string | null = null;
  let success = false;

  try {
    const response = await sendTemplateEmail({
      to: input.recipientEmail,
      templateAlias,
      variables: input.context,
      subjectOverride: input.subjectOverride,
    });

    providerMessageId = response.data?.id ?? null;
    success = !response.error;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Resend request failed";
  }

  await run(
    "INSERT INTO email_logs (id, recipient_email, template_id, event_type, delivery_status, provider_message_id, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      logId,
      input.recipientEmail,
      templateAlias,
      input.eventType,
      success ? "sent" : "failed",
      providerMessageId,
      errorMessage,
      createdAt,
    ],
  );

  return { ok: success, providerMessageId, errorMessage };
}
