import { ProductDetailPage } from "@/components/product-detail-page";
import { products } from "@/lib/site-data";

const product = products.find((item) => item.slug === "nad-500mg");

export default function NadProductPage() {
  if (!product) {
    return null;
  }

  return <ProductDetailPage product={product} />;
}
