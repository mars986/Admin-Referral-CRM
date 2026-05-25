import { AuditLogsManager } from "@/components/referrals/audit-logs-manager";
import { listReferralAuditLogs } from "@/lib/referrals/service";

export default async function AuditLogsPage() {
  return <AuditLogsManager logs={await listReferralAuditLogs()} />;
}
