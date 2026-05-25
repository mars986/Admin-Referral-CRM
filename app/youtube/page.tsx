import { SocialPlatformPage } from "@/components/social-platform-page";

const cards = [
  {
    title: "Long-Form Content",
    description: "A home for future walkthroughs, educational videos, and polished brand storytelling in a longer format.",
  },
  {
    title: "Product Overviews",
    description: "This channel can support product presentation, quality standards, and category education with more context.",
  },
  {
    title: "Brand Library",
    description: "Video content can reinforce the premium, clinical aesthetic while making information easier to explore over time.",
  },
  {
    title: "Ongoing Education",
    description: "A natural destination for deeper non-medical wellness education and process-based content.",
  },
];

export default function YoutubePage() {
  return (
    <SocialPlatformPage
      eyebrow="YouTube"
      title="Apex Wellness on YouTube"
      description="A future destination for longer-form wellness education, brand videos, and product storytelling."
      sectionEyebrow="Social Channel"
      sectionTitle="A video-first home for deeper educational and brand content."
      sectionDescription="YouTube gives Apex Wellness room for more detailed content while keeping the same premium visual tone and high-trust presentation."
      cards={cards}
    />
  );
}
