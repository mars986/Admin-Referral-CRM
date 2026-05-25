"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "apex_referral_code";

function persistReferralCode(code: string) {
  const normalized = code.trim().toUpperCase();
  localStorage.setItem(STORAGE_KEY, normalized);
  document.cookie = `apex_referral_code=${encodeURIComponent(normalized)}; path=/; max-age=2592000; SameSite=Lax`;
}

export function ReferralCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("ref");
    if (!code) {
      return;
    }

    const sourcePage = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const dedupeKey = `apex_referral_capture:${sourcePage}:${code.toUpperCase()}`;
    if (sessionStorage.getItem(dedupeKey)) {
      return;
    }

    void fetch("/api/referral/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        source_page: pathname,
        utm_source: searchParams.get("utm_source") ?? "",
        utm_medium: searchParams.get("utm_medium") ?? "",
        utm_campaign: searchParams.get("utm_campaign") ?? "",
      }),
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean }
          | null;

        if (response.ok && payload?.ok) {
          persistReferralCode(code);
          sessionStorage.setItem(dedupeKey, "1");
        }
      })
      .catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
