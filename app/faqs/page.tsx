import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories } from "@/lib/site-data";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Browse grouped Apex Wellness FAQs covering the patient process, products, reconstitution, fulfillment, and safety information.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Frequently Asked Questions"
        description="Browse grouped guidance covering the patient process, products, reconstitution, shipping and fulfillment, and safety information."
      />
      <section className="section-space">
        <div className="site-container grid gap-8 xl:grid-cols-[0.28fr_0.72fr]">
          <aside className="hidden xl:block">
            <div className="sticky top-32 rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-white/92 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm">
              <p className="eyebrow">Categories</p>
              <nav className="mt-5 space-y-2">
                {faqCategories.map((category) => {
                  const slug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                  return (
                    <Link
                      key={category.title}
                      href={`#${slug}`}
                      className="block rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
                    >
                      {category.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          <div className="space-y-8">
            {faqCategories.map((category) => {
              const slug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

              return (
                <section key={category.title} id={slug} className="scroll-mt-32">
                  <FaqAccordion categories={[category]} />
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
