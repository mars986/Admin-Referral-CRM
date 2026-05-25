"use client";

import { useState } from "react";
import type { CommissionRecord } from "@/lib/referrals/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency, formatDateTime } from "@/lib/utils";

export function CommissionsManager({ initialCommissions }: { initialCommissions: CommissionRecord[] }) {
  const [commissions, setCommissions] = useState(initialCommissions);

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/commissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { data?: CommissionRecord };
    if (payload.data) {
      setCommissions((current) => current.map((item) => (item.id === id ? payload.data! : item)));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commissions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>{commission.partner_name ?? "Unassigned"}</TableCell>
                <TableCell>{commission.referral_code}</TableCell>
                <TableCell>{commission.commission_type} / {commission.commission_value}</TableCell>
                <TableCell>{currency(commission.commission_amount)}</TableCell>
                <TableCell>
                  <Select value={commission.status} onChange={(event) => void updateStatus(commission.id, event.target.value)}>
                    {["pending","approved","rejected","adjusted","paid"].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{formatDateTime(commission.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
