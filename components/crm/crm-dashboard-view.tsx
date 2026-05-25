"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Clock3,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { CRMQuickActions } from "@/components/crm/crm-quick-actions";
import { CRMSearchBar } from "@/components/crm/crm-search-bar";
import { MetricCard } from "@/components/crm/metric-card";
import { MobileContactCard } from "@/components/crm/mobile-contact-card";
import { MobileLeadCard } from "@/components/crm/mobile-lead-card";
import { MobilePipelineTabs } from "@/components/crm/mobile-pipeline-tabs";
import { MobileTaskCard } from "@/components/crm/mobile-task-card";
import { ResponsiveCRMStatGrid } from "@/components/crm/responsive-crm-stat-grid";
import { ResponsiveCRMTable } from "@/components/crm/responsive-crm-table";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactRecord, LeadRecord, TaskRecord } from "@/lib/crm/types";
import { formatDate, formatDateTime } from "@/lib/utils";

type DashboardSnapshot = {
  cards: Array<{ label: string; value: number | string; helper: string }>;
  recentActivity: Array<{ id: string; type: string; description: string; created_at: string }>;
  leadSourceBreakdown: Array<{ label: string; value: number }>;
  productInterestBreakdown: Array<{ label: string; value: number }>;
};

type PipelineColumn = {
  id: string;
  name: string;
  cards: LeadRecord[];
};

type CRMDashboardViewProps = {
  snapshot: DashboardSnapshot;
  leads: LeadRecord[];
  contacts: ContactRecord[];
  tasks: TaskRecord[];
  pipeline: PipelineColumn[];
};

function getTaskEntityName(task: TaskRecord, leads: LeadRecord[], contacts: ContactRecord[]) {
  const linkedLead = leads.find((lead) => lead.id === task.lead_id);
  if (linkedLead) {
    return `${linkedLead.first_name} ${linkedLead.last_name}`;
  }

  const linkedContact = contacts.find((contact) => contact.id === task.contact_id);
  if (linkedContact) {
    return `${linkedContact.first_name} ${linkedContact.last_name}`;
  }

  return "Apex Wellness patient";
}

