import { SectionHeading } from "@/components/section-heading";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]/80 bg-white">
      <div className="absolute inset-0">
        <div className="molecular-grid absolute inset-y-0 left-0 hidden w-28 lg:block" />
        <div className="molecular-grid absolute inset-x-0 top-0 h-44 opacity-15 sm:hidden" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(233,238,244,0.65),transparent)]" />
        <div className="absolute right-0 top-10 h-44 w-44 rounded-full bg-[rgba(47,95,143,0.08)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-28 w-[40rem] -translate-x-1/2 rounded-full bg-[rgba(7,31,69,0.05)] blur-3xl" />
      </div>
      <div className="site-container relative section-space">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}
