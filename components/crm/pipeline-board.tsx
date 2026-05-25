"use client";

import { useMemo, useState, useTransition } from "react";
import { DollarSign, GripVertical, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/crm/status-badge";
import { formatDate } from "@/lib/utils";
import type { LeadRecord } from "@/lib/crm/types";

type PipelineColumn = {
  id: string;
  name: string;
  cards: LeadRecord[];
};

export function PipelineBoard({ initialColumns }: { initialColumns: PipelineColumn[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [dragging, setDragging] = useState<LeadRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const stageIds = useMemo(() => new Set(columns.map((column) => column.id)), [columns]);

  async function moveLead(lead: LeadRecord, stageId: string) {
    if (!stageIds.has(stageId)) {
      return;
    }

    setColumns((current) =>
      current.map((column) => ({
        ...column,
        cards:
          column.id === stageId
            ? [{ ...lead, pipeline_stage_id: stageId, pipeline_stage_name: column.name }, ...column.cards.filter((card) => card.id !== lead.id)]
            : column.cards.filter((card) => card.id !== lead.id),
      })),
    );

    startTransition(async () => {
      await fetch(`/api/pipeline/${lead.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId }),
      });
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <Card
          key={column.id}
          className="min-h-[320px]"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (dragging) {
              void moveLead(dragging, column.id);
            }
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{column.name}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {column.cards.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {column.cards.map((card) => (
              <button
                key={card.id}
                type="button"
                draggable
                onDragStart={() => setDragging(card)}
                onDragEnd={() => setDragging(null)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {card.first_name} {card.last_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{card.product_interest}</p>
                  </div>
                  <GripVertical className="size-4 text-slate-500" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge value={card.status} />
                </div>
                <div className="mt-4 grid gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-3.5" />
                    <span>Estimated value: ${card.lead_value_estimate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound className="size-3.5" />
                    <span>Next follow-up: {formatDate(card.next_follow_up_at)}</span>
                  </div>
                </div>
              </button>
            ))}
            {!column.cards.length ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
                No cards in this stage.
              </div>
            ) : null}
            {isPending ? <p className="text-xs text-slate-500">Saving stage change…</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
