"use client";

import { Menu, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAdminNavigation } from "@/components/crm/admin-navigation";

type MobileAdminHeaderProps = {
  accessEmail?: string | null;
  onOpenMenu: () => void;
};

export function MobileAdminHeader({ accessEmail, onOpenMenu }: MobileAdminHeaderProps) {
  const pathname = usePathname();
  const { currentItem, portalLabel } = getAdminNavigation(pathname);

  return (
    <div className="sticky top-0 z-40 -mx-4 border-b border-white/10 bg-[rgba(5,8,17,0.92)] px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 md:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100 transition hover:bg-white/[0.08]"
          aria-label="Open admin navigation"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {portalLabel}
          </p>
          <h1 className="truncate text-lg font-semibold text-white">{currentItem.label}</h1>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <ShieldCheck className="size-3.5 text-emerald-300" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Access
            </span>
          </div>
          <p className="mt-1 max-w-[8.5rem] truncate text-xs text-slate-300">
            {accessEmail ?? "Authenticated"}
          </p>
        </div>
      </div>
    </div>
  );
}
