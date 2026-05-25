import { products } from "@/lib/site-data";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ProductsSection } from "@/components/products-section";

export default function LongevityPage() {
  const categoryProducts = products.filter((product) =>
    product.categories.includes("Longevity"),
  );

  return (
    <>
      <PageHero
        eyebrow="Longevity"
        title="Longevity"
        description="Explore wellness products aligned with long-term vitality, routine consistency, and thoughtful daily support."
      />
      <section className="section-space pb-0">
        <div className="site-container">
          <div className="card-surface rounded-[1.9rem] p-7 text-base leading-8 text-[var(--color-ink-soft)] sm:p-8 sm:text-lg">
            Longevity-focused wellness emphasizes sustainable routines, elevated
            presentation, and an experience built around consistency and long-view
            lifestyle support.
          </div>
        </div>
      </section>
      <ProductsSection
        eyebrow="Longevity Collection"
        title="Products relevant to longevity goals."
        description="Review longevity-oriented options with a clear view of status, presentation, and category placement."
        products={categoryProducts}
        showButton={false}
      />
      <CtaBanner
        title="Explore all wellness categories."
        description="See how longevity fits within the broader Apex Wellness collection."
        href="/products"
        buttonLabel="View All Products"
      />
    </>
  );
}
