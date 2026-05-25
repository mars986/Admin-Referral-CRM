import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Beaker,
  Box,
  ClipboardCheck,
  Compass,
  FlaskConical,
  LifeBuoy,
  MessageSquare,
  PackageCheck,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { qualityCarePageContent } from "@/lib/site-data";

const iconMap: Record<string, LucideIcon> = {
  approval: ShieldPlus,
  communication: MessageSquare,
  fulfillment: PackageCheck,
  guidance: Compass,
  handling: PackageCheck,
  ingredient: Beaker,
  intake: ClipboardCheck,
  labeling: BadgeCheck,
  "next-steps": ArrowRight,
  package: Box,
  preparation: FlaskConical,
  presentation: Sparkles,
  privacy: ShieldCheck,
  provider: Stethoscope,
  review: ClipboardCheck,
  sourcing: ShieldCheck,
  status: Bell,
  strength: BadgeCheck,
  support: LifeBuoy,
  verification: ShieldPlus,
  workflow: Sparkles,
};

function getIcon(iconName: string) {
  return iconMap[iconName] ?? Sparkles;
}

export function QualityCarePage() {
  const { hero, sections, howItWorks } = qualityCarePageContent;
  const heroHighlights = sections[0]?.cards.slice(0, 3) ?? [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]/80 bg-[linear-gradient(180deg,#fbfdff_0%,#f2f7fb_50%,#ffffff_100%)]">
        <div className="absolute inset-0">
          <div className="molecular-grid absolute inset-y-0 left-0 hidden w-28 opacity-35 lg:block" />
          <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(233,238,244,0.74),transparent)]" />
          <div className="absolute left-0 top-12 h-40 w-40 rounded-full bg-[rgba(47,95,143,0.10)] blur-3xl" />
          <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-[rgba(180,197,214,0.42)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-28 w-[42rem] -translate-x-1/2 rounded-full bg-[rgba(7,31,69,0.06)] blur-3xl" />
        </div>
        <div className="site-container relative py-14 sm:py-18 lg:py-22">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:gap-12">
            <div className="space-y-6">
              <p className="eyebrow">Quality & Care</p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-[4.5rem] lg:leading-[0.96]">
                {hero.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg lg:text-[1.08rem]">
                {hero.description}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={hero.primaryCta.href}
                  className="button-primary inline-flex min-h-14 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition"
                >
                  {hero.primaryCta.label}
                </Link>
                <Link
                  href={hero.secondaryCta.href}
                  className="button-secondary inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-6 py-3.5 text-sm font-semibold transition"
                >
                  {hero.secondaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {heroHighlights.map((card) => {
                const Icon = getIcon(card.icon);

                return (
                  <article
                    key={card.title}
                    className="card-surface rounded-[1.75rem] border border-[rgba(191,199,209,0.46)] bg-white/92 px-5 py-5 shadow-[var(--shadow-card)]"
                  >
                    <div className="mb-4 w-fit rounded-2xl border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.08)] p-3">
                      <Icon className="size-5 text-[var(--color-primary)]" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={index === 0 ? "section-space" : "section-space pt-0"}
        >
          <div className="site-container">
            <div className="overflow-hidden rounded-[2rem] border border-[rgba(191,199,209,0.44)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fafc_100%)] px-5 py-7 shadow-[var(--shadow-card)] sm:rounded-[2.3rem] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  titleClassName="lg:text-[3rem]"
                />
                {section.cta ? (
                  <Link
                    href={section.cta.href}
                    className="button-secondary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition"
                  >
                    {section.cta.label}
                    <ArrowRight className="size-4" />
                  </Link>
                ) : null}
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.cards.map((card) => {
                  const Icon = getIcon(card.icon);

                  return (
                    <article
                      key={card.title}
                      className="rounded-[1.6rem] border border-[rgba(191,199,209,0.42)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(7,31,69,0.06)]"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-2xl border border-[rgba(59,130,246,0.14)] bg-[rgba(59,130,246,0.08)] p-3">
                          <Icon className="size-5 text-[var(--color-primary)]" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[0.96rem]">
                        {card.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id={howItWorks.id} className="section-space pt-0">
        <div className="site-container">
          <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(135deg,#071f45_0%,#0f2b53_45%,#173763_100%)] px-5 py-8 text-white shadow-[var(--shadow-strong)] sm:rounded-[2.5rem] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <SectionHeading
              eyebrow={howItWorks.eyebrow}
              title={howItWorks.title}
              description={howItWorks.description}
              align="center"
              titleClassName="text-white lg:text-[3.2rem]"
              descriptionClassName="mx-auto text-white/76"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {howItWorks.steps.map((step, index) => {
                const Icon = getIcon(step.icon);

                return (
                  <article
                    key={step.title}
                    className="rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.05))] px-5 py-5 backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-2xl border border-white/12 bg-white/10 p-3">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/58">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/80">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={howItWorks.primaryCta.href}
                className="button-primary inline-flex min-h-14 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(0,0,0,0.22)] transition"
              >
                {howItWorks.primaryCta.label}
              </Link>
              <Link
                href={howItWorks.secondaryCta.href}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                {howItWorks.secondaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
