"use client";

import { useMemo, useState } from "react";
import { DollarSign, UserRound } from "lucide-react";
import { MobileLeadCard } from "@/components/crm/mobile-lead-card";
import { StatusBadge } from "@/components/crm/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeadRecord } from "@/lib/crm/types";
import { formatDate } from "@/lib/utils";

type PipelineColumn = {
  id: string;
  name: string;
  cards: LeadRecord[];
};

function getInitialStage(columns: PipelineColumn[]) {
  return columns.find((column) => column.cards.length)?.id ?? columns[0]?.id ?? "";
}

export function MobilePipelineTabs({ columns }: { columns: PipelineColumn[] }) {
  const [activeStageId, setActiveStageId] = useState(() => getInitialStage(columns));

  const activeStage = useMemo(
    () => columns.find((column) => column.id === activeStageId) ?? columns[0],
    [activeStageId, columns],
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Pipeline Snapshot</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Lead stages adapt to a compact tab view on mobile and remain column-based on desktop.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {columns.map((column) => {
            const active = column.id === activeStage?.id;
            return (
              <button
                key={column.id}
                type="button"
                onClick={() => setActiveStageId(column.id)}
                className={`min-h-11 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "border-sky-400/30 bg-[rgba(55,91,142,0.24)] text-zinc-100"
                    : "border-zinc-800 bg-zinc-900/80 text-zinc-400"
                }`}
              >
                <span className="block truncate">{column.name}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-zinc-500">{column.cards.length} leads</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3 md:hidden">
          {activeStage?.cards.length ? (
            activeStage.cards.slice(0, 4).map((lead) => <MobileLeadCard key={lead.id} lead={lead} />)
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-800 px-4 py-6 text-sm text-zinc-500">
              No leads currently in this stage.
            </div>
          )}
        </div>

        <div className="hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-2 2xl:grid-cols-4">
          {columns.map((column) => (
            <div key={column.id} className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/90 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{column.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{column.cards.length} leads</p>
                </div>
              </div>
              <div className="space-y-3">
                {column.cards.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-zinc-100">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">{lead.product_interest}</p>
                      </div>
                      <StatusBadge value={lead.status} />
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-3.5" />
                        <span>Estimated value: ${lead.lead_value_estimate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserRound className="size-3.5" />
                        <span>Next follow-up: {formatDate(lead.next_follow_up_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {!column.cards.length ? (
                  <div className="rounded-2xl border border-dashed border-zinc-800 px-4 py-6 text-sm text-zinc-500">
                    No leads in this stage.
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
