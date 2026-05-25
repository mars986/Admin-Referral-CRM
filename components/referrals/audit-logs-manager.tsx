import type { ReferralAuditLogRecord } from "@/lib/referrals/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export function AuditLogsManager({ logs }: { logs: ReferralAuditLogRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Metadata</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.actor_email ?? log.actor_id ?? "system"}</TableCell>
                <TableCell>{log.entity_type} / {log.entity_id ?? "—"}</TableCell>
                <TableCell className="max-w-[320px] truncate text-xs text-slate-300">{log.metadata ?? "{}"}</TableCell>
                <TableCell>{formatDateTime(log.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
