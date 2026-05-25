import { CrmPublicForm } from "@/components/forms/crm-public-form";
import { PageHero } from "@/components/page-hero";
import { getServerConfig } from "@/lib/cloudflare/env";

const intakeFields = [
  { name: "firstName", label: "First Name", type: "text", placeholder: "First name", required: true },
  { name: "lastName", label: "Last Name", type: "text", placeholder: "Last name", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Your phone number", required: true },
  { name: "dob", label: "Date of Birth", type: "date", required: true },
  {
    name: "productInterest",
    label: "Product Interest",
    type: "select",
    required: true,
    options: [
      { label: "TriMix", value: "trimix" },
      { label: "QuadMix", value: "quadmix" },
      { label: "NAD+ 500MG", value: "nad-500mg" },
      { label: "PT-141", value: "pt-141" },
      { label: "Bacteriostatic Water", value: "bacteriostatic-water" },
    ],
  },
  { name: "message", label: "Wellness Goals or Notes", type: "textarea", placeholder: "Share your goals, questions, or relevant details." },
  {
    name: "consent",
    label: "I consent to being contacted about my Apex Wellness request.",
    type: "checkbox",
    required: true,
    helperText:
      "Submitting this form starts the review process and does not guarantee eligibility, availability, or fulfillment.",
  },
] as const;

const intakeSections = [
  {
    title: "Contact Information",
    description: "Share your contact details so the next step can be communicated clearly.",
    fields: ["firstName", "lastName", "email", "phone", "dob"],
  },
  {
    title: "Wellness Request",
    description: "Tell us about your wellness goals and which product interests you most.",
    fields: ["productInterest", "message"],
  },
  {
    title: "Consent",
    description: "Review the acknowledgment before starting the secure intake flow.",
    fields: ["consent"],
  },
] as const;

const intakeSteps = [
  {
    title: "Complete Intake",
    description:
      "Share your contact details, wellness goals, and product interests through the secure intake flow.",
  },
  {
    title: "Provider Review",
    description:
      "Your submitted information is reviewed by a qualified provider to determine the appropriate next step in the Apex Wellness referral process.",
  },
  {
    title: "Next-Step Guidance",
    description:
      "If appropriate, you will receive secure updates with the next steps for your request.",
  },
  {
    title: "Precision Preparation",
    description:
      "Approved requests move into careful preparation with quality-focused packaging and clear order updates.",
  },
  {
    title: "Discreet Fulfillment",
    description:
      "Orders are prepared with secure, discreet packaging to help protect privacy from processing through delivery.",
  },
];

export default async function BecomePatientPage() {
  const config = await getServerConfig();

  return (
    <>
      <PageHero
        eyebrow="Secure Intake"
        title="Start Your Apex Wellness Request"
        description="A simple, secure intake process designed to collect your information, support provider review when applicable, and guide the next steps with clarity, privacy, and discreet fulfillment."
      />
      <section className="section-space">
        <div className="site-container grid gap-8 xl:grid-cols-[0.9fr_1fr]">
          <div className="space-y-6">
            <article className="card-surface rounded-[1.9rem] p-7">
              <p className="eyebrow">Your Wellness Path</p>
              <div className="mt-5 space-y-3">
                {intakeSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] px-4 py-4"
                  >
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-frost)]">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[var(--color-ink)]">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>
            <article className="card-surface rounded-[1.9rem] p-7">
              <p className="eyebrow">Privacy Notice</p>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-soft)]">
                Information shared through the intake flow is handled with care
                and used only to support review, communication, and
                account-related updates. Private details should be viewed
                through your secure Apex Wellness account.
              </p>
            </article>
          </div>
          <div id="intake-form">
            <CrmPublicForm
              formType="patient"
              fields={[...intakeFields]}
              sections={intakeSections}
              submitLabel="Start Secure Intake"
              successMessage="Your secure intake has been captured. We will follow up with next-step guidance through your Apex Wellness request process."
              turnstileSiteKey={config.turnstileSiteKey}
            />
            <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
              Submitting this form starts the review process and does not
              guarantee eligibility, availability, or fulfillment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
