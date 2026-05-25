import { PageHero } from "@/components/page-hero";
import { PartnerPortalAccess } from "@/components/referrals/partner-portal-access";
import { getServerConfig } from "@/lib/cloudflare/env";

export default async function PublicPartnerPortalPage() {
  const config = await getServerConfig();

  return (
    <>
      <PageHero
        eyebrow="Partner Portal"
        title="Partner Portal"
        description="Secure partner access for referral link performance, conversions, unpaid commissions, and payout history."
      />
      <section className="section-space">
        <div className="site-container">
          <PartnerPortalAccess turnstileSiteKey={config.turnstileSiteKey} />
        </div>
      </section>
    </>
  );
}
