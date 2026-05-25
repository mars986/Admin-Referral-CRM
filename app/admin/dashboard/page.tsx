import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  BellRing,
  ChartNoAxesColumn,
  Clock3,
  QrCode,
  ShieldAlert,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/crm/metric-card";
import { QuickActionGrid } from "@/components/crm/quick-action-grid";
import { ResponsiveAdminTable } from "@/components/crm/responsive-admin-table";
import { ResponsiveStatGrid } from "@/components/crm/responsive-stat-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReferralAdminDashboard } from "@/lib/referrals/service";
import { currency, formatDateTime } from "@/lib/utils";

export default async function ReferralDashboardPage() {
  const snapshot = await getReferralAdminDashboard();

  const quickActions = [
    {
      label: "Review Patients",
      description: "Move through newly referred patients, intake status, and review queues without leaving the dashboard.",
      href: "/admin/leads",
      icon: Users,
    },
    {
      label: "Manage Referral Codes",
      description: "Create, assign, and audit referral codes with direct access to performance and activation status.",
      href: "/admin/referral-codes",
      icon: QrCode,
    },
    {
      label: "Track Orders",
      description: "Inspect approved conversions and order-linked revenue before commissions or payout actions.",
      href: "/admin/conversions",
      icon: BadgeDollarSign,
    },
    {
      label: "Resolve Alerts",
      description: "Review suspicious patterns, duplicate signals, and high-risk submissions in the fraud queue.",
      href: "/admin/fraud",
      icon: ShieldAlert,
    },
  ] as const;

  const funnelItems = [
    { label: "Clicks", value: snapshot.funnel.clicks, helper: "Tracked referral visits and entry activity.", icon: BellRing },
    { label: "Leads", value: snapshot.funnel.leads, helper: "Referred patient records created from validated codes.", icon: Users },
    {
      label: "Approved Conversions",
      value: snapshot.funnel.approvedConversions,
      helper: "Conversions ready for commission calculation or payout review.",
      icon: BadgeDollarSign,
    },
    {
      label: "Purchases",
      value: snapshot.funnel.purchases,
      helper: "Referred orders that completed the purchase stage successfully.",
      icon: ChartNoAxesColumn,
    },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 pt-6 sm:pt-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Referral Command Center</p>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                Monitor partner performance, patient movement, and revenue readiness from one mobile-safe dashboard.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                This admin view is tuned for fast check-ins on smaller screens and keeps the same referral logic, reporting,
                and protected access workflow already in production.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Active workflow</p>
                <p className="mt-2 text-base font-semibold text-white">Referral validation, lead attribution, and commission review remain live.</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Access model</p>
                <p className="mt-2 text-base font-semibold text-white">Cloudflare Access continues to protect the dashboard and all referral routes.</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Mobile behavior</p>
                <p className="mt-2 text-base font-semibold text-white">Navigation, KPI density, and table-heavy sections now adapt cleanly below `md`.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm leading-6 text-slate-300">
              Jump into the queues that usually need same-day action from a phone-sized viewport.
            </p>
          </CardHeader>
          <CardContent>
            <QuickActionGrid actions={[...quickActions]} />
          </CardContent>
        </Card>
      </section>

      <ResponsiveStatGrid>
        {snapshot.cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </ResponsiveStatGrid>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <Card>
          <CardHeader>
            <CardTitle>Referral Funnel</CardTitle>
            <p className="text-sm leading-6 text-slate-300">Click -&gt; Lead -&gt; Approved Conversion -&gt; Purchase, optimized for at-a-glance review.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {funnelItems.map(({ label, value, helper, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(56,90,135,0.2)]">
                      <Icon className="size-5 text-slate-100" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{helper}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ResponsiveAdminTable
          title="Recent Referral Activity"
          description="Recent clicks, lead creation events, and approved conversion activity in one responsive feed."
          data={snapshot.recentActivity}
          columns={[
            {
              key: "type",
              header: "Type",
              className: "w-[130px]",
              cell: (item) => (
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                  {item.type}
                </span>
              ),
            },
            {
              key: "description",
              header: "Activity",
              cell: (item) => <span className="text-sm leading-6 text-slate-100">{item.description}</span>,
            },
            {
              key: "created",
              header: "Created",
              className: "w-[180px]",
              cell: (item) => <span className="text-sm text-slate-300">{formatDateTime(item.created_at)}</span>,
            },
          ]}
          mobileCard={(item) => ({
            title: item.description,
            eyebrow: item.type,
            meta: (
              <div className="flex items-center gap-1">
                <Clock3 className="size-3.5" />
                <span>{formatDateTime(item.created_at)}</span>
              </div>
            ),
            content: (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Open queue</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-[rgb(169,197,235)]">
                  <span>Review</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            ),
          })}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <ResponsiveAdminTable
          title="Revenue by Partner"
          description="Attribution totals from referral-linked conversions, adapted into card rows on mobile."
          data={snapshot.revenueByPartner}
          columns={[
            {
              key: "partner",
              header: "Partner",
              cell: (item) => <span className="font-medium text-slate-100">{item.label}</span>,
            },
            {
              key: "revenue",
              header: "Revenue",
              className: "w-[180px]",
              cell: (item) => <span className="font-semibold text-white">{currency(item.value)}</span>,
            },
          ]}
          mobileCard={(item) => ({
            title: item.label,
            eyebrow: "Partner Revenue",
            content: (
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Attributed revenue</span>
                <span className="text-base font-semibold text-white">{currency(item.value)}</span>
              </div>
            ),
          })}
        />

        <Card>
          <CardHeader>
            <CardTitle>Priority Watchlist</CardTitle>
            <p className="text-sm leading-6 text-slate-300">
              Key mobile-safe reminders for the queues that most often block referral throughput.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 px-4 py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 text-amber-300" />
                <div>
                  <p className="font-semibold text-white">Manual fraud review still matters</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Review duplicate hashes, self-referral flags, and unusual conversion patterns before approving payouts.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="flex items-start gap-3">
                <BellRing className="mt-0.5 size-5 text-[rgb(169,197,235)]" />
                <div>
                  <p className="font-semibold text-white">Pending patient follow-up</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Leads still waiting on intake completion or consultation review should be handled before payout approvals.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="flex items-start gap-3">
                <BadgeDollarSign className="mt-0.5 size-5 text-emerald-300" />
                <div>
                  <p className="font-semibold text-white">Commission exposure</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Estimated commission balances stay aligned with approved conversions and payout-ready review status.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
