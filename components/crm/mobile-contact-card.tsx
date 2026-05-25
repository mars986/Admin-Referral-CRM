import Link from "next/link";
import { Mail, NotebookPen, Phone, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import type { ContactRecord } from "@/lib/crm/types";
import { formatDate } from "@/lib/utils";

export function MobileContactCard({ contact }: { contact: ContactRecord }) {
  return (
    <article className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-zinc-100">
            {contact.first_name} {contact.last_name}
          </p>
          <p className="mt-1 truncate text-sm text-zinc-400">{contact.email || contact.phone}</p>
        </div>
        <StatusBadge value={contact.customer_status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-300">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">Next Follow Up</p>
          <p className="mt-2">{formatDate(contact.next_follow_up_at)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">Last Contact</p>
          <p className="mt-2">{formatDate(contact.last_contacted_at ?? contact.updated_at)}</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">Interests</p>
        <p className="mt-2 text-sm text-zinc-200">
          {contact.product_interests.length ? contact.product_interests.join(", ") : "No recorded product interests"}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button asChild className="h-11 flex-1">
          <Link href={`/admin/crm/contacts/${contact.id}`}>
            <UserRound className="size-4" />
            View Contact
          </Link>
        </Button>
        <Button asChild variant="secondary" className="h-11 min-w-11 px-3">
          <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.first_name} ${contact.last_name}`}>
            <Mail className="size-4" />
          </a>
        </Button>
        <Button asChild variant="secondary" className="h-11 min-w-11 px-3">
          <a href={`tel:${contact.phone}`} aria-label={`Call ${contact.first_name} ${contact.last_name}`}>
            <Phone className="size-4" />
          </a>
        </Button>
        <Button asChild variant="secondary" className="h-11 min-w-11 px-3">
          <Link href="/admin/crm/tasks" aria-label={`Add note for ${contact.first_name} ${contact.last_name}`}>
            <NotebookPen className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
