"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReferralCodeRecord, ReferralPartnerRecord } from "@/lib/referrals/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency, formatDate } from "@/lib/utils";

export function ReferralCodesManager({
  initialCodes,
  partners,
}: {
  initialCodes: ReferralCodeRecord[];
  partners: ReferralPartnerRecord[];
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [form, setForm] = useState({
    code: "",
    partner_id: "",
    status: "active",
    landing_url: "",
  });

  async function createCode() {
    const response = await fetch("/api/admin/referral-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const payload = (await response.json()) as { data?: ReferralCodeRecord };
    if (payload.data) {
      setCodes((current) => [payload.data!, ...current]);
      setForm({ code: "", partner_id: "", status: "active", landing_url: "" });
    }
  }

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/referral-codes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { data?: ReferralCodeRecord };
    if (payload.data) {
      setCodes((current) => current.map((item) => (item.id === id ? payload.data! : item)));
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Referral Codes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input placeholder="Code" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} />
          <Select value={form.partner_id} onChange={(event) => setForm((current) => ({ ...current, partner_id: event.target.value }))}>
            <option value="">Unassigned</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>{partner.name}</option>
            ))}
          </Select>
          <Select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </Select>
          <Input placeholder="Landing URL override" value={form.landing_url} onChange={(event) => setForm((current) => ({ ...current, landing_url: event.target.value }))} />
          <div className="md:col-span-2 xl:col-span-4">
            <Button onClick={createCode}>Create Code</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      {code.qr_svg ? (
                        <Image
                          src={`data:image/svg+xml;utf8,${encodeURIComponent(code.qr_svg)}`}
                          alt={`${code.code} referral QR code`}
                          width={56}
                          height={56}
                          unoptimized
                          className="h-14 w-14 rounded-md border border-white/10 bg-white p-1"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-white">{code.code}</p>
                        <p className="text-xs text-slate-400">{formatDate(code.created_at)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{code.partner_name ?? "Unassigned"}</TableCell>
                    <TableCell>{code.clicks} clicks / {code.leads} leads / {code.conversions} conversions / {currency(code.revenue)}</TableCell>
                    <TableCell>
                      <Select value={code.status} onChange={(event) => void updateStatus(code.id, event.target.value)}>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </Select>
                    </TableCell>
                    <TableCell className="max-w-[320px] truncate text-xs text-slate-300">{code.landing_url}</TableCell>
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
