"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductPreorderNotice() {
  const [open, setOpen] = useState(false);

  return (
    <section className="site-container pt-6">
      <div className="rounded-[1.8rem] border border-[rgba(180,83,9,0.2)] bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ea_100%)] shadow-[var(--shadow-card)]">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          aria-expanded={open}
        >
          <div className="space-y-1">
            {!open ? (
              <>
                <p className="eyebrow text-amber-700">PRE-ORDER NOTICE</p>
                <p className="text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
                  This item is currently available for pre-order and is expected to ship within approximately 2&ndash;4 weeks.
                </p>
              </>
            ) : (
              <span className="sr-only">Collapse pre-order notice</span>
            )}
          </div>
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(180,83,9,0.2)] bg-white text-amber-700 transition duration-300",
              open && "rotate-180",
            )}
          >
            <ChevronDown className="size-4" />
          </span>
        </button>
        <div
          className={cn(
            "grid overflow-hidden border-t border-[rgba(180,83,9,0.14)] transition-all duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0">
            <div className="space-y-4 px-5 py-5 sm:px-6">
              <p className="eyebrow text-amber-700">PRE-ORDER NOTICE</p>
              <p className="text-base leading-8 text-[var(--color-ink-soft)]">
                This product is currently available for pre-order due to limited production availability and elevated demand.
                Orders placed during this pre-order window are expected to ship within approximately 2&ndash;4 weeks from the date of purchase.
                You will receive tracking information as soon as your order has been prepared and dispatched.
                Estimated fulfillment timelines may vary slightly depending on production volume, inventory allocation, and carrier processing times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
