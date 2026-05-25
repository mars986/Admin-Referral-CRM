import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { MockForm } from "@/components/mock-form";
import { PageHero } from "@/components/page-hero";

const forgotPasswordFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
    helperText: "Enter the email address associated with your Apex Wellness account.",
  },
] as const;

export default function ForgotPasswordPage() {
  return (
    <>
      <PageHero
        eyebrow="Account Support"
        title="Forgot Password"
        description="Request a password reset link for your Apex Wellness account."
      />
      <section className="section-space">
        <div className="site-container grid gap-8 xl:grid-cols-[0.92fr_0.72fr]">
          <MockForm
            fields={forgotPasswordFields}
            submitLabel="Send Reset Link"
            successMessage="Your reset request has been recorded. Password reset workflows can be connected in a future backend phase."
          />
          <div className="space-y-6">
            <article className="card-surface rounded-[1.9rem] p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--color-border)] p-3">
                  <LockKeyhole className="size-5 text-[var(--color-primary)]" />
                </div>
                <p className="eyebrow">Secure Reset</p>
              </div>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-soft)]">
                Reset requests should be completed only from a secure device. Use
                an updated password that is unique to your Apex Wellness account.
              </p>
            </article>
            <article className="card-surface rounded-[1.9rem] p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--color-border)] p-3">
                  <ShieldCheck className="size-5 text-[var(--color-primary)]" />
                </div>
                <p className="eyebrow">Support</p>
              </div>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-ink-soft)]">
                <p>If you do not remember which email you used, contact support for account assistance.</p>
                <p className="flex items-center gap-3">
                  <Mail className="size-5 text-[var(--color-primary)]" />
                  <span>info@apexwellness.com</span>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
