import { ClipboardCheck, FlaskConical, PackageCheck, ShieldPlus, Stethoscope } from "lucide-react";
import { faqCategories, howItWorksSteps } from "@/lib/site-data";
import { CtaBanner } from "@/components/cta-banner";
import { FaqAccordion } from "@/components/faq-accordion";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageHero } from "@/components/page-hero";

const iconMap = [ClipboardCheck, Stethoscope, ShieldPlus, FlaskConical, PackageCheck];
const supportBullets = [
  ["Private request flow", "Clear next-step prompts"],
  ["Structured review", "Readable status updates"],
  ["Guidance before action", "Aligned product communication"],
  ["Consistent presentation", "Handling information included"],
  ["Protective packaging", "Discreet fulfillment"],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="How It Works"
        description="A premium clinical timeline from intake through referral approval, precision preparation, and discreet fulfillment."
      />
      <section className="section-space">
        <div className="site-container space-y-8 sm:space-y-10">
          <div className="space-y-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = iconMap[index];
              const reverse = index % 2 === 1;

              return (
                <article
                  key={step.title}
                  className="relative overflow-hidden rounded-[1.7rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] p-5 shadow-[var(--shadow-card)] sm:p-6"
                >
                  <div className="absolute bottom-0 left-8 top-0 w-px bg-[linear-gradient(180deg,rgba(47,95,143,0.2),rgba(47,95,143,0))] md:hidden" />
                  <div className={`grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}>
                    <div className="relative z-10 flex items-center gap-4 lg:hidden">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white shadow-lg shadow-[rgba(7,31,69,0.16)]">
                        {index + 1}
                      </span>
                      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
                        <Icon className="size-5 text-[var(--color-primary)]" />
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(180deg,#ffffff_0%,#eef3f8_100%)] p-5 shadow-[var(--shadow-card)]">
                      <div className="absolute left-0 top-0 h-full w-28 molecular-grid opacity-25" />
                      <div className="absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-[rgba(47,95,143,0.08)] blur-3xl lg:block" />
                      <div className="relative space-y-4">
                        <div className="hidden items-center gap-4 lg:flex">
                          <span className="flex size-13 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-base font-semibold text-white shadow-lg shadow-[rgba(7,31,69,0.16)]">
                            {index + 1}
                          </span>
                          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
                            <Icon className="size-5 text-[var(--color-primary)]" />
                          </div>
                        </div>
                        {index === 0 ? (
                          <MediaPlaceholder
                            label="Desktop how it works intake media placeholder"
                            imageSrc="/images/background-lab.png"
                            className="min-h-[260px] lg:min-h-[320px]"
                          />
                        ) : (
                          <MediaPlaceholder
                            label="Desktop clinical process media placeholder"
                            imageSrc={index % 2 === 0 ? "/images/background-pipette.png" : "/images/background-molecular.png"}
                            className="min-h-[220px] lg:min-h-[280px]"
                          />
                        )}
                      </div>
                    </div>
                    <div className="space-y-4 md:space-y-5">
                      <div>
                        <p className="eyebrow">{`Step ${index + 1}`}</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)] lg:text-[2.15rem]">
                          {step.title}
                        </h2>
                        <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-ink-soft)] lg:text-[1.08rem]">
                          {step.description}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {supportBullets[index].map((bullet) => (
                          <div
                            key={bullet}
                            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-ink-soft)]"
                          >
                            {bullet}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section-space pt-0">
        <div className="site-container space-y-6">
          <div className="space-y-3">
            <p className="eyebrow">Frequently Asked Questions</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Common questions about the patient process.
            </h2>
          </div>
          <FaqAccordion categories={faqCategories} />
        </div>
      </section>
      <CtaBanner
        title="Ready to begin your assessment?"
        description="Start the secure intake process to move from intake through provider review and fulfillment."
        href="/become-a-patient"
        buttonLabel="Start Assessment"
      />
    </>
  );
}
