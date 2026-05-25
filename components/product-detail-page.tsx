import Image from "next/image";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { ProductPreorderNotice } from "@/components/product-preorder-notice";
import { ProductDetailAccordion } from "@/components/product-detail-accordion";
import { ProductVariantSelector } from "@/components/product-variant-selector";
import { ReferralGateCard } from "@/components/referral/referral-gate-card";
import { getServerConfig } from "@/lib/cloudflare/env";
import { getProductStatusMeta } from "@/lib/product-status";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductDetailPageProps = {
  product: Product;
};

export async function ProductDetailPage({ product }: ProductDetailPageProps) {
  if (!product) {
    return null;
  }

  const config = await getServerConfig();
  const hiddenNameEyebrows = new Set(["Lyophilized Powder", "Lyophilized Peptide"]);
  const heroProductType = product.productType?.[0];
  const showHeroProductType = heroProductType && !hiddenNameEyebrows.has(heroProductType);
  const showHeroEyebrow = product.cardEyebrow && !hiddenNameEyebrows.has(product.cardEyebrow);
  const statusMeta = getProductStatusMeta(product.status);
  const usageLines =
    product.usageInformation
      ?.split("\n\n")
      .map((line) => line.trim())
      .filter(Boolean) ?? [];
  const variantStorageKey = `apex_variant_${product.slug}`;
  const shouldShowReferralGate = product.requiresReferralCode && product.status === "pre-order";
  const primaryCtaHref = product.status === "pre-order" && product.requiresReferralCode
    ? "#product-referral-access"
    : statusMeta.primaryCtaHref;
  const storageStabilityTitle =
    product.slug === "bacteriostatic-water" ? "Storage Stability" : "Lyophilized Stability";
  const detailSections = [
    {
      id: "product-overview",
      title: "PRODUCT OVERVIEW",
      type: "overview" as const,
      paragraphs: product.overview ?? [],
    },
    {
      id: "product-highlights",
      title: "PRODUCT HIGHLIGHTS",
      type: "highlights" as const,
      highlights: product.highlights ?? [],
    },
    ...(product.activeIngredients?.length
      ? [
          {
            id: "ingredient-profile",
            title: "INGREDIENT PROFILE",
            type: "ingredients" as const,
            ingredients: product.activeIngredients,
          },
        ]
      : []),
    ...(usageLines.length
      ? [
          {
            id: "usage-information",
            title: "USAGE INFORMATION",
            type: "usage" as const,
            paragraphs: usageLines,
          },
        ]
      : []),
    {
      id: "reconstitution-instructions",
      title: "RECONSTITUTION INSTRUCTIONS",
      type: "reconstitution" as const,
      intro: product.reconstitutionIntro ?? "",
      steps: product.reconstitutionSteps ?? [],
      note: "Prepared for reconstitution prior to use. Use only as prescribed by a licensed medical provider.",
    },
    {
      id: "storage-handling",
      title: "STORAGE & HANDLING",
      type: "storage" as const,
      stabilityTitle: storageStabilityTitle,
      stabilityDescription: product.stabilityDescription,
      details: product.storageDetails ?? [],
    },
  ];

  return (
    <>
      <ProductPreorderNotice />
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-white">
        <div className="absolute inset-0 clinical-hero" />
        <div className="absolute inset-y-0 left-0 hidden w-30 molecular-grid lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-28 lab-stage" />
        <div className="site-container relative section-space">
          <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <div className="order-2 space-y-8 lg:order-2">
              <div className="space-y-4">
                <p className="eyebrow">Product Detail</p>
                <div className="flex flex-wrap items-center gap-3">
                  {showHeroProductType ? (
                    <span className="inline-flex rounded-full border border-[var(--color-border)] bg-white/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-frost)]">
                      {heroProductType}
                    </span>
                  ) : null}
                  {product.requiresReferralCode ? (
                    <span className="inline-flex rounded-full border border-[rgba(47,95,143,0.18)] bg-[rgba(47,95,143,0.08)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                      Provider Review Required
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl xl:text-[4.4rem] xl:leading-[1.02]">
                    {product.heroTitle ?? product.name}
                  </h1>
                  {showHeroEyebrow ? (
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)] sm:text-base">
                      {product.cardEyebrow}
                    </p>
                  ) : null}
                </div>
                <p className="max-w-3xl text-lg leading-8 text-[var(--color-ink-soft)] sm:text-xl">
                  {product.heroDescription ?? product.cardDescription}
                </p>
                {product.strength ? (
                  <div className="inline-flex rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold tracking-[0.08em] text-white sm:text-base">
                    {product.strength}
                  </div>
                ) : null}
              </div>
              {product.variants?.length ? (
                <ProductVariantSelector variants={product.variants} storageKey={variantStorageKey} />
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={primaryCtaHref}
                  className="button-primary inline-flex min-h-14 w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition sm:w-auto"
                >
                  {statusMeta.primaryCtaLabel}
                </Link>
                <Link
                  href="/products"
                  className="button-secondary inline-flex min-h-14 w-full items-center justify-center rounded-xl border border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold transition sm:w-auto"
                >
                  View Products
                </Link>
                <a
                  href="#product-details"
                  className="button-secondary inline-flex min-h-14 w-full items-center justify-center rounded-xl border border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold transition sm:w-auto"
                >
                  Learn More
                </a>
              </div>
              {shouldShowReferralGate ? (
                <ReferralGateCard
                  id="product-referral-access"
                  productName={product.name}
                  sourcePage={product.href ?? "/products"}
                  turnstileSiteKey={config.turnstileSiteKey}
                  productSlug={product.slug}
                  productHref={product.href}
                  imageSrc={product.imageSrc}
                  imageAlt={product.imageAlt}
                  variants={product.variants}
                  variantStorageKey={variantStorageKey}
                />
              ) : null}
            </div>
            <div
              id="product-view"
              className="hero-glow order-1 relative overflow-hidden rounded-[2.4rem] border border-white/80 px-5 py-6 shadow-[0_30px_80px_rgba(7,31,69,0.12)] lg:order-1 lg:min-h-[42rem] lg:px-8 lg:py-8"
            >
              {product.imageSrc ? (
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt ?? product.name}
                  width={1200}
                  height={1200}
                  priority
                  className="relative mx-auto h-auto w-full max-w-[720px] object-contain lg:pt-10"
                />
              ) : (
                <div
                  role="img"
                  aria-label="Desktop hero clinical product environment placeholder"
                  className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--color-silver)] bg-[linear-gradient(180deg,#f8fbfe_0%,#eef3f8_100%)] lg:min-h-[34rem]"
                >
                  <div className="space-y-3 px-8 text-center">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)]">
                      Support Product
                    </p>
                    <p className="text-3xl font-semibold text-[var(--color-ink)]">{product.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="product-details" className="section-space">
        <div className="site-container grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-white p-7 shadow-[var(--shadow-glow)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                {product.strength ? (
                  <div>
                    <p className="eyebrow">Strength</p>
                    <div className="mt-3 inline-flex rounded-lg bg-[var(--color-primary)] px-4 py-3 text-base font-semibold tracking-[0.08em] text-white">
                      {product.strength}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="space-y-6">
                <div>
                  <p className="eyebrow">Available Sizes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(product.variants?.map((variant) => variant.label) ?? product.sizes).map((size) => (
                      <span
                        key={size}
                        className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)]"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fafc_100%)] px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-frost)]">
                    Availability
                  </p>
                  <p className={cn("mt-2 text-base font-semibold", statusMeta.availabilityClassName)}>
                    {statusMeta.availabilityLabel}
                  </p>
                  {statusMeta.noticeBody ? (
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">{statusMeta.noticeBody}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
          <div className="space-y-2.5">
            <ProductDetailAccordion sections={detailSections} />
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <div className="rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(135deg,#f8fbfe_0%,#eef3f8_100%)] px-7 py-8 shadow-[var(--shadow-glow)] sm:px-8">
            <p className="eyebrow">Safety & Wellness Disclaimer</p>
            <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--color-ink-soft)]">
              {product.disclaimer}
            </p>
          </div>
        </div>
      </section>

      <CtaBanner
        title={
          product.status === "pre-order"
            ? "Ready to begin your pre-order request?"
            : product.status === "available"
              ? "Ready to request guided review?"
              : "Need availability guidance or product support?"
        }
        description={
          product.status === "pre-order"
            ? "Complete the referral access and assessment flow to move toward secure pre-order checkout. Pre-orders require full payment."
            : product.status === "available"
              ? "Complete the assessment flow to begin review, receive product guidance, and move toward discreet fulfillment."
              : "Reach out for product updates, availability guidance, or help choosing the next step."
        }
        href={statusMeta.primaryCtaHref}
        buttonLabel={statusMeta.primaryCtaLabel}
      />
    </>
  );
}
