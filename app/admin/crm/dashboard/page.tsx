import { CRMDashboardView } from "@/components/crm/crm-dashboard-view";
import { getDashboardSnapshot, getPipeline, listContacts, listLeads, listTasks } from "@/lib/crm/service";

export default async function DashboardPage() {
  const [snapshot, leads, contacts, tasks, pipeline] = await Promise.all([
    getDashboardSnapshot(),
    listLeads({ sort: "created_at", direction: "desc" }),
    listContacts(),
    listTasks(),
    getPipeline(),
  ]);

  return (
    <CRMDashboardView
      snapshot={snapshot}
      leads={leads.slice(0, 6)}
      contacts={contacts.slice(0, 6)}
      tasks={tasks.slice(0, 8)}
      pipeline={pipeline}
    />
  );
}
