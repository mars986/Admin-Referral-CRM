import { ReferralLeadsManager } from "@/components/referrals/referral-leads-manager";
import { listReferralLeads } from "@/lib/referrals/service";

export default async function ReferralLeadsPage() {
  return <ReferralLeadsManager initialLeads={await listReferralLeads()} />;
}