export function CRMDashboardView({
  snapshot,
  leads,
  contacts,
  tasks: initialTasks,
  pipeline,
}: CRMDashboardViewProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [pendingTaskIds, setPendingTaskIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  const prioritizedTasks = useMemo(
    () =>
      [...tasks]
        .sort((left, right) => new Date(left.due_at).getTime() - new Date(right.due_at).getTime())
        .slice(0, 5),
    [tasks],
  );

  function toggleTask(task: TaskRecord) {
    setPendingTaskIds((current) => [...current, task.id]);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: task.status === "Completed" ? "Open" : "Completed" }),
        });
        const payload = (await response.json()) as { data?: TaskRecord };

        if (payload?.data) {
          setTasks((current) => current.map((item) => (item.id === task.id ? payload.data! : item)));
        }
      } finally {
        setPendingTaskIds((current) => current.filter((id) => id !== task.id));
      }
    });
  }

  return (
    <div data-admin-page className="space-y-4 sm:space-y-5">
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-5 pt-6 sm:pt-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Apex Wellness CRM</p>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-[2rem]">
                Mobile-ready command coverage for leads, contacts, follow-ups, and pipeline movement.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                This dashboard keeps the live CRM data model intact while compressing search, action shortcuts, patient
                tables, and follow-up work into a cleaner mobile workflow.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-zinc-800 bg-zinc-900/80 px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">Lead Queue</p>
                <p className="mt-2 text-base font-semibold text-zinc-100">Search, source triage, and next-touch routing stay visible on small screens.</p>
              </div>
              <div className="rounded-[1.35rem] border border-zinc-800 bg-zinc-900/80 px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">Contact View</p>
                <p className="mt-2 text-base font-semibold text-zinc-100">Customer details, notes, and follow-up dates are readable without horizontal scroll.</p>
              </div>
              <div className="rounded-[1.35rem] border border-zinc-800 bg-zinc-900/80 px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">Follow-Up</p>
                <p className="mt-2 text-base font-semibold text-zinc-100">Open tasks can be completed directly from the dashboard card view.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <CRMSearchBar />
          <CRMQuickActions />
        </div>
      </section>

      <ResponsiveCRMStatGrid>
        {snapshot.cards.map((card, index) => (
          <MetricCard
            key={card.label}
            {...card}
            helper={
              index === 0
                ? `${card.helper} - Live intake visibility`
                : index === 1
                  ? `${card.helper} - Today's capture pace`
                  : index === 3
                    ? `${card.helper} - Review due now`
                    : card.helper
            }
          />
        ))}
      </ResponsiveCRMStatGrid>

      <MobilePipelineTabs columns={pipeline} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        <ResponsiveCRMTable
          title="Recent Leads"
          description="Lead records shift into stacked action cards below md while the desktop table remains intact."
          data={leads}
          columns={[
            {
              key: "name",
              header: "Name",
              cell: (lead) => (
                <div>
                  <p className="font-semibold text-zinc-100">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-xs text-zinc-500">{lead.email}</p>
                </div>
              ),
            },
            {
              key: "source",
              header: "Source",
              cell: (lead) => <span className="text-sm text-zinc-300">{lead.source}</span>,
            },
            {
              key: "status",
              header: "Status",
              cell: (lead) => <StatusBadge value={lead.status} />,
            },
            {
              key: "followUp",
              header: "Last Contact",
              className: "w-[180px]",
              cell: (lead) => <span className="text-sm text-zinc-400">{formatDate(lead.last_contacted_at ?? lead.created_at)}</span>,
            },
            {
              key: "actions",
              header: "Actions",
              className: "w-[210px]",
              cell: (lead) => (
                <div className="flex items-center justify-end gap-2">
                  <Button asChild size="sm" className="h-9">
                    <Link href="/admin/crm/leads">Manage</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="h-9 px-3">
                    <a href={`mailto:${lead.email}`} aria-label={`Email ${lead.first_name} ${lead.last_name}`}>
                      <Mail className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="h-9 px-3">
                    <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.first_name} ${lead.last_name}`}>
                      <Phone className="size-4" />
                    </a>
                  </Button>
                </div>
              ),
            },
          ]}
          mobileCards={(lead) => <MobileLeadCard lead={lead} />}
        />

        <ResponsiveCRMTable
          title="Recent Contacts"
          description="Customer profiles stay editable on the dedicated contacts route, with mobile-safe summary cards here."
          data={contacts}
          columns={[
            {
              key: "name",
              header: "Contact",
              cell: (contact) => (
                <div>
                  <p className="font-semibold text-zinc-100">
                    {contact.first_name} {contact.last_name}
                  </p>
                  <p className="text-xs text-zinc-500">{contact.email}</p>
                </div>
              ),
            },
            {
              key: "interests",
              header: "Interests",
              cell: (contact) => <span className="text-sm text-zinc-300">{contact.product_interests.join(", ") || "None"}</span>,
            },
            {
              key: "status",
              header: "Status",
              cell: (contact) => <StatusBadge value={contact.customer_status} />,
            },
            {
              key: "followUp",
              header: "Next Follow Up",
              className: "w-[190px]",
              cell: (contact) => <span className="text-sm text-zinc-400">{formatDate(contact.next_follow_up_at)}</span>,
            },
            {
              key: "actions",
              header: "Actions",
              className: "w-[210px]",
              cell: (contact) => (
                <div className="flex items-center justify-end gap-2">
                  <Button asChild size="sm" className="h-9">
                    <Link href={`/admin/crm/contacts/${contact.id}`}>View</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="h-9 px-3">
                    <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.first_name} ${contact.last_name}`}>
                      <Mail className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="h-9 px-3">
                    <a href={`tel:${contact.phone}`} aria-label={`Call ${contact.first_name} ${contact.last_name}`}>
                      <Phone className="size-4" />
                    </a>
                  </Button>
                </div>
              ),
            },
          ]}
          mobileCards={(contact) => <MobileContactCard contact={contact} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.94fr]">
        <ResponsiveCRMTable
          title="Open Tasks & Follow-Ups"
          description="Upcoming tasks collapse into mobile task cards with direct complete and reopen controls."
          data={prioritizedTasks}
          columns={[
            {
              key: "task",
              header: "Task",
              cell: (task) => (
                <div>
                  <p className="font-semibold text-zinc-100">{task.title}</p>
                  <p className="text-xs text-zinc-500">{getTaskEntityName(task, leads, contacts)}</p>
                </div>
              ),
            },
            {
              key: "due",
              header: "Due",
              className: "w-[180px]",
              cell: (task) => <span className="text-sm text-zinc-400">{formatDateTime(task.due_at)}</span>,
            },
            {
              key: "status",
              header: "Status",
              className: "w-[130px]",
              cell: (task) => <StatusBadge value={task.status} />,
            },
            {
              key: "action",
              header: "Action",
              className: "w-[180px]",
              cell: (task) => (
                <Button
                  type="button"
                  size="sm"
                  className="h-9"
                  onClick={() => toggleTask(task)}
                  disabled={pendingTaskIds.includes(task.id)}
                >
                  {task.status === "Completed" ? "Reopen" : "Complete"}
                </Button>
              ),
            },
          ]}
          mobileCards={(task) => (
            <MobileTaskCard
              task={task}
              entityName={getTaskEntityName(task, leads, contacts)}
              onComplete={toggleTask}
              pending={pendingTaskIds.includes(task.id)}
            />
          )}
        />

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm leading-6 text-zinc-400">Latest CRM touchpoints, submissions, and internal actions.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-[1.35rem] border border-zinc-800 bg-zinc-900/80 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-100">{activity.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{activity.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock3 className="size-3.5" />
                      <span>{formatDateTime(activity.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts & Queue Watch</CardTitle>
              <p className="text-sm leading-6 text-zinc-400">High-friction areas that usually need same-day CRM attention.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[1.35rem] border border-amber-400/20 bg-amber-400/10 px-4 py-4">
                <div className="flex items-start gap-3">
                  <BellRing className="mt-0.5 size-5 text-amber-200" />
                  <div>
                    <p className="font-semibold text-zinc-100">Pending follow-ups</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {snapshot.cards.find((card) => card.label === "Pending follow-ups")?.value ?? 0} tasks are still open in the current CRM queue.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.35rem] border border-zinc-800 bg-zinc-900/80 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 size-5 text-sky-300" />
                  <div>
                    <p className="font-semibold text-zinc-100">Lead source imbalance</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Review high-volume sources first to keep intake response times predictable across the day.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild variant="secondary" className="h-11 w-full border-zinc-800 bg-zinc-900/80">
                <Link href="/admin/crm/tasks">
                  View Alert Queues
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Breakdown</CardTitle>
            <p className="text-sm leading-6 text-zinc-400">Source mix stays readable on mobile without shrinking text into a dense table.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.leadSourceBreakdown.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm text-zinc-200">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-sky-400" style={{ width: `${Math.min(row.value * 18, 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Interest Breakdown</CardTitle>
            <p className="text-sm leading-6 text-zinc-400">Product demand remains visible while preserving the existing CRM reporting queries.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.productInterestBreakdown.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm text-zinc-200">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${Math.min(row.value * 18, 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
