import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AdminShell } from "@/components/crm/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const accessEmail =
    requestHeaders.get("cf-access-authenticated-user-email") ??
    requestHeaders.get("x-admin-email");
  const accessEnforced = String(process.env.ACCESS_ENFORCED ?? "false") === "true";

  if (accessEnforced && !accessEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#050811_0%,#09111d_100%)] px-6 text-white">
        <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl font-semibold">Cloudflare Access required</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This CRM is configured to require Cloudflare Access before loading `/admin`.
          </p>
        </div>
      </div>
    );
  }

  return <AdminShell accessEmail={accessEmail}>{children}</AdminShell>;
}
