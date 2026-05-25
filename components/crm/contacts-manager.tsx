"use client";

import { useState } from "react";
import type { ContactRecord } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/crm/status-badge";

export function ContactsManager({ initialContacts }: { initialContacts: ContactRecord[] }) {
  const [contacts, setContacts] = useState(initialContacts);

  async function saveContact(contact: ContactRecord) {
    const response = await fetch(`/api/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    const payload = (await response.json()) as { data?: ContactRecord };
    if (payload?.data) {
      const nextContact = payload.data;
      setContacts((current) => current.map((item) => (item.id === contact.id ? nextContact : item)));
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {contacts.map((contact) => (
        <Card key={contact.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>{contact.first_name} {contact.last_name}</span>
              <StatusBadge value={contact.customer_status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={contact.email} readOnly />
            <Input
              value={contact.phone}
              onChange={(event) =>
                setContacts((current) =>
                  current.map((item) =>
                    item.id === contact.id ? { ...item, phone: event.target.value } : item,
                  ),
                )
              }
            />
            <Input
              value={contact.customer_status}
              onChange={(event) =>
                setContacts((current) =>
                  current.map((item) =>
                    item.id === contact.id ? { ...item, customer_status: event.target.value } : item,
                  ),
                )
              }
            />
            <Input
              value={contact.tags.join(", ")}
              onChange={(event) =>
                setContacts((current) =>
                  current.map((item) =>
                    item.id === contact.id
                      ? { ...item, tags: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) }
                      : item,
                  ),
                )
              }
              placeholder="Tags"
            />
            <Textarea
              value={contact.notes_summary ?? ""}
              onChange={(event) =>
                setContacts((current) =>
                  current.map((item) =>
                    item.id === contact.id ? { ...item, notes_summary: event.target.value } : item,
                  ),
                )
              }
            />
            <Button onClick={() => void saveContact(contact)}>Save Contact</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
