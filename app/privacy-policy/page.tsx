import { PageHero } from "@/components/page-hero";
import { PolicySection } from "@/components/policy-section";

const sections = [
  ["Information Collected", "Apex Wellness may collect contact details, account information, form submissions, and site usage data."],
  ["How Information Is Used", "Information is used to support account services, respond to requests, improve the site experience, and communicate updates."],
  ["Cookies", "Cookies and similar technologies may be used to improve website functionality and understand general usage patterns."],
  ["Third-Party Services", "Certain third-party tools may support payments, analytics, communications, or infrastructure operations."],
  ["Data Protection", "Reasonable safeguards are used to protect submitted information and maintain service integrity."],
  ["Contact Information", "For privacy-related questions, contact Apex Wellness support by phone or email."],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Privacy Policy"
        description="Review how Apex Wellness collects, uses, and protects information shared through the website."
      />
      <PolicySection sections={sections} />
    </>
  );
}
