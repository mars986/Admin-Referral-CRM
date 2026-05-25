import { SocialPlatformPage } from "@/components/social-platform-page";

const cards = [
  {
    title: "Brand Updates",
    description: "A place for visual product highlights, launch announcements, and premium Apex Wellness brand moments.",
  },
  {
    title: "Wellness Education",
    description: "Short-form, non-medical wellness content can live here in a format that feels clear, modern, and shareable.",
  },
  {
    title: "Community Highlights",
    description: "This destination can support future campaigns, testimonials, and behind-the-scenes brand storytelling.",
  },
  {
    title: "Product Visibility",
    description: "A clean channel for keeping presentation, category awareness, and availability messaging consistent.",
  },
];

export default function InstagramPage() {
  return (
    <SocialPlatformPage
      eyebrow="Instagram"
      title="Apex Wellness on Instagram"
      description="A future destination for visual brand updates, product storytelling, and premium wellness content."
      sectionEyebrow="Social Channel"
      sectionTitle="A curated visual space for the Apex Wellness brand."
      sectionDescription="Instagram is well-suited for refined product presentation, editorial brand moments, and concise wellness-focused updates."
      cards={cards}
    />
  );
}
