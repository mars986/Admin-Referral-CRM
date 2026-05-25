import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type QuickActionGridProps = {
  actions: QuickAction[];
};

export function QuickActionGrid({ actions }: QuickActionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {actions.map(({ href, label, description, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex min-h-32 flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:border-[rgba(108,149,207,0.28)] hover:bg-white/[0.06]"
        >
          <div className="space-y-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(56,90,135,0.2)] text-slate-100">
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[rgb(169,197,235)]">
            <span>Open</span>
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}
