import type { Metadata } from "next";
import { QualityCarePage } from "@/components/quality-care-page";

export const metadata: Metadata = {
  title: "Quality & Care",
  description:
    "Learn how Apex Wellness structures intake, referral review, approved referrals, discreet fulfillment, and clear next steps.",
};

export default function QualityCareRoute() {
  return <QualityCarePage />;
}
