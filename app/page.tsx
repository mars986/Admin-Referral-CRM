import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";
import { products } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Apex Wellness | Precision Wellness Formulations",
  description:
    "Premium wellness support designed with quality and discretion.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductsSection
        eyebrow=""
        title="Our Products"
        description=""
        products={products}
        showButton={false}
        hideHeadingOnMobile
      />
    </>
  );
}
