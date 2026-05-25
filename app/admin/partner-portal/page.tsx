import { PartnerPortalAccess } from "@/components/referrals/partner-portal-access";
import { getServerConfig } from "@/lib/cloudflare/env";

export default async function PartnerPortalPage() {
  const config = await getServerConfig();
  return <PartnerPortalAccess turnstileSiteKey={config.turnstileSiteKey} />;
}
