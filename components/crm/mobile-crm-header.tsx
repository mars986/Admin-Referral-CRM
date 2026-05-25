"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAdminNavigation } from "@/components/crm/admin-navigation";

type MobileCRMHeaderProps = {
  onOpenMenu: () => void;
};

export function MobileCRMHeader({ onOpenMenu }: MobileCRMHeaderProps) {
  const pathname = usePathname();
  const { currentItem } = getAdminNavigation(pathname);

  return (
    <div className="sticky top-0 z-40 -mx-4 border-b border-zinc-800 bg-[rgba(5,8,17,0.94)] px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 md:hidden">
      <div className="flex min-h-14 items-center justify-between gap-2">
        <div className="min-w-0 max-w-[10.5rem]">
          <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            {currentItem.label}
          </p>
          <h1 className="truncate text-base font-semibold text-zinc-100">Apex Wellness CRM</h1>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <Link
            href="#crm-search"
            aria-label="Jump to CRM search"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-100 transition hover:border-sky-400/30 hover:bg-zinc-900"
          >
            <Search className="size-4" />
          </Link>
          <Link
            href="/admin/crm/emails"
            aria-label="Open CRM alerts and email activity"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-100 transition hover:border-sky-400/30 hover:bg-zinc-900"
          >
            <Bell className="size-4" />
          </Link>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open CRM navigation menu"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-100 transition hover:border-sky-400/30 hover:bg-zinc-900"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
