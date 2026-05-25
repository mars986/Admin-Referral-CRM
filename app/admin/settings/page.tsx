import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerConfig, getRuntimeEnv } from "@/lib/cloudflare/env";

export default async function ReferralSettingsPage() {
  const [config, env] = await Promise.all([getServerConfig(), getRuntimeEnv()]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Referral Runtime</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>App URL: {config.appUrl}</p>
          <p>Turnstile site key present: {config.turnstileSiteKey ? "Yes" : "No"}</p>
          <p>Referral assets R2 binding present: {env?.REFERRAL_ASSETS ? "Yes" : "No"}</p>
          <p>Cloudflare Access enforced: {String(config.accessEnforced)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Required Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs font-mono text-slate-300">
          {["TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "RESEND_API_KEY", "RESEND_FROM_EMAIL", "APEX_ADMIN_EMAIL"].map((item) => (
            <div key={item} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">{item}</div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
