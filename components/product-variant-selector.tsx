"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductVariant } from "@/lib/types";

type ProductVariantSelectorProps = {
  variants: ProductVariant[];
  compact?: boolean;
  storageKey?: string;
};

export function ProductVariantSelector({
  variants,
  compact = false,
  storageKey,
}: ProductVariantSelectorProps) {
  const [selectedLabel, setSelectedLabel] = useState(() => {
    if (typeof window === "undefined" || !storageKey) {
      return variants[0]?.label ?? "";
    }

    return window.localStorage.getItem(storageKey) ?? variants[0]?.label ?? "";
  });

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.label === selectedLabel) ?? variants[0],
    [selectedLabel, variants],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !storageKey || !selectedVariant?.label) {
      return;
    }

    window.localStorage.setItem(storageKey, selectedVariant.label);
  }, [selectedVariant?.label, storageKey]);

  if (!variants.length || !selectedVariant) {
    return null;
  }

  const hasMultipleVariants = variants.length > 1;

  function handleVariantChange(nextLabel: string) {
    setSelectedLabel(nextLabel);

    if (typeof window !== "undefined" && storageKey) {
      window.localStorage.setItem(storageKey, nextLabel);
    }
  }

  return (
    <div
      className={
        compact
          ? "rounded-[1.3rem] border border-[var(--color-border)] bg-white/88 px-4 py-4"
          : "rounded-[1.6rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fafc_100%)] px-5 py-5 shadow-[var(--shadow-card)]"
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)]">
            Size & Pricing
          </p>
          <div>
            <p className="text-sm text-[var(--color-ink-soft)]">Selected option</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
              {selectedVariant.label}{" "}
              <span className="text-[var(--color-primary)]">{selectedVariant.price}</span>
            </p>
          </div>
        </div>
        {hasMultipleVariants ? (
          <label className="flex min-w-0 flex-col gap-2 sm:min-w-[11rem]">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-frost)]">
              Choose size
            </span>
            <select
              value={selectedLabel}
              onChange={(event) => handleVariantChange(event.target.value)}
              className="min-h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]"
              aria-label="Choose product size"
            >
              {variants.map((variant) => (
                <option key={variant.label} value={variant.label}>
                  {variant.label} - {variant.price}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}
