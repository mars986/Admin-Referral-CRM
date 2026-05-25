"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getAdminNavigation } from "@/components/crm/admin-navigation";
import { AdminSidebar } from "@/components/crm/admin-sidebar";
import { MobileCRMBottomNav } from "@/components/crm/mobile-crm-bottom-nav";
import { MobileCRMHeader } from "@/components/crm/mobile-crm-header";
import { MobileAdminBottomNav } from "@/components/crm/mobile-admin-bottom-nav";
import { MobileAdminHeader } from "@/components/crm/mobile-admin-header";

type AdminShellProps = PropsWithChildren<{
  accessEmail?: string | null;
}>;

export function AdminShell({ accessEmail, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { portal } = getAdminNavigation(pathname);
  const isCrmPortal = portal === "crm";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(50,78,115,0.2),transparent_24%),linear-gradient(180deg,#050811_0%,#09111d_100%)] px-4 py-4 text-white sm:px-6 lg:px-8">
      {isCrmPortal ? (
        <MobileCRMHeader onOpenMenu={() => setDrawerOpen(true)} />
      ) : (
        <MobileAdminHeader accessEmail={accessEmail} onOpenMenu={() => setDrawerOpen(true)} />
      )}
      <div className="mx-auto grid max-w-[1680px] gap-4 md:grid-cols-[280px_1fr]">
        <AdminSidebar className="sticky top-6 hidden self-start md:block" />
        <div className="min-w-0 space-y-4 pb-28 md:pb-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-slate-300 sm:px-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-emerald-300" />
              <div className="space-y-1">
                <p className="font-medium text-slate-100">Protected for Cloudflare Access</p>
                <p className="leading-6">
                  Local development can run with <code className="rounded bg-white/10 px-1.5 py-0.5 text-slate-100">ACCESS_ENFORCED=false</code>
                  {accessEmail ? ` and the current session is authenticated as ${accessEmail}.` : "."}
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(3,6,12,0.7)] backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close admin navigation overlay"
          />
          <div className="absolute inset-y-0 left-0 w-[min(21rem,86vw)] p-3">
            <AdminSidebar
              className="h-full overflow-y-auto rounded-[2rem]"
              showClose
              onClose={() => setDrawerOpen(false)}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {isCrmPortal ? <MobileCRMBottomNav /> : <MobileAdminBottomNav />}
    </div>
  );
}
