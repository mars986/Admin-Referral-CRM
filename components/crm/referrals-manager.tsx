"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ReferralRow = {
  id: string;
  referral_source: string;
  referral_code: string | null;
  conversion_value: number;
  commission_estimate: number;
  created_at: string;
};

export function ReferralsManager({ initialReferrals }: { initialReferrals: ReferralRow[] }) {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [draft, setDraft] = useState({
    referral_source: "",
    referral_code: "",
    conversion_value: "0",
    commission_estimate: "0",
  });

  async function createReferral() {
    const response = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const payload = (await response.json()) as { data?: { id?: string } };
    if (payload?.data?.id) {
      const referralId = payload.data.id;
      setReferrals((current) => [
        {
          id: referralId,
          referral_source: draft.referral_source,
          referral_code: draft.referral_code,
          conversion_value: Number(draft.conversion_value),
          commission_estimate: Number(draft.commission_estimate),
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
      setDraft({ referral_source: "", referral_code: "", conversion_value: "0", commission_estimate: "0" });
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Referral Attribution</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Source" value={draft.referral_source} onChange={(event) => setDraft((current) => ({ ...current, referral_source: event.target.value }))} />
          <Input placeholder="Code" value={draft.referral_code} onChange={(event) => setDraft((current) => ({ ...current, referral_code: event.target.value }))} />
          <Input placeholder="Conversion value" value={draft.conversion_value} onChange={(event) => setDraft((current) => ({ ...current, conversion_value: event.target.value }))} />
          <Input placeholder="Commission estimate" value={draft.commission_estimate} onChange={(event) => setDraft((current) => ({ ...current, commission_estimate: event.target.value }))} />
          <div className="md:col-span-4">
            <Button onClick={createReferral}>Create Referral</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.referral_source}</TableCell>
                  <TableCell>{referral.referral_code ?? "—"}</TableCell>
                  <TableCell>${referral.conversion_value}</TableCell>
                  <TableCell>${referral.commission_estimate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
