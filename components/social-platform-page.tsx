import { ContentCardGrid } from "@/components/content-card-grid";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import type { InfoCard } from "@/lib/types";

type SocialPlatformPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  cards: InfoCard[];
};

export function SocialPlatformPage({
  eyebrow,
  title,
  description,
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
  cards,
}: SocialPlatformPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="section-space">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <p className="eyebrow">{sectionEyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {sectionTitle}
            </h2>
            <p className="text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
              {sectionDescription}
            </p>
          </div>
          <article className="card-surface rounded-[2rem] p-7 sm:p-8">
            <p className="eyebrow">What To Expect</p>
            <div className="mt-4 space-y-4 text-base leading-8 text-[var(--color-ink-soft)]">
              <p>
                These pages can support brand updates, product highlights, community
                education, and ongoing Apex Wellness announcements.
              </p>
              <p>
                For now, they provide a clean destination for each footer social
                link so every clickable item routes to a real page in the site.
              </p>
            </div>
          </article>
        </div>
      </section>
      <ContentCardGrid
        eyebrow="Community"
        title="A consistent home for platform-specific updates."
        description="Each social destination can be expanded later with embedded content, campaigns, launch announcements, and wellness education."
        cards={cards}
      />
      <CtaBanner
        title="Stay connected with Apex Wellness."
        description="Use the newsletter, contact page, or patient intake flow to stay informed while the broader community channels continue to grow."
        href="/contact"
        buttonLabel="Contact Us"
      />
    </>
  );
}
