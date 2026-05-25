import { ContactsManager } from "@/components/crm/contacts-manager";
import { listContacts } from "@/lib/crm/service";

export default async function ContactsPage() {
  return (
    <div data-admin-page>
      <ContactsManager initialContacts={await listContacts()} />
    </div>
  );
}
