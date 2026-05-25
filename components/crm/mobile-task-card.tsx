"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskRecord } from "@/lib/crm/types";
import { formatDateTime } from "@/lib/utils";

function getTaskPriority(task: TaskRecord) {
  if (task.status === "Completed") {
    return { label: "Done", className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" };
  }

  const dueAt = new Date(task.due_at).getTime();
  const now = Date.now();
  if (Number.isNaN(dueAt)) {
    return { label: "Scheduled", className: "border-zinc-700 bg-zinc-900 text-zinc-300" };
  }

  if (dueAt < now) {
    return { label: "Overdue", className: "border-rose-400/20 bg-rose-400/10 text-rose-200" };
  }

  if (dueAt - now < 1000 * 60 * 60 * 24) {
    return { label: "Today", className: "border-amber-400/20 bg-amber-400/10 text-amber-100" };
  }

  return { label: "Upcoming", className: "border-sky-400/20 bg-sky-400/10 text-sky-100" };
}

type MobileTaskCardProps = {
  task: TaskRecord;
  entityName: string;
  onComplete: (task: TaskRecord) => void;
  pending?: boolean;
};

export function MobileTaskCard({ task, entityName, onComplete, pending = false }: MobileTaskCardProps) {
  const priority = getTaskPriority(task);

  return (
    <article className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-zinc-100">{task.title}</p>
          <p className="mt-1 text-sm text-zinc-400">{entityName}</p>
        </div>
        <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${priority.className}`}>
          {priority.label}
        </span>
      </div>
      <div className="mt-4 space-y-3 text-sm text-zinc-300">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">Due Date</p>
          <p className="mt-2">{formatDateTime(task.due_at)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">Notes</p>
          <p className="mt-2 text-zinc-200">{task.notes || task.description || "Lead follow-up task"}</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => onComplete(task)}
        disabled={pending}
        className="mt-4 h-11 w-full"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {task.status === "Completed" ? "Reopen Task" : "Complete Task"}
      </Button>
    </article>
  );
}
