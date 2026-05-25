"use client";

import Image from "next/image";
import { useState } from "react";
import type { PartnerPortalSnapshot } from "@/lib/referrals/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { currency } from "@/lib/utils";

export function PartnerPortalAccess({
  turnstileSiteKey,
}: {
  turnstileSiteKey: string;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState<PartnerPortalSnapshot | null>(null);

  async function accessPortal() {
    setError("");
    const response = await fetch("/api/referral/partner-portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, turnstileToken }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string; data?: PartnerPortalSnapshot }
      | null;
    if (!response.ok || !payload?.ok || !payload.data) {
      setError(payload?.error ?? "Partner access could not be verified.");
      return;
    }
    setSnapshot(payload.data);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Partner Portal Access</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Partner email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input placeholder="Referral code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
          <div className="md:col-span-2">
            <TurnstileField siteKey={turnstileSiteKey} value={turnstileToken} onChange={setTurnstileToken} />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button onClick={accessPortal}>Open Partner Portal</Button>
            {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          </div>
        </CardContent>
      </Card>
      {snapshot ? (
        <Card>
          <CardHeader>
            <CardTitle>{snapshot.partner.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Codes</p>
              <p className="mt-2 text-2xl font-semibold text-white">{snapshot.codes.length}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Conversions</p>
              <p className="mt-2 text-2xl font-semibold text-white">{snapshot.conversions.length}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Unpaid Commissions</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {currency(snapshot.commissions.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.commission_amount, 0))}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Payout History</p>
              <p className="mt-2 text-2xl font-semibold text-white">{snapshot.payouts.length}</p>
            </div>
          </CardContent>
          {snapshot.codes.length ? (
            <CardContent className="grid gap-3 border-t border-white/8 pt-4 md:grid-cols-2">
              {snapshot.codes.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-md border border-white/8 bg-white/[0.03] p-3">
                  {item.qr_svg ? (
                    <Image
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(item.qr_svg)}`}
                      alt={`${item.code} referral QR code`}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-md border border-white/10 bg-white p-1"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{item.code}</p>
                    <p className="truncate text-xs text-slate-400">{item.landing_url}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
