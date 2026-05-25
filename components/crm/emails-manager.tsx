"use client";

import { useState } from "react";
import type { EmailLogRecord, EmailTemplateRecord } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/crm/status-badge";

export function EmailsManager({
  initialTemplates,
  initialLogs,
}: {
  initialTemplates: EmailTemplateRecord[];
  initialLogs: EmailLogRecord[];
}) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [logs] = useState(initialLogs);
  const [testEmail, setTestEmail] = useState("");

  async function saveTemplate(template: EmailTemplateRecord) {
    const response = await fetch(`/api/email-templates/${template.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    const payload = (await response.json()) as { data?: EmailTemplateRecord };
    if (payload?.data) {
      const nextTemplate = payload.data;
      setTemplates((current) => current.map((item) => (item.id === template.id ? nextTemplate : item)));
    }
  }

  async function resend(id: string) {
    await fetch(`/api/email-logs/${id}/resend`, { method: "POST" });
  }

  async function sendTest() {
    await fetch("/api/emails/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientEmail: testEmail }),
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transactional Email Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Send test email to" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} />
          <Button onClick={sendTest}>Send Test Email</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={template.subject}
                onChange={(event) =>
                  setTemplates((current) =>
                    current.map((item) =>
                      item.id === template.id ? { ...item, subject: event.target.value } : item,
                    ),
                  )
                }
              />
              <Textarea
                value={template.text_content}
                onChange={(event) =>
                  setTemplates((current) =>
                    current.map((item) =>
                      item.id === template.id ? { ...item, text_content: event.target.value, html_content: `<p>${event.target.value}</p>` } : item,
                    ),
                  )
                }
              />
              <Button onClick={() => void saveTemplate(template)}>Save Template</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Email Logs</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.recipient_email}</TableCell>
                  <TableCell>{log.event_type}</TableCell>
                  <TableCell><StatusBadge value={log.delivery_status === "sent" ? "Delivered" : log.delivery_status} /></TableCell>
                  <TableCell className="text-right">
                    {log.delivery_status === "failed" ? (
                      <Button size="sm" onClick={() => void resend(log.id)}>Resend</Button>
                    ) : null}
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
