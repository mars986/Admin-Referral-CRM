import { PayoutsManager } from "@/components/referrals/payouts-manager";
import { listPayouts, listReferralPartners } from "@/lib/referrals/service";

export default async function PayoutsPage() {
  const [payouts, partners] = await Promise.all([listPayouts(), listReferralPartners()]);
  return <PayoutsManager initialPayouts={payouts} partners={partners} />;
}
