"use client";

import { useState } from "react";
import type { ReferralLeadRecord } from "@/lib/referrals/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export function ReferralLeadsManager({ initialLeads }: { initialLeads: ReferralLeadRecord[] }) {
  const [leads, setLeads] = useState(initialLeads);

  async function updateLead(id: string, intake_status: string) {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake_status }),
    });
    const payload = (await response.json()) as { data?: ReferralLeadRecord };
    if (payload.data) {
      setLeads((current) => current.map((lead) => (lead.id === id ? payload.data! : lead)));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Leads</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Source Page</TableHead>
              <TableHead>Intake Status</TableHead>
              <TableHead>Consultation</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-white">{lead.customer_name}</p>
                    <p className="text-xs text-slate-400">{lead.customer_email_hash.slice(0, 12)}…</p>
                  </div>
                </TableCell>
                <TableCell>{lead.referral_code}</TableCell>
                <TableCell>{lead.source_page}</TableCell>
                <TableCell>
                  <Select value={lead.intake_status} onChange={(event) => void updateLead(lead.id, event.target.value)}>
                    {["new","intake_started","intake_submitted","consultation_pending","approved","rejected","purchased","cancelled"].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{lead.consultation_status}</TableCell>
                <TableCell>{lead.order_status}</TableCell>
                <TableCell>{formatDateTime(lead.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
