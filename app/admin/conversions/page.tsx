import { ConversionsManager } from "@/components/referrals/conversions-manager";
import { listReferralConversions } from "@/lib/referrals/service";

export default async function ConversionsPage() {
  return <ConversionsManager conversions={await listReferralConversions()} />;
}
