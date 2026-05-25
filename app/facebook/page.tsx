import { SocialPlatformPage } from "@/components/social-platform-page";

const cards = [
  {
    title: "Announcements",
    description: "A broader channel for company news, availability updates, and cross-posted community information.",
  },
  {
    title: "Support Visibility",
    description: "Useful for reinforcing contact information, patient guidance, and educational updates in a familiar format.",
  },
  {
    title: "Community Reach",
    description: "Facebook can support a wider audience with wellness-oriented updates and consistent brand communication.",
  },
  {
    title: "Campaign Content",
    description: "Promotional campaigns, educational series, and seasonal messages can expand here over time.",
  },
];

export default function FacebookPage() {
  return (
    <SocialPlatformPage
      eyebrow="Facebook"
      title="Apex Wellness on Facebook"
      description="A dedicated page for broader brand communication, announcements, and wellness-focused updates."
      sectionEyebrow="Social Channel"
      sectionTitle="A flexible destination for updates and community communication."
      sectionDescription="Facebook supports more detailed announcements, audience reach, and evergreen brand messaging while keeping the Apex Wellness voice consistent."
      cards={cards}
    />
  );
}
