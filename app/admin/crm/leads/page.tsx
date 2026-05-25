import { LeadsManager } from "@/components/crm/leads-manager";
import { listLeads } from "@/lib/crm/service";

export default async function LeadsPage() {
  return (
    <div data-admin-page>
      <LeadsManager initialLeads={await listLeads()} />
    </div>
  );
}
