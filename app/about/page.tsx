import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

const focusItems = [
  {
    title: "Provider Review",
    description:
      "Submitted information is reviewed by a qualified provider to determine the appropriate next step in the Apex Wellness referral process.",
  },
  {
    title: "Lyophilized Stability",
    description:
      "Select products use a lyophilized powder format designed to support stability, cleaner storage, and preparation before use.",
  },
  {
    title: "Discreet Fulfillment",
    description:
      "Orders are prepared with secure, discreet packaging to help protect privacy from processing through delivery.",
  },
];

const standards = [
  "Clear product education",
  "Secure account access",
  "Thoughtful intake workflows",
  "Professional provider review when applicable",
  "Discreet packaging and fulfillment",
  "Responsive customer support",
  "A clean, modern digital experience",
];

export const metadata: Metadata = {
  title: "About Apex Wellness",
  description:
    "Learn how Apex Wellness approaches clarity, privacy, consistency, provider review, and discreet fulfillment.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About Apex Wellness"
        description="Elevated wellness access, built around clarity, privacy, and consistency."
      />

      <section className="section-space">
        <div className="site-container grid gap-4 lg:grid-cols-2">
          <article className="card-surface rounded-[2rem] p-6 sm:p-7">
            <div className="space-y-3 text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
              <p>
                Apex Wellness was created to make the wellness experience feel
                more organized, secure, and easy to navigate from the first step
                through fulfillment.
              </p>
              <p>
                We focus on clear information, structured review, refined
                product presentation, and discreet service so customers can move
                through the process with confidence.
              </p>
            </div>
          </article>
          <article className="card-surface rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow">Who We Are</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              A modern wellness experience designed for today&apos;s customer.
            </h2>
            <div className="mt-4 space-y-3 text-base leading-8 text-[var(--color-ink-soft)]">
              <p>
                Apex Wellness is a digital-first wellness brand built around
                simplicity, privacy, and professional presentation.
              </p>
              <p>
                Our goal is to make each step feel clear and manageable,
                whether someone is exploring products, completing intake,
                reviewing updates, or tracking an order.
              </p>
              <p>
                Every touchpoint is designed to feel calm, secure, and
                respectful of the customer&apos;s time and privacy.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="card-surface rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow">Our Approach</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Clear steps. Secure access. Thoughtful support.
            </h2>
            <div className="mt-4 space-y-3 text-base leading-8 text-[var(--color-ink-soft)]">
              <p>
                We believe wellness should feel straightforward, not
                overwhelming.
              </p>
              <p>
                Apex Wellness brings together guided digital intake, provider
                review where applicable, secure account updates, and discreet
                fulfillment in one streamlined experience.
              </p>
              <p>
                Instead of confusing instructions or scattered communication,
                customers can access important updates through a secure portal
                and receive support when they need it.
              </p>
            </div>
          </article>
          <article className="science-tile-light rounded-[2rem] border border-[rgba(191,199,209,0.42)] p-6 shadow-[var(--shadow-glow)] sm:p-7">
            <p className="eyebrow">What We Focus On</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {focusItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-5 py-5 shadow-sm sm:col-span-2"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container grid gap-4 lg:grid-cols-2">
          <article className="card-surface rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow">Our Standards</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Built around trust, clarity, and consistency.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-ink-soft)]">
              Apex Wellness is designed to provide a more refined wellness
              experience without unnecessary confusion.
            </p>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {standards.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)] px-4 py-4 text-sm font-medium leading-7 text-[var(--color-ink-soft)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
          <article className="card-surface rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow">Why Apex Wellness</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              A better way to move through the wellness process.
            </h2>
            <div className="mt-4 space-y-3 text-base leading-8 text-[var(--color-ink-soft)]">
              <p>
                Customers choose Apex Wellness because the experience is built
                to feel simple, private, and well-organized.
              </p>
              <p>
                From the website layout to product information, order updates,
                and support, each part of the process is designed to reduce
                friction and provide a more confident path forward.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="site-container">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,#ffffff_0%,#f6f9fc_42%,#e9eef4_100%)] px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-8">
            <p className="eyebrow">Next Step</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-[3rem]">
              Explore the Apex Wellness product lineup.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
              Review available products, learn how the process works, and begin
              through the secure intake flow when you are ready.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="button-secondary inline-flex min-h-13 items-center justify-center rounded-xl border border-[var(--color-border)] px-6 py-3.5 text-sm font-semibold transition"
              >
                Explore Products
              </Link>
              <Link
                href="/become-a-patient#intake-form"
                className="button-primary inline-flex min-h-13 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(0,31,63,0.14)] transition"
              >
                Start Intake
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
