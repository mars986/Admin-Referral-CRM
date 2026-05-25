import { ReferralCodesManager } from "@/components/referrals/referral-codes-manager";
import { listReferralCodes, listReferralPartners } from "@/lib/referrals/service";

export default async function ReferralCodesPage() {
  const [codes, partners] = await Promise.all([listReferralCodes(), listReferralPartners()]);
  return <ReferralCodesManager initialCodes={codes} partners={partners} />;
}
