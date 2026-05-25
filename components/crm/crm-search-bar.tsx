import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CRMSearchBar() {
  return (
    <div id="crm-search" className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">CRM Search</p>
        <h2 className="text-lg font-semibold text-zinc-100">Find the next patient touchpoint quickly.</h2>
      </div>
      <form action="/admin/crm/leads" className="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <Input
          name="search"
          placeholder="Search contacts, leads, phone, email..."
          aria-label="Search contacts, leads, phone, or email"
          className="h-12 border-zinc-800 bg-zinc-900/80"
        />
        <Button
          asChild
          variant="secondary"
          className="h-12 min-w-12 border-zinc-800 bg-zinc-900/80 px-4"
        >
          <a href="/admin/crm/leads" aria-label="Open CRM filters">
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </a>
        </Button>
      </form>
    </div>
  );
}
