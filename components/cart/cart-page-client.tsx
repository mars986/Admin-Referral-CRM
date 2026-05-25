"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, PackageCheck, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { ReferralGateCard } from "@/components/referral/referral-gate-card";
import { Button } from "@/components/ui/button";
import {
  CART_EVENT_NAME,
  type CartItem,
  getVariantPrice,
  readCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart";
import {
  REFERRAL_ACCESS_DISCOUNT_PERCENT,
  REFERRAL_ACCESS_DISCOUNT_RATE,
} from "@/lib/referrals/constants";
import { currency } from "@/lib/utils";

type CartPageClientProps = {
  turnstileSiteKey: string;
};

export function CartPageClient({ turnstileSiteKey }: CartPageClientProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    function syncCart() {
      setItems(readCartItems());
    }

    syncCart();
    window.addEventListener(CART_EVENT_NAME, syncCart as EventListener);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_EVENT_NAME, syncCart as EventListener);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + getVariantPrice(item.priceLabel) * item.quantity, 0),
    [items],
  );
  const referralCode = useMemo(() => {
    const itemCode = items.find((item) => item.referralCode)?.referralCode;

    if (itemCode) {
      return itemCode;
    }

    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem("apex_referral_code") ?? "";
  }, [items]);
  const referralDiscount = referralCode
    ? Number((subtotal * REFERRAL_ACCESS_DISCOUNT_RATE).toFixed(2))
    : 0;
  const orderTotal = Math.max(0, Number((subtotal - referralDiscount).toFixed(2)));

  async function startCheckout() {
    setCheckoutLoading(true);
    setCheckoutError("");

    const response = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralCode,
        items: items.map((item) => ({
          productSlug: item.productSlug,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
        })),
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string; data?: { url?: string } }
      | null;

    setCheckoutLoading(false);

    if (!response.ok || !payload?.ok || !payload.data?.url) {
      setCheckoutError(payload?.error ?? "Checkout could not be started. Please try again.");
      return;
    }

    window.location.assign(payload.data.url);
  }

  if (!items.length) {
    return (
      <div className="site-container grid gap-8 xl:grid-cols-[1fr_0.78fr]">
        <article className="card-surface rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-cloud)] p-3">
              <ShoppingCart className="size-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="eyebrow">Empty Cart</p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">
                Your cart is currently empty.
              </h2>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-ink-soft)]">
            Browse the product catalog to review formulation details, pre-order timing, and secure referral access
            before moving toward checkout.
          </p>
          <div className="mt-6">
            <ReferralGateCard
              productName="eligible Apex Wellness products"
              sourcePage="/cart"
              turnstileSiteKey={turnstileSiteKey}
            />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="button-primary inline-flex min-h-14 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition"
            >
              View Products
            </Link>
            <Link
              href="/become-a-patient"
              className="button-secondary inline-flex min-h-14 items-center justify-center rounded-xl border border-[var(--color-border)] px-6 py-3.5 text-sm font-semibold transition"
            >
              Become a Patient
            </Link>
          </div>
        </article>
        <aside className="space-y-6 xl:sticky xl:top-32 xl:self-start">
          <article className="card-surface rounded-[1.9rem] p-6 sm:p-7">
            <p className="eyebrow">Pre-Order Checkout</p>
            <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-ink-soft)]">
              <p className="flex items-start gap-3">
                <PackageCheck className="mt-1 size-5 text-[var(--color-primary)]" />
                <span>All current products are available on a pre-order basis and require full payment at checkout.</span>
              </p>
            </div>
          </article>
        </aside>
      </div>
    );
  }

  return (
    <div className="site-container grid gap-8 xl:grid-cols-[1fr_0.78fr]">
      <article className="card-surface rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-cloud)] p-3">
            <ShoppingCart className="size-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="eyebrow">Pre-Order Cart</p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">
              Review your selected products.
            </h2>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.6rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_100%)] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <Link
                    href={item.productHref}
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.25rem] border border-[var(--color-border)] bg-white"
                  >
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt ?? item.productName}
                        width={160}
                        height={160}
                        className="h-auto w-full object-contain"
                      />
                    ) : (
                      <span className="px-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-frost)]">
                        {item.productName}
                      </span>
                    )}
                  </Link>
                  <div className="space-y-2">
                    <Link href={item.productHref} className="text-lg font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-primary)]">
                      {item.productName}
                    </Link>
                    <p className="text-sm font-medium text-[var(--color-primary)]">{item.variantLabel}</p>
                    <p className="text-sm leading-6 text-[var(--color-ink-soft)]">
                      Pre-order item. Approximate fulfillment timing is 2-4 weeks before shipment.
                    </p>
                    {item.referralCode ? (
                      <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Referral {item.referralCode}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-3 sm:text-right">
                  <p className="text-lg font-semibold text-[var(--color-ink)]">{item.priceLabel}</p>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setItems(updateCartItemQuantity(item.id, item.quantity - 1))}
                      aria-label={`Decrease quantity for ${item.productName}`}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-ink)] transition hover:border-[var(--color-primary)]/35"
                    >
                      <Minus className="size-4" />
                    </button>
                    <div className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-ink)]">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => setItems(updateCartItemQuantity(item.id, item.quantity + 1))}
                      aria-label={`Increase quantity for ${item.productName}`}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-ink)] transition hover:border-[var(--color-primary)]/35"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full sm:w-auto"
                    onClick={() => setItems(removeCartItem(item.id))}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <aside className="space-y-6 xl:sticky xl:top-32 xl:self-start">
        <article className="card-surface rounded-[1.9rem] p-6 sm:p-7">
          <p className="eyebrow">Order Summary</p>
          <div className="mt-5 space-y-3 text-sm text-[var(--color-ink-soft)]">
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Items</span>
              <span>{items.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Availability</span>
              <span>Pre Order</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Fulfillment timing</span>
              <span>2-4 weeks</span>
            </div>
            {referralCode ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                <span>Referral Access</span>
                <span>{REFERRAL_ACCESS_DISCOUNT_PERCENT}% off</span>
              </div>
            ) : null}
            {referralDiscount ? (
              <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
                <span>Discount</span>
                <span>-{currency(referralDiscount)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3">
              <span>Subtotal</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-ink)]">
              <span>Total</span>
              <span>{currency(orderTotal)}</span>
            </div>
          </div>
          <div className="mt-5 rounded-[1.4rem] border border-[rgba(180,83,9,0.2)] bg-[rgba(245,158,11,0.08)] px-4 py-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            Verified referral access bypasses intake requirements and applies {REFERRAL_ACCESS_DISCOUNT_PERCENT}% off the order before secure checkout.
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => void startCheckout()}
              disabled={!referralCode || checkoutLoading}
              className="button-primary inline-flex min-h-14 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "Starting Checkout..." : "Proceed to Secure Checkout"}
            </button>
            {!referralCode ? (
              <p className="text-sm leading-6 text-[var(--color-danger)]">
                Enter and verify a referral code before checkout.
              </p>
            ) : null}
            {checkoutError ? (
              <p className="text-sm leading-6 text-[var(--color-danger)]">{checkoutError}</p>
            ) : null}
            <Link
              href="/products"
              className="button-secondary inline-flex min-h-14 w-full items-center justify-center rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold transition"
            >
              Add More Products
            </Link>
          </div>
        </article>
      </aside>
    </div>
  );
}
