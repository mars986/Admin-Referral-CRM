import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContact, listRecentNotes } from "@/lib/crm/service";

export default async function ContactProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await getContact(id);

  if (!contact) {
    notFound();
  }

  const notes = await listRecentNotes({ contactId: id });

  return (
    <div data-admin-page className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{contact.first_name} {contact.last_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <p>Status: {contact.customer_status}</p>
          <p>Tags: {contact.tags.join(", ") || "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <p className="text-white">{note.body}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{note.note_type}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
