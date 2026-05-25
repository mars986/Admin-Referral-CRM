import { CommissionsManager } from "@/components/referrals/commissions-manager";
import { listCommissions } from "@/lib/referrals/service";

export default async function CommissionsPage() {
  return <CommissionsManager initialCommissions={await listCommissions()} />;
}
