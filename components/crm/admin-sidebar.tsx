"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, X } from "lucide-react";
import { adminRouteActive, getAdminNavigation } from "@/components/crm/admin-navigation";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  className?: string;
  onNavigate?: () => void;
  onClose?: () => void;
  showClose?: boolean;
};

export function AdminSidebar({ className, onNavigate, onClose, showClose = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const { items, portalLabel } = getAdminNavigation(pathname);

  return (
    <aside
      className={cn(
        "rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,23,0.98),rgba(7,11,18,0.95))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#385a87_0%,#1d3555_100%)] shadow-[0_14px_24px_rgba(22,35,56,0.35)]">
          <BarChart3 className="size-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Apex Wellness</p>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{portalLabel}</p>
        </div>
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = adminRouteActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-[linear-gradient(180deg,rgba(62,104,160,0.32),rgba(22,35,56,0.52))] text-white"
                  : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
