"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { productFilters } from "@/lib/site-data";
import type { Product, ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductsFilterGridProps = {
  products: Product[];
};

export function ProductsFilterGrid({ products }: ProductsFilterGridProps) {
  const [filter, setFilter] = useState<"All" | ProductCategory>("All");

  const filteredProducts = useMemo(() => {
    if (filter === "All") {
      return products;
    }

    return products.filter((product) => product.categories.includes(filter));
  }, [filter, products]);

  return (
    <div className="space-y-8">
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-3 px-1">
          {productFilters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                filter === option
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-primary)]/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
