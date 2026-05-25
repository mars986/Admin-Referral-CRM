import { EmailsManager } from "@/components/crm/emails-manager";
import { listEmailLogs, listEmailTemplates } from "@/lib/crm/service";

export default async function EmailsPage() {
  return (
    <div data-admin-page>
      <EmailsManager
        initialTemplates={await listEmailTemplates()}
        initialLogs={await listEmailLogs()}
      />
    </div>
  );
}
