import { FraudReviewManager } from "@/components/referrals/fraud-review-manager";
import { getFraudReview } from "@/lib/referrals/service";

export default async function FraudPage() {
  return <FraudReviewManager items={await getFraudReview()} />;
}
