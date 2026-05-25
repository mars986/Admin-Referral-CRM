"use client";

import Link from "next/link";
import { BellRing, ClipboardList, LayoutDashboard, NotebookPen, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/crm/contacts", label: "Contacts", icon: Users },
  { href: "/admin/crm/leads", label: "Leads", icon: NotebookPen },
  { href: "/admin/crm/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/admin/crm/emails", label: "Alerts", icon: BellRing },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileCRMBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[rgba(5,8,17,0.96)] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1.5 rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-2 text-[0.56rem] font-semibold uppercase tracking-[0.08em] transition",
                active
                  ? "bg-[linear-gradient(180deg,rgba(65,104,162,0.38),rgba(28,46,74,0.6))] text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
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
