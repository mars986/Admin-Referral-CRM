import type { ReferralConversionRecord } from "@/lib/referrals/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency, formatDateTime } from "@/lib/utils";

export function ConversionsManager({ conversions }: { conversions: ReferralConversionRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Conversions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversions.map((conversion) => (
              <TableRow key={conversion.id}>
                <TableCell>{conversion.referral_code}</TableCell>
                <TableCell>{conversion.partner_name ?? "Unassigned"}</TableCell>
                <TableCell>{conversion.product_name}</TableCell>
                <TableCell>{currency(conversion.order_total)}</TableCell>
                <TableCell>{conversion.conversion_status}</TableCell>
                <TableCell>{formatDateTime(conversion.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
