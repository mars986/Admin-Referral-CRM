import Image from "next/image";
import Link from "next/link";
import { getProductStatusMeta } from "@/lib/product-status";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const statusMeta = getProductStatusMeta(product.status);
  const title = product.cardTitle ?? product.name;
  const detailsHref = product.href ?? "/products";
  const descriptor = product.categoryLabel ?? "Wellness Support";
  const priceLabel = product.priceLabel?.startsWith("From") ? product.priceLabel : product.priceLabel ? `Starting at ${product.priceLabel}` : "";

  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-5 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)] active:translate-y-0 sm:rounded-[2rem] sm:p-6">
      <div className="hero-glow relative rounded-[1.55rem] border border-[rgba(191,199,209,0.26)] p-4 sm:p-5">
        <div className="mb-3 flex min-h-8 flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] sm:px-3 sm:text-[0.7rem]",
              statusMeta.badgeClassName,
            )}
          >
            {statusMeta.badgeLabel}
          </span>
        </div>
        {product.imageSrc ? (
          <Link href={detailsHref} className="block">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt ?? product.name}
              width={900}
              height={900}
              className="mx-auto h-auto w-full max-w-[240px] object-contain transition duration-300 group-hover:scale-[1.03] sm:max-w-none"
            />
          </Link>
        ) : (
          <Link
            href={detailsHref}
            role="img"
            aria-label="Product card transparent render placeholder"
            className="flex aspect-square items-center justify-center rounded-[1rem] border border-dashed border-[var(--color-silver)] bg-[linear-gradient(180deg,#f8fbfe_0%,#eef3f8_100%)] px-4 text-center"
          >
            <div className="space-y-2">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)]">
                Support Product
              </p>
              <p className="text-lg font-semibold text-[var(--color-ink)]">{product.name}</p>
            </div>
          </Link>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="mt-3 text-[1.45rem] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[1.7rem]">
          <Link href={detailsHref} className="transition hover:text-[var(--color-primary)]">
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-sm font-medium text-[var(--color-primary)] sm:text-[0.96rem]">
          {descriptor}
        </p>
        {product.strength ? (
          <div className="mt-3 inline-flex self-start rounded-full border border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.08)] px-3 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-[var(--color-primary)] sm:text-sm">
            {product.strength}
          </div>
        ) : null}
        <p className="mt-3 overflow-hidden text-[0.9rem] leading-7 text-[var(--color-ink-soft)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[0.98rem]">
          {product.cardDescription ?? product.subtitle}
        </p>
        {priceLabel ? (
          <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">{priceLabel}</p>
        ) : null}
        <div className="mt-auto grid gap-2 pt-5">
          <Link
            href={statusMeta.primaryCtaHref}
            className={cn(
              "inline-flex min-h-13 w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
              statusMeta.primaryCtaClassName,
            )}
          >
            {statusMeta.primaryCtaLabel}
          </Link>
          <Link
            href={detailsHref}
            className="button-secondary inline-flex min-h-13 w-full items-center justify-center rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
