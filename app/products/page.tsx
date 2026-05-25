import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ProductsFilterGrid } from "@/components/products-filter-grid";
import { products } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the Apex Wellness catalog with clearer product facts, availability messaging, and guided next-step actions.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Products"
        title="Premium Wellness Products"
        description=""
      />
      <section className="section-space">
        <div className="site-container">
          <ProductsFilterGrid products={products} />
        </div>
      </section>
      <CtaBanner
        title="Ready to take the next step?"
        description="Start the assessment process or reach out for product guidance and availability support."
        href="/become-a-patient"
        buttonLabel="Start Assessment"
      />
    </>
  );
}
