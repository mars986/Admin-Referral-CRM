import { products } from "@/lib/site-data";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ProductsSection } from "@/components/products-section";

export default function PerformancePage() {
  const categoryProducts = products.filter((product) =>
    product.categories.includes("Performance"),
  );

  return (
    <>
      <PageHero
        eyebrow="Performance"
        title="Performance"
        description="Explore products aligned with performance-oriented wellness goals in a premium, clearly presented storefront."
      />
      <section className="section-space pb-0">
        <div className="site-container">
          <div className="card-surface rounded-[1.9rem] p-7 text-base leading-8 text-[var(--color-ink-soft)] sm:p-8 sm:text-lg">
            Performance-focused wellness is about supporting confidence, momentum,
            and routine with a customer experience that stays polished, informative,
            and easy to navigate.
          </div>
        </div>
      </section>
      <ProductsSection
        eyebrow="Performance Collection"
        title="Products relevant to performance goals."
        description="Compare performance-focused options, availability status, and size details in one organized section."
        products={categoryProducts}
        showButton={false}
      />
      <CtaBanner
        title="Review the complete product lineup."
        description="See every current and upcoming Apex Wellness product in the full catalog."
        href="/products"
        buttonLabel="View All Products"
      />
    </>
  );
}
