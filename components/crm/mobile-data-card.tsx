import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MobileDataCardProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function MobileDataCard({ title, eyebrow, meta, children, className }: MobileDataCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,39,0.94),rgba(12,18,30,0.9))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
          ) : null}
          <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        </div>
        {meta ? <div className="shrink-0 text-right text-xs text-slate-400">{meta}</div> : null}
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-200">{children}</div>
    </article>
  );
}
