import { products } from "@/lib/site-data";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ProductsSection } from "@/components/products-section";

export default function WellnessPage() {
  const categoryProducts = products.filter((product) =>
    product.categories.includes("Wellness"),
  );

  return (
    <>
      <PageHero
        eyebrow="Wellness"
        title="Wellness"
        description="Explore products aligned with everyday wellness support, modern routines, and a thoughtful self-care experience."
      />
      <section className="section-space pb-0">
        <div className="site-container">
          <div className="card-surface rounded-[1.9rem] p-7 text-base leading-8 text-[var(--color-ink-soft)] sm:p-8 sm:text-lg">
            Wellness at Apex focuses on premium presentation, clear product
            visibility, and support for people building consistent routines around
            energy, confidence, and overall lifestyle momentum.
          </div>
        </div>
      </section>
      <ProductsSection
        eyebrow="Wellness Collection"
        title="Products relevant to wellness goals."
        description="Explore wellness-oriented options with clear visibility into current availability and upcoming launches."
        products={categoryProducts}
        showButton={false}
      />
      <CtaBanner
        title="See the full catalog."
        description="Review all Apex Wellness offerings and compare categories from one place."
        href="/products"
        buttonLabel="View All Products"
      />
    </>
  );
}
