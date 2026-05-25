import { Badge } from "@/components/ui/badge";

const map: Record<string, "emerald" | "amber" | "rose" | "sky" | "slate"> = {
  New: "sky",
  Contacted: "sky",
  Qualified: "emerald",
  "Consultation Scheduled": "emerald",
  "Waiting on Customer": "amber",
  Converted: "emerald",
  Lost: "rose",
  Pending: "amber",
  Paid: "emerald",
  Processing: "sky",
  Shipped: "sky",
  Delivered: "emerald",
  Cancelled: "rose",
  Refunded: "rose",
  Open: "amber",
  Completed: "emerald",
};

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant={map[value] ?? "slate"}>{value}</Badge>;
}
