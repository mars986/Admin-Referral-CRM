import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerConfig } from "@/lib/cloudflare/env";

const requiredEnvVars = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "APEX_SUPPORT_EMAIL",
  "APEX_WEBSITE_URL",
  "APEX_PORTAL_URL",
  "APEX_ADMIN_EMAIL",
  "TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

export default async function SettingsPage() {
  const config = await getServerConfig();

  return (
    <div data-admin-page className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Runtime Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>App URL: {config.appUrl}</p>
          <p>Portal URL: {config.portalUrl}</p>
          <p>Brand: {config.brandName}</p>
          <p>Support email present: {config.supportEmail ? "Yes" : "No"}</p>
          <p>Admin email present: {config.adminNotificationEmail ? "Yes" : "No"}</p>
          <p>Cloudflare Access enforced: {String(config.accessEnforced)}</p>
          <p>Turnstile site key present: {config.turnstileSiteKey ? "Yes" : "No"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Required Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          {requiredEnvVars.map((key) => (
            <div key={key} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 font-mono text-xs">
              {key}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
