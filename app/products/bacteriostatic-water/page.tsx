import { ProductDetailPage } from "@/components/product-detail-page";
import { products } from "@/lib/site-data";

const product = products.find((item) => item.slug === "bacteriostatic-water");

export default function BacteriostaticWaterProductPage() {
  if (!product) {
    return null;
  }

  return <ProductDetailPage product={product} />;
}
