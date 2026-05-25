import { ReferralsManager } from "@/components/crm/referrals-manager";
import { listReferrals } from "@/lib/crm/service";

export default async function ReferralsPage() {
  return (
    <div data-admin-page>
      <ReferralsManager initialReferrals={await listReferrals()} />
    </div>
  );
}
