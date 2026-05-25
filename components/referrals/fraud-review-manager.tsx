import type { FraudReviewRecord } from "@/lib/referrals/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export function FraudReviewManager({ items }: { items: FraudReviewRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Review</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Reasons</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.customer_name}</TableCell>
                <TableCell>{item.referral_code}</TableCell>
                <TableCell className="text-sm text-slate-300">{item.reasons.join(", ")}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{formatDateTime(item.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
