import { SocialPlatformPage } from "@/components/social-platform-page";

const cards = [
  {
    title: "Quick Updates",
    description: "A streamlined destination for brief announcements, launch notes, and timely product or service updates.",
  },
  {
    title: "Brand Voice",
    description: "This page can support concise, confident messaging aligned with the premium clinical Apex Wellness identity.",
  },
  {
    title: "Threaded Education",
    description: "Future wellness-focused educational threads can be shared here in a compact, readable format.",
  },
  {
    title: "Live Announcements",
    description: "X is useful for short-form updates when product availability, news, or support details need quick visibility.",
  },
];

export default function XPage() {
  return (
    <SocialPlatformPage
      eyebrow="X"
      title="Apex Wellness on X"
      description="A future destination for concise updates, announcements, and short-form brand communication."
      sectionEyebrow="Social Channel"
      sectionTitle="A cleaner place for short-form updates and launch visibility."
      sectionDescription="X can support fast-moving communication while preserving the same premium tone and restraint used across the rest of the site."
      cards={cards}
    />
  );
}
