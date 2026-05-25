import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import type { Product } from "@/lib/types";

type ProductsSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  products: Product[];
  showButton?: boolean;
  hideHeadingOnMobile?: boolean;
};

export function ProductsSection({
  eyebrow = "Our Products",
  title,
  description,
  products,
  showButton = true,
  hideHeadingOnMobile = false,
}: ProductsSectionProps) {
  return (
    <section className="section-space pt-8">
      <div className="site-container space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className={hideHeadingOnMobile ? "hidden sm:block" : undefined}>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </div>
          {showButton ? (
            <Link
              href="/products"
              className="button-secondary inline-flex items-center justify-center rounded-2xl border border-[var(--color-primary)]/24 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition"
            >
              View All Products
            </Link>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
