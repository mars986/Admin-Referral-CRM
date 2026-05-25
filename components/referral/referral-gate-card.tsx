"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { addCartItem } from "@/lib/cart";
import type { ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

type ReferralGateCardProps = {
  id?: string;
  productName: string;
  sourcePage: string;
  turnstileSiteKey: string;
  unlockedHref?: string;
  productSlug?: string;
  productHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  variants?: ProductVariant[];
  variantStorageKey?: string;
};

const STORAGE_KEY = "apex_referral_code";

function persistReferralCode(code: string) {
  const normalized = code.trim().toUpperCase();
  localStorage.setItem(STORAGE_KEY, normalized);
  document.cookie = `apex_referral_code=${encodeURIComponent(normalized)}; path=/; max-age=2592000; SameSite=Lax`;
  return normalized;
}

function getInitialStoredCode() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function ReferralGateCard({
  id,
  productName,
  sourcePage,
  turnstileSiteKey,
  unlockedHref = "/cart?gated=1",
  productSlug,
  productHref,
  imageSrc,
  imageAlt,
  variants,
  variantStorageKey,
}: ReferralGateCardProps) {
  const router = useRouter();
  const [storedCode, setStoredCode] = useState(getInitialStoredCode);
  const [code, setCode] = useState(getInitialStoredCode);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [validating, setValidating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const isUnlocked = Boolean(storedCode);

  const helperText = useMemo(
    () =>
      isUnlocked
        ? `${productName} is unlocked for product availability with code ${storedCode}.`
        : "Enter your referral code to unlock product availability and continue to purchase.",
    [isUnlocked, productName, storedCode],
  );

  async function validateCode() {
    setValidating(true);
    setError("");

    const response = await fetch("/api/referral/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        source_page: sourcePage,
        utm_source: new URLSearchParams(window.location.search).get("utm_source") ?? "",
        utm_medium: new URLSearchParams(window.location.search).get("utm_medium") ?? "",
        utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? "",
        turnstileToken,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string; data?: { code: string } }
      | null;

    setValidating(false);

    if (!response.ok || !payload?.ok || !payload.data?.code) {
      setError(payload?.error ?? "Please enter a valid referral code to continue.");
      return;
    }

    const normalized = persistReferralCode(payload.data.code);
    setStoredCode(normalized);
    setCode(normalized);
    setTurnstileToken("");
  }

  function getSelectedVariant() {
    const fallbackVariant = variants?.[0];

    if (!variants?.length) {
      return null;
    }

    if (typeof window === "undefined" || !variantStorageKey) {
      return fallbackVariant;
    }

    const storedVariantLabel = window.localStorage.getItem(variantStorageKey);
    return variants.find((variant) => variant.label === storedVariantLabel) ?? fallbackVariant;
  }

  function handleAddToCart() {
    const selectedVariant = getSelectedVariant();

    if (!selectedVariant || !productSlug || !productHref) {
      router.push(unlockedHref);
      return;
    }

    setAdding(true);

    addCartItem({
      productSlug,
      productName,
      productHref,
      imageSrc,
      imageAlt,
      variantLabel: selectedVariant.label,
      priceLabel: selectedVariant.price,
      referralCode: storedCode,
      status: "pre-order",
    });

    router.push("/cart");
  }

  return (
    <div
      id={id}
      className="rounded-[1.8rem] border border-[rgba(12,30,57,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#f4f8fc_100%)] p-5 shadow-[0_20px_48px_rgba(7,31,69,0.08)]"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-[rgba(7,31,69,0.1)] bg-[var(--color-cloud)] p-3">
          {isUnlocked ? (
            <CheckCircle2 className="size-5 text-emerald-600" />
          ) : (
            <LockKeyhole className="size-5 text-[var(--color-primary)]" />
          )}
        </div>
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)]">
            Referral Access
          </p>
          <h3 className="text-xl font-semibold text-[var(--color-ink)]">
            {isUnlocked ? "Gated access unlocked" : "Referral code required"}
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">{helperText}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Enter referral code"
          className={cn(
            "min-h-13 rounded-xl border bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]",
            error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
          )}
          disabled={isUnlocked}
        />
        <button
          type="button"
          onClick={() => void validateCode()}
          disabled={validating || isUnlocked}
          className={cn(
            "button-primary min-h-13 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition",
            (validating || isUnlocked) && "cursor-not-allowed opacity-70",
          )}
        >
          {isUnlocked ? "Verified" : validating ? "Validating..." : "Unlock Access"}
        </button>
      </div>

      {!isUnlocked ? (
        <div className="mt-4 space-y-3">
          <TurnstileField
            siteKey={turnstileSiteKey}
            value={turnstileToken}
            onChange={setTurnstileToken}
          />
          {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
        </div>
      ) : null}

      {isUnlocked ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            <ShieldCheck className="size-4" />
            {storedCode}
          </div>
          {productSlug && productHref && variants?.length ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className={cn(
                "button-primary inline-flex min-h-13 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition",
                adding && "cursor-not-allowed opacity-70",
              )}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          ) : (
            <Link
              href={unlockedHref}
              className="button-primary inline-flex min-h-13 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition"
            >
              Continue to Gated Purchase
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
