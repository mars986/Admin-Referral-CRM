import { MockForm } from "@/components/mock-form";
import { PageHero } from "@/components/page-hero";

const createAccountFields = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Your full name", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Your phone number", required: true },
  { name: "password", label: "Password", type: "password", placeholder: "Create a password", required: true },
  { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-enter your password", required: true },
] as const;

export default function CreateAccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create Account"
        description="Set up your Apex Wellness account to access future portal and support features."
      />
      <section className="section-space">
        <div className="site-container grid gap-8 xl:grid-cols-[0.92fr_0.72fr]">
          <MockForm
            fields={createAccountFields}
            submitLabel="Create Account"
            successMessage="Your account request has been accepted. Full account workflows can be connected in a future backend phase."
          />
          <div className="space-y-6">
            <article className="card-surface rounded-[1.9rem] p-7">
              <p className="eyebrow">Account Access</p>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-ink-soft)]">
                <p>Create a secure login to support patient communications, request visibility, and future account tools.</p>
                <p>Use an email address you check regularly so updates and confirmations are easy to manage.</p>
              </div>
            </article>
            <article className="card-surface rounded-[1.9rem] p-7">
              <p className="eyebrow">Next Step</p>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-ink-soft)]">
                <p>After creating an account, you can continue to the patient intake flow to share your product interests and contact details.</p>
                <p>Portal access and account actions remain frontend-only in this phase.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
