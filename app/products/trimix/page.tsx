import { ProductDetailPage } from "@/components/product-detail-page";
import { products } from "@/lib/site-data";

const product = products.find((item) => item.slug === "trimix");

export default function TriMixProductPage() {
  if (!product) {
    return null;
  }

  return <ProductDetailPage product={product} />;
}
