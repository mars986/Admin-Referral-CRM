"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { FaqCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  categories: FaqCategory[];
};

export function FaqAccordion({ categories }: FaqAccordionProps) {
  const [openPanel, setOpenPanel] = useState(`${categories[0]?.title}-0`);

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <section key={category.title} className="card-surface rounded-[1.75rem] p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">{category.title}</h2>
          <div className="mt-5 space-y-3">
            {category.items.map((item, index) => {
              const key = `${category.title}-${index}`;
              const open = openPanel === key;

              return (
                <div key={item.question} className="rounded-2xl border border-[var(--color-border)] bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenPanel(open ? "" : key)}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left sm:min-h-14"
                  >
                    <span className="pr-2 text-[0.98rem] font-semibold leading-7 text-[var(--color-ink)] sm:text-base">
                      {item.question}
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-cloud)] text-[var(--color-primary)]">
                      {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-all duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0">
                      <div className="border-t border-[var(--color-border)] px-5 py-4 text-base leading-7 text-[var(--color-ink-soft)]">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
