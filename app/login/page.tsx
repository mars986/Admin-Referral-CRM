import Link from "next/link";
import { MockForm } from "@/components/mock-form";
import { PageHero } from "@/components/page-hero";

const loginFields = [
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
] as const;

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Customer Login"
        title="Customer Login"
        description="Sign in to access your Apex Wellness account, view your updates, manage your information, and continue through a secure wellness portal experience."
      />
      <section className="section-space">
        <div className="site-container max-w-3xl">
          <div className="card-surface rounded-[1.9rem] p-6 sm:p-8">
            <MockForm
              fields={[...loginFields]}
              submitLabel="Login"
              successMessage="Your login request has been accepted. Customer portal workflows can be connected in a future backend phase."
            />
            <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/create-account"
                className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-soft)]"
              >
                Create Account
              </Link>
              <Link
                href="/forgot-password"
                className="font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-soft)]"
              >
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
