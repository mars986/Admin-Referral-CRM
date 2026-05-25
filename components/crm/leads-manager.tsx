"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import type { LeadRecord } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/crm/status-badge";
import { formatDate } from "@/lib/utils";

export function LeadsManager({ initialLeads }: { initialLeads: LeadRecord[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    product_interest: "",
    message: "",
    source: "Manual Entry",
  });

  const filtered = useMemo(
    () =>
      leads.filter((lead) => {
        const matchSearch = search
          ? `${lead.first_name} ${lead.last_name} ${lead.email} ${lead.product_interest}`
              .toLowerCase()
              .includes(search.toLowerCase())
          : true;
        const matchStatus = status ? lead.status === status : true;
        const matchSource = source ? lead.source === source : true;
        return matchSearch && matchStatus && matchSource;
      }),
    [leads, search, source, status],
  );

  async function createLead() {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        status: "New",
        lead_value_estimate: 0,
      }),
    });
    const payload = (await response.json()) as { data?: LeadRecord };
    if (payload?.data) {
      const nextLead = payload.data;
      setLeads((current) => [nextLead, ...current]);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        product_interest: "",
        message: "",
        source: "Manual Entry",
      });
    }
  }

  async function updateLeadStatus(id: string, nextStatus: string) {
    const response = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const payload = (await response.json()) as { data?: LeadRecord };
    if (payload?.data) {
      const nextLead = payload.data;
      setLeads((current) => current.map((lead) => (lead.id === id ? nextLead : lead)));
    }
  }

  async function removeLead(id: string) {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads((current) => current.filter((lead) => lead.id !== id));
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Lead Capture</CardTitle>
            <p className="text-sm text-slate-300">Search, triage, export, and update the core lead queue.</p>
          </div>
          <a href="/api/export/leads.csv">
            <Button variant="secondary">
              <Download className="size-4" />
              Export CSV
            </Button>
          </a>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search leads" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Consultation Scheduled">Consultation Scheduled</option>
            <option value="Waiting on Customer">Waiting on Customer</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </Select>
          <Select value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="">All sources</option>
            {["Website", "Intake Form", "Referral", "Google", "Facebook", "Instagram", "Manual Entry"].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4" />
            New Lead
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input placeholder="First name" value={form.first_name} onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))} />
          <Input placeholder="Last name" value={form.last_name} onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))} />
          <Input placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <Input placeholder="Product interest" value={form.product_interest} onChange={(event) => setForm((current) => ({ ...current, product_interest: event.target.value }))} />
          <Select value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}>
            {["Manual Entry", "Website", "Intake Form", "Referral", "Google", "Facebook", "Instagram"].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
          <Input className="md:col-span-2" placeholder="Quick notes" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
          <div className="md:col-span-2 xl:col-span-4">
            <Button onClick={createLead}>Create Lead</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-white">{lead.first_name} {lead.last_name}</p>
                        <p className="text-xs text-slate-400">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{lead.product_interest}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <StatusBadge value={lead.status} />
                    </TableCell>
                    <TableCell>{formatDate(lead.next_follow_up_at)}</TableCell>
                    <TableCell>{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Select
                          className="h-9 min-w-[170px]"
                          value={lead.status}
                          onChange={(event) => void updateLeadStatus(lead.id, event.target.value)}
                        >
                          {["New", "Contacted", "Qualified", "Consultation Scheduled", "Waiting on Customer", "Converted", "Lost"].map((value) => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                        </Select>
                        <Button variant="destructive" size="sm" onClick={() => void removeLead(lead.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
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
