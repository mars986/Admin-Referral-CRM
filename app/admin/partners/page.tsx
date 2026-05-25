import { headers } from "next/headers";
import { PartnersManager } from "@/components/referrals/partners-manager";
import { listReferralPartners } from "@/lib/referrals/service";

export default async function PartnersPage() {
  const requestHeaders = await headers();
  const accessEmail =
    requestHeaders.get("cf-access-authenticated-user-email") ??
    requestHeaders.get("x-admin-email");

  return <PartnersManager initialPartners={await listReferralPartners()} accessEmail={accessEmail} />;
}
