import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportsSnapshot } from "@/lib/crm/service";

export default async function ReportsPage() {
  const report = await getReportsSnapshot();
  const sections: Array<{ title: string; rows: Array<{ label: string; value: number }> }> = [
    { title: "Leads by Source", rows: report.leadsBySource },
    { title: "Leads by Status", rows: report.leadsByStatus },
    { title: "Product Interest", rows: report.productInterestBreakdown },
    { title: "Orders by Status", rows: report.ordersByStatus },
    { title: "Email Delivery", rows: report.emailDeliveryStatus },
    { title: "Monthly Lead Volume", rows: report.monthlyLeadVolume },
  ];

  return (
    <div data-admin-page className="grid gap-4 xl:grid-cols-2">
      {sections.map(({ title, rows }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-200">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div className="h-2 rounded-full bg-sky-400" style={{ width: `${row.value * 18}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle>Follow-Up Completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-200">
          <p>Open tasks: {report.followUpCompletion.open}</p>
          <p>Completed tasks: {report.followUpCompletion.completed}</p>
          <p>Estimated revenue: ${report.estimatedRevenue}</p>
        </CardContent>
      </Card>
    </div>
  );
}
