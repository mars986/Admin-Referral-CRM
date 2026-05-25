import { TasksManager } from "@/components/crm/tasks-manager";
import { listTasks } from "@/lib/crm/service";

export default async function TasksPage() {
  return (
    <div data-admin-page>
      <TasksManager initialTasks={await listTasks()} />
    </div>
  );
}
