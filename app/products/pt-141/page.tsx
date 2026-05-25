import { ProductDetailPage } from "@/components/product-detail-page";
import { products } from "@/lib/site-data";

const product = products.find((item) => item.slug === "pt-141");

export default function Pt141ProductPage() {
  if (!product) {
    return null;
  }

  return <ProductDetailPage product={product} />;
}
