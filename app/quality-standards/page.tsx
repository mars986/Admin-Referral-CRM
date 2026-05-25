import type { Metadata } from "next";
import { ContentCardGrid } from "@/components/content-card-grid";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageHero } from "@/components/page-hero";

const qualityCards = [
  {
    title: "Review Process",
    description:
      "The assessment flow is designed to support clear intake, appropriate review, and straightforward next-step communication.",
  },
  {
    title: "Product Presentation Standards",
    description:
      "Product pages are structured to keep strengths, sizes, handling information, and availability easy to review.",
  },
  {
    title: "Packaging Protection",
    description:
      "Orders are presented with a focus on clean packaging, protective handling, and a more polished delivery experience.",
  },
  {
    title: "Handling & Storage Communication",
    description:
      "Storage and reconstitution communication is written to feel readable, product specific, and easier to follow.",
  },
  {
    title: "Documentation & Consistency",
    description:
      "Apex Wellness prioritizes consistent product facts, clearer disclaimers, and aligned messaging across the full site.",
  },
  {
    title: "Support Standards",
    description:
      "Support pathways are presented more clearly so new inquiries, existing client questions, and general support needs feel less ambiguous.",
  },
  {
    title: "Discreet Fulfillment Experience",
    description:
      "Fulfillment language emphasizes privacy-conscious handling, protective presentation, and a calmer customer experience.",
  },
];

export const metadata: Metadata = {
  title: "Quality Standards",
  description:
    "Review how Apex Wellness approaches product clarity, packaging protection, documentation, support, and discreet fulfillment.",
};

export default function QualityStandardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality Standards"
        title="A premium standard across product presentation, support, and fulfillment."
        description="Apex Wellness is structured around clearer review pathways, cleaner product communication, and a more polished wellness experience."
      />
      <section className="section-space">
        <div className="site-container grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <div className="space-y-5">
            <p className="eyebrow">What This Means</p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Trust is built through consistency, not clutter.
            </h2>
            <p className="text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
              The Apex Wellness standard centers on better product hierarchy,
              easier handling communication, stronger support structure, and a
              more discreet fulfillment experience.
            </p>
          </div>
          <MediaPlaceholder
            label="Quality standards packaging close-up"
            imageSrc="/images/background-pipette.png"
            className="min-h-[300px] sm:min-h-[360px]"
          />
        </div>
      </section>
      <ContentCardGrid
        eyebrow="Standards"
        title="The quality framework behind the experience."
        description="These standards shape how products are presented, how review steps are explained, and how support feels across the site."
        cards={qualityCards}
      />
    </>
  );
}
