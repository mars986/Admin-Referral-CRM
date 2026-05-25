import { Suspense } from "react";
import { ReferralAccessPageClient } from "@/components/referral/referral-access-page-client";
import { PageHero } from "@/components/page-hero";

export default function ReferralEntryPage() {
  return (
    <>
      <PageHero
        eyebrow="Referral Access"
        title="Verify your referral code"
        description="Customer referral access is separate from the protected admin dashboard. Verify a code here to unlock product access and continue toward checkout."
      />
      <section className="section-space">
        <Suspense fallback={null}>
          <ReferralAccessPageClient />
        </Suspense>
      </section>
    </>
  );
}
