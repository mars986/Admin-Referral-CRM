import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getRuntimeEnv() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env;
  } catch {
    return undefined;
  }
}

export async function getServerConfig() {
  const env = await getRuntimeEnv();
  const appUrl =
    env?.APEX_WEBSITE_URL ??
    process.env.APEX_WEBSITE_URL ??
    env?.APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";
  const portalUrl =
    env?.APEX_PORTAL_URL ??
    process.env.APEX_PORTAL_URL ??
    appUrl;
  const supportEmail =
    env?.APEX_SUPPORT_EMAIL ??
    process.env.APEX_SUPPORT_EMAIL ??
    env?.RESEND_FROM_EMAIL ??
    process.env.RESEND_FROM_EMAIL ??
    "";
  const adminNotificationEmail =
    env?.APEX_ADMIN_EMAIL ??
    process.env.APEX_ADMIN_EMAIL ??
    env?.ADMIN_NOTIFICATION_EMAIL ??
    process.env.ADMIN_NOTIFICATION_EMAIL ??
    "";

  return {
    appUrl,
    portalUrl,
    brandName: env?.CRM_BRAND_NAME ?? process.env.CRM_BRAND_NAME ?? "Apex Wellness",
    accessEnforced:
      (env?.ACCESS_ENFORCED ?? process.env.ACCESS_ENFORCED ?? "false") === "true",
    turnstileSiteKey:
      env?.TURNSTILE_SITE_KEY ?? process.env.TURNSTILE_SITE_KEY ?? "",
    resendFromEmail:
      env?.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "",
    supportEmail,
    adminNotificationEmail,
  };
}
