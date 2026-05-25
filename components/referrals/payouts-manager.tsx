"use client";

import { useState } from "react";
import type { PayoutRecord, ReferralPartnerRecord } from "@/lib/referrals/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency, formatDateTime } from "@/lib/utils";

export function PayoutsManager({
  initialPayouts,
  partners,
}: {
  initialPayouts: PayoutRecord[];
  partners: ReferralPartnerRecord[];
}) {
  const [payouts, setPayouts] = useState(initialPayouts);
  const [form, setForm] = useState({
    partner_id: "",
    amount: "",
    payment_method: "",
    payment_notes: "",
  });

  async function createRecord() {
    const response = await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });
    const payload = (await response.json()) as { data?: PayoutRecord };
    if (payload.data) {
      setPayouts((current) => [payload.data!, ...current]);
      setForm({ partner_id: "", amount: "", payment_method: "", payment_notes: "" });
    }
  }

  async function markPaid(id: string) {
    const response = await fetch(`/api/admin/payouts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    const payload = (await response.json()) as { data?: PayoutRecord };
    if (payload.data) {
      setPayouts((current) => current.map((item) => (item.id === id ? payload.data! : item)));
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Payout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select value={form.partner_id} onChange={(event) => setForm((current) => ({ ...current, partner_id: event.target.value }))}>
            <option value="">Select partner</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>{partner.name}</option>
            ))}
          </Select>
          <Input placeholder="Amount" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
          <Input placeholder="Payment method" value={form.payment_method} onChange={(event) => setForm((current) => ({ ...current, payment_method: event.target.value }))} />
          <Input placeholder="Payment notes" value={form.payment_notes} onChange={(event) => setForm((current) => ({ ...current, payment_notes: event.target.value }))} />
          <div className="md:col-span-2 xl:col-span-4">
            <Button onClick={createRecord}>Create Payout</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.partner_name ?? "Unassigned"}</TableCell>
                  <TableCell>{currency(payout.amount)}</TableCell>
                  <TableCell>{payout.status}</TableCell>
                  <TableCell>{formatDateTime(payout.paid_at)}</TableCell>
                  <TableCell>
                    {payout.status !== "paid" ? (
                      <Button size="sm" onClick={() => void markPaid(payout.id)}>Mark Paid</Button>
                    ) : (
                      <span className="text-xs text-emerald-300">Paid</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
