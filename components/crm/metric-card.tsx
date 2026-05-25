import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper: string;
  className?: string;
};

export function MetricCard({ label, value, helper, className }: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex min-h-[11rem] flex-col justify-between space-y-4 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
        <p className="text-sm text-slate-300">{helper}</p>
      </CardContent>
    </Card>
  );
}
