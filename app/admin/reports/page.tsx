import Link from "next/link";
import { MetricCard } from "@/components/crm/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReferralAdminDashboard, listCommissions, listReferralCodes } from "@/lib/referrals/service";
import { currency } from "@/lib/utils";

export default async function ReportsPage() {
  const [snapshot, codes, commissions] = await Promise.all([
    getReferralAdminDashboard(),
    listReferralCodes(),
    listCommissions(),
  ]);
  const liability = commissions.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.commission_amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Monthly Summary" value={snapshot.funnel.leads} helper="Current referral lead volume" />
        <MetricCard label="Partner Performance" value={codes.length} helper="Active and disabled referral codes tracked" />
        <MetricCard label="Conversion Funnel" value={snapshot.funnel.approvedConversions} helper="Approved conversions in the funnel" />
        <MetricCard label="Commission Liability" value={currency(liability)} helper="Unpaid commission exposure" />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exports</CardTitle>
          <Button asChild>
            <Link href="/api/admin/reports/export">
              Export CSV
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>CSV exports include referral code performance, partner mapping, attributed leads, conversions, and revenue.</p>
          {snapshot.revenueByPartner.map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <span>{row.label}</span>
              <span>{currency(row.value)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
