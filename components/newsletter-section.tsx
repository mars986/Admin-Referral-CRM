import Link from "next/link";
import { ArrowRight, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";

const supportHighlights = [
  {
    title: "Protective Packaging",
    description: "Structured presentation designed to feel orderly, premium, and well protected.",
    icon: PackageCheck,
  },
  {
    title: "Discreet Fulfillment",
    description: "Privacy-conscious language and calmer next-step guidance across the experience.",
    icon: ShieldCheck,
  },
  {
    title: "Responsive Support",
    description: "Support content is easier to scan, easier to trust, and easier to act on.",
    icon: Sparkles,
  },
];

export function NewsletterSection() {
  return (
    <section className="section-space pt-0">
      <div className="site-container">
        <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(191,199,209,0.42)] bg-white shadow-[var(--shadow-glow)]">
          <div className="grid gap-0 lg:grid-cols-[0.98fr_1.02fr]">
            <MediaPlaceholder
              label="Clinical hero imagery support section"
              imageSrc="/images/background-lab.png"
              className="min-h-[280px] rounded-none border-0 shadow-none sm:min-h-[340px] lg:min-h-full"
            />
            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <p className="eyebrow">Support & Reassurance</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-[3.15rem]">
                Premium support sections that feel clear instead of generated.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-ink-soft)] lg:text-[1.05rem]">
                Apex Wellness now uses more breathing room, stronger visual
                hierarchy, and shorter support language so the experience feels
                more refined and easier to trust.
              </p>
              <div className="mt-6 grid gap-4">
                {supportHighlights.map(({ title, description, icon: Icon }) => (
                  <article
                    key={title}
                    className="glass-panel rounded-[1.5rem] border border-[rgba(191,199,209,0.4)] px-4 py-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-[rgba(59,130,246,0.14)] bg-white/78 p-3">
                        <Icon className="size-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[var(--color-ink)]">{title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">{description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="button-primary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold"
                >
                  Contact Support
                </Link>
                <Link
                  href="/faqs"
                  className="button-secondary inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  Browse FAQs
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
