import { PageHero } from "@/components/page-hero";
import { PolicySection } from "@/components/policy-section";

const sections = [
  ["Informational Use Only", "Content on this website is intended to provide general product and wellness information."],
  ["No Medical Claims", "Apex Wellness does not use this website to make unapproved medical promises or guarantee outcomes."],
  ["Consult a Qualified Professional", "Customers should consult a qualified professional for guidance relevant to their own circumstances."],
  ["Product Availability May Vary", "Availability, launch timing, and product status can change over time based on supply and operations."],
  ["Customer Responsibility", "Customers are responsible for reviewing product details, account information, and communications carefully."],
] as const;

export default function WellnessNoticePage() {
  return (
    <>
      <PageHero
        eyebrow="Notice"
        title="Wellness Notice"
        description="Review important website and product information for general wellness-related use."
      />
      <PolicySection sections={sections} />
    </>
  );
}
