import type { InfoCard } from "@/lib/types";
import { SectionHeading } from "@/components/section-heading";

type ContentCardGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards: InfoCard[];
};

export function ContentCardGrid({
  eyebrow,
  title,
  description,
  cards,
}: ContentCardGridProps) {
  return (
    <section className="section-space">
      <div className="site-container space-y-8 sm:space-y-10">
        {title ? (
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        ) : null}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="card-surface rounded-[1.4rem] px-4 py-5 sm:rounded-[1.75rem] sm:px-6 sm:py-7"
            >
              <h3 className="text-base font-semibold text-[var(--color-ink)] sm:text-xl">{card.title}</h3>
              <p className="mt-2 text-[0.82rem] leading-5 text-[var(--color-ink-soft)] sm:mt-3 sm:text-base sm:leading-7">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
