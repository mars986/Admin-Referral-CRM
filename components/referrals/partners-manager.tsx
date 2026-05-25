"use client";

import { useState } from "react";
import type { ReferralPartnerRecord } from "@/lib/referrals/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export function PartnersManager({
  initialPartners,
  accessEmail,
}: {
  initialPartners: ReferralPartnerRecord[];
  accessEmail?: string | null;
}) {
  const [partners, setPartners] = useState(initialPartners);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
    referral_code: "",
    commission_type: "percentage",
    commission_value: "15",
    status: "pending",
    notes: "",
  });

  async function createPartner() {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessEmail ? { "x-admin-email": accessEmail } : {}),
        },
        body: JSON.stringify({
          ...form,
          commission_value: Number(form.commission_value),
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; data?: ReferralPartnerRecord }
        | null;

      if (!response.ok || !payload?.data) {
        setError(payload?.error ?? "Partner could not be created. Check the form and try again.");
        return;
      }

      setPartners((current) => [payload.data!, ...current]);
      setForm({
        name: "",
        company_name: "",
        email: "",
        phone: "",
        referral_code: "",
        commission_type: "percentage",
        commission_value: "15",
        status: "pending",
        notes: "",
      });
    } catch {
      setError("Partner could not be created. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/partners/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(accessEmail ? { "x-admin-email": accessEmail } : {}),
      },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { data?: ReferralPartnerRecord };
    if (payload.data) {
      setPartners((current) => current.map((item) => (item.id === id ? payload.data! : item)));
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Referral Partners</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input placeholder="Partner name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input placeholder="Company name" value={form.company_name} onChange={(event) => setForm((current) => ({ ...current, company_name: event.target.value }))} />
          <Input placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <Input placeholder="Initial referral code" value={form.referral_code} onChange={(event) => setForm((current) => ({ ...current, referral_code: event.target.value.toUpperCase() }))} />
          <Select value={form.commission_type} onChange={(event) => setForm((current) => ({ ...current, commission_type: event.target.value }))}>
            <option value="flat">Flat fee</option>
            <option value="percentage">Percentage</option>
          </Select>
          <Input placeholder="Commission value" value={form.commission_value} onChange={(event) => setForm((current) => ({ ...current, commission_value: event.target.value }))} />
          <Select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </Select>
          <Input className="md:col-span-2 xl:col-span-4" placeholder="Internal notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          <div className="md:col-span-2 xl:col-span-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={createPartner} disabled={saving}>
              {saving ? "Adding Partner..." : "Add Partner"}
            </Button>
            {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-white">{partner.name}</p>
                        <p className="text-xs text-slate-400">{partner.email ?? "No email"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{partner.referral_code ?? "—"}</TableCell>
                    <TableCell>{partner.commission_type} / {partner.commission_value}</TableCell>
                    <TableCell>
                      <Select value={partner.status} onChange={(event) => void updateStatus(partner.id, event.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(partner.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
