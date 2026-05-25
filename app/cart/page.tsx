import { CartPageClient } from "@/components/cart/cart-page-client";
import { PageHero } from "@/components/page-hero";
import { getServerConfig } from "@/lib/cloudflare/env";

export default async function CartPage() {
  const config = await getServerConfig();

  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Your Cart"
        description="Review your selected pre-order products, referral access status, and next-step checkout path."
      />
      <section className="section-space">
        <CartPageClient turnstileSiteKey={config.turnstileSiteKey} />
      </section>
    </>
  );
}
