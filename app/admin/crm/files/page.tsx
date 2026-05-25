import { FilesManager } from "@/components/crm/files-manager";
import { listFiles } from "@/lib/crm/service";

export default async function FilesPage() {
  return (
    <div data-admin-page>
      <FilesManager initialFiles={await listFiles()} />
    </div>
  );
}
