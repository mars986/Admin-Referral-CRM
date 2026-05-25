"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole, ShoppingCart } from "lucide-react";
import {
  REFERRAL_ACCESS_DISCOUNT_PERCENT,
} from "@/lib/referrals/constants";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "apex_referral_code";

type ReferralValidationState =
  | { status: "idle"; code: string; error: string }
  | { status: "validating"; code: string; error: string }
  | { status: "verified"; code: string; error: string; partnerName?: string | null }
  | { status: "invalid"; code: string; error: string };

type SearchParamsReader = {
  get(name: string): string | null;
};

function persistReferralCode(code: string) {
  const normalized = code.trim().toUpperCase();
  localStorage.setItem(STORAGE_KEY, normalized);
  document.cookie = `apex_referral_code=${encodeURIComponent(normalized)}; path=/; max-age=2592000; SameSite=Lax`;
  return normalized;
}

function getInitialCode(searchParams: SearchParamsReader) {
  return (
    searchParams.get("ref") ??
    searchParams.get("code") ??
    (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : "") ??
    ""
  ).trim().toUpperCase();
}

async function verifyReferralCode(
  code: string,
  searchParams: SearchParamsReader,
): Promise<
  | { ok: true; code: string; partnerName?: string | null }
  | { ok: false; error: string }
> {
  const response = await fetch("/api/referral/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      source_page: "/referral",
      utm_source: searchParams.get("utm_source") ?? "",
      utm_medium: searchParams.get("utm_medium") ?? "",
      utm_campaign: searchParams.get("utm_campaign") ?? "",
    }),
  });
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; error?: string; data?: { code?: string; partner_name?: string | null } }
    | null;

  if (!response.ok || !payload?.ok || !payload.data?.code) {
    return {
      ok: false,
      error: payload?.error ?? "This referral code could not be verified.",
    };
  }

  return {
    ok: true,
    code: payload.data.code,
    partnerName: payload.data.partner_name,
  };
}

export function ReferralAccessPageClient() {
  const searchParams = useSearchParams();
  const initialCode = useMemo(() => getInitialCode(searchParams), [searchParams]);
  const [state, setState] = useState<ReferralValidationState>(() => ({
    status: initialCode ? "validating" : "idle",
    code: initialCode,
    error: "",
  }));

  const checkoutHref = useMemo(
    () => (state.status === "verified" ? `/cart?ref=${encodeURIComponent(state.code)}` : "/cart"),
    [state],
  );

  async function validateCode(codeInput = state.code) {
    const code = codeInput.trim().toUpperCase();

    if (!code) {
      setState({ status: "invalid", code, error: "Enter a referral code to continue." });
      return;
    }

    setState({ status: "validating", code, error: "" });
    const result = await verifyReferralCode(code, searchParams);

    if (!result.ok) {
      setState({
        status: "invalid",
        code,
        error: result.error,
      });
      return;
    }

    const verifiedCode = persistReferralCode(result.code);
    setState({
      status: "verified",
      code: verifiedCode,
      partnerName: result.partnerName,
      error: "",
    });
  }

  useEffect(() => {
    if (initialCode) {
      void verifyReferralCode(initialCode, searchParams).then((result) => {
        if (!result.ok) {
          setState({ status: "invalid", code: initialCode, error: result.error });
          return;
        }

        const verifiedCode = persistReferralCode(result.code);
        setState({
          status: "verified",
          code: verifiedCode,
          partnerName: result.partnerName,
          error: "",
        });
      });
    }
  }, [initialCode, searchParams]);

  const isVerified = state.status === "verified";
  const isValidating = state.status === "validating";

  return (
    <div className="site-container grid gap-8 xl:grid-cols-[1fr_0.72fr]">
      <article className="card-surface overflow-hidden rounded-[2rem]">
        <div className="border-b border-[var(--color-border)] bg-[linear-gradient(135deg,#071f45_0%,#123865_58%,#2388d8_100%)] p-6 text-white sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            Referral Access
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Verify once. Shop directly with referral pricing.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
            Approved referral codes unlock the purchase path and apply {REFERRAL_ACCESS_DISCOUNT_PERCENT}% off the order before secure checkout.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-[1.6rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)] p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-[rgba(7,31,69,0.1)] bg-white p-3">
                {isVerified ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <LockKeyhole className="size-5 text-[var(--color-primary)]" />
                )}
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)]">
                  Code Verification
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--color-ink)]">
                  {isVerified ? "Referral access is active" : "Enter your referral code"}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {isVerified
                    ? `Code ${state.code} is verified${state.partnerName ? ` for ${state.partnerName}` : ""}.`
                    : "This route does not require Cloudflare Access. It verifies customer referral access only."}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={state.code}
                onChange={(event) =>
                  setState({ status: "idle", code: event.target.value.toUpperCase(), error: "" })
                }
                placeholder="Enter referral code"
                className={cn(
                  "min-h-13 rounded-xl border bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]",
                  state.status === "invalid" ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
                )}
              />
              <button
                type="button"
                onClick={() => void validateCode()}
                disabled={isValidating}
                className={cn(
                  "button-primary min-h-13 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition",
                  isValidating && "cursor-not-allowed opacity-70",
                )}
              >
                {isValidating ? "Verifying..." : isVerified ? "Re-Verify Code" : "Verify Code"}
              </button>
            </div>

            {state.error ? (
              <p className="mt-3 text-sm leading-6 text-[var(--color-danger)]">{state.error}</p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={isVerified ? `/products?ref=${encodeURIComponent(state.code)}` : "/products"}
              className={cn(
                "button-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition",
                !isVerified && "pointer-events-none opacity-60",
              )}
              aria-disabled={!isVerified}
            >
              Shop Products
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={checkoutHref}
              className={cn(
                "button-secondary inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold transition",
                !isVerified && "pointer-events-none opacity-60",
              )}
              aria-disabled={!isVerified}
            >
              Go to Cart
              <ShoppingCart className="size-4" />
            </Link>
          </div>
        </div>
      </article>

      <aside className="space-y-5 xl:sticky xl:top-32 xl:self-start">
        {[
          ["No Access login", "Customer referral codes do not use Cloudflare Access or one-time PIN callbacks."],
          [`${REFERRAL_ACCESS_DISCOUNT_PERCENT}% off`, "The verified code is applied to eligible order totals at checkout."],
          ["Direct purchase path", "Once verified, customers can add pre-order products and proceed to Stripe checkout."],
        ].map(([title, copy]) => (
          <div key={title} className="card-surface rounded-[1.6rem] p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-frost)]">
              {title}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">{copy}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}
