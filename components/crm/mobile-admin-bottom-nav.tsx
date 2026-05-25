"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminRouteActive, getAdminNavigation } from "@/components/crm/admin-navigation";
import { cn } from "@/lib/utils";

export function MobileAdminBottomNav() {
  const pathname = usePathname();
  const { bottomItems } = getAdminNavigation(pathname);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(5,8,17,0.96)] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.38)]">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = adminRouteActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition",
                active
                  ? "bg-[linear-gradient(180deg,rgba(62,104,160,0.36),rgba(22,35,56,0.54))] text-white"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <Icon className="size-4" />
              <span className="text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
