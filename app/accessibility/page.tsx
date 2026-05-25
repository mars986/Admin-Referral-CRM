import { PageHero } from "@/components/page-hero";

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Accessibility"
        title="Accessibility Statement"
        description="Apex Wellness is committed to providing a website experience that is accessible, usable, and inclusive for all visitors."
      />
      <section className="section-space">
        <div className="site-container">
          <article className="card-surface rounded-[2rem] p-7 sm:p-8 lg:p-10">
            <div className="space-y-8 text-base leading-8 text-[var(--color-ink-soft)]">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Accessibility Commitment
                </h2>
                <p>
                  At Apex Wellness, we are committed to providing a website experience that is
                  accessible, usable, and inclusive for all visitors. We strive to improve
                  accessibility standards across our digital experience and continuously work to
                  enhance usability for individuals using assistive technologies and different
                  browsing methods.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Ongoing Accessibility Efforts
                </h2>
                <p>We actively aim to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Improve readability and visual clarity across desktop and mobile devices</li>
                  <li>Maintain consistent navigation and responsive layouts</li>
                  <li>Support keyboard navigation where possible</li>
                  <li>Use accessible color contrast and scalable typography</li>
                  <li>
                    Optimize compatibility with modern screen readers and assistive technologies
                  </li>
                  <li>Reduce unnecessary animations or disruptive interface elements</li>
                  <li>Structure content for clearer semantic interpretation</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Accessibility Standards
                </h2>
                <p>
                  Our goal is to align with generally recognized accessibility practices and
                  evolving web accessibility standards, including portions of the Web Content
                  Accessibility Guidelines (WCAG) where applicable.
                </p>
                <p>
                  Because accessibility standards and technologies continue to evolve, we regularly
                  review and improve website functionality, layout structure, and content
                  presentation.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Third-Party Content
                </h2>
                <p>
                  Some areas of the website may rely on third-party tools, integrations, payment
                  processors, embedded content, or external platforms that are outside of our direct
                  control. While we aim to work with accessibility-conscious providers, we cannot
                  guarantee the accessibility compliance of all third-party services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Need Assistance?
                </h2>
                <p>
                  If you experience difficulty accessing any part of this website, encounter a
                  usability issue, or require assistance with any feature or content, please contact
                  us and we will make reasonable efforts to assist you.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Contact Information
                </h2>
                <address className="not-italic">
                  Apex Wellness
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:support@wellness.apexcompounding.com"
                    className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-ink)]"
                  >
                    support@wellness.apexcompounding.com
                  </a>
                </address>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  Feedback
                </h2>
                <p>
                  We welcome feedback regarding accessibility improvements and user experience
                  enhancements. Accessibility is an ongoing priority, and your input helps us
                  continue improving the experience for all visitors.
                </p>
              </section>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
