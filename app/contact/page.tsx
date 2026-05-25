import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CrmPublicForm } from "@/components/forms/crm-public-form";
import { getServerConfig } from "@/lib/cloudflare/env";

const contactFields = [
  { name: "firstName", label: "First Name", type: "text", placeholder: "First name", required: true },
  { name: "lastName", label: "Last Name", type: "text", placeholder: "Last name", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Your phone number", required: true },
  {
    name: "productInterest",
    label: "Product Interest",
    type: "select",
    required: true,
    options: [
      { label: "General Support", value: "General Support" },
      { label: "TriMix", value: "TriMix" },
      { label: "QuadMix", value: "QuadMix" },
      { label: "NAD+ 500MG", value: "NAD+ 500MG" },
      { label: "PT-141", value: "PT-141" },
      { label: "Bacteriostatic Water", value: "Bacteriostatic Water" },
    ],
  },
  { name: "message", label: "Message", type: "textarea", placeholder: "How can we help?", required: true },
] as const;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Apex Wellness for product questions, support, or help with the next step in getting started.",
};

export default async function ContactPage() {
  const config = await getServerConfig();
  const supportMailto = `mailto:${config.supportEmail}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Apex Wellness"
        description="Reach out for order support, product questions, or general assistance."
      />
      <section className="section-space">
        <div className="site-container max-w-4xl space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <article className="card-surface rounded-[1.75rem] p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Company Address
              </h2>
              <address className="mt-4 not-italic text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
                <div>325 W Washington Street</div>
                <div>Suite 2826</div>
                <div>San Diego, CA 92103</div>
                <div className="mt-4">
                  Email:{" "}
                  <a
                    className="text-[var(--color-primary)] underline underline-offset-4"
                    href={supportMailto}
                  >
                    {config.supportEmail}
                  </a>
                </div>
              </address>
            </article>

            <article className="card-surface rounded-[1.75rem] p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Response Times
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
                <p>
                  General support messages are typically reviewed within 1-2 business days, Monday
                  through Friday, excluding holidays.
                </p>
                <p>
                  Order-related questions are reviewed as quickly as possible, usually during the
                  same business day when submitted during active fulfillment windows.
                </p>
                <p>
                  If your request is urgent, please include the relevant order or account details so
                  the team can assist efficiently.
                </p>
              </div>
            </article>
          </div>

          <div>
            <CrmPublicForm
              formType="contact"
              fields={[...contactFields]}
              submitLabel="Send Message"
              successMessage="Thanks for reaching out. Your message has been captured for follow-up."
              turnstileSiteKey={config.turnstileSiteKey}
            />
          </div>
        </div>
      </section>
    </>
  );
}
