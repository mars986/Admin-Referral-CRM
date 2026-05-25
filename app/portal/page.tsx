import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export default function PortalPage() {
  return (
    <>
      <PageHero
        eyebrow="PORTAL"
        title="Access your Apex Wellness account"
        description="Sign in to view updates, manage your requests, track progress, and continue through the Apex Wellness workflow."
      />
      <section className="section-space">
        <div className="site-container max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="card-surface rounded-[1.9rem] p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--color-border)] p-3">
                  <Users className="size-5 text-[var(--color-primary)]" />
                </div>
                <p className="eyebrow">Referrals Login</p>
              </div>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-soft)]">
                Access your Apex Wellness referral portal.
              </p>
              <p className="mt-3 text-base leading-8 text-[var(--color-ink-soft)]">
                Sign in to manage referral activity, view performance updates, access shared resources, and track submitted referrals through a secure portal experience.
              </p>
              <Link
                href="/partner-portal"
                className="button-primary mt-6 inline-flex min-h-13 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                REFERRALS LOGIN
              </Link>
            </article>
            <article className="card-surface rounded-[1.9rem] p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--color-border)] p-3">
                  <ShieldCheck className="size-5 text-[var(--color-primary)]" />
                </div>
                <p className="eyebrow">Referral Admin Login</p>
              </div>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-soft)]">
                Access the Apex Wellness referral management dashboard.
              </p>
              <p className="mt-3 text-base leading-8 text-[var(--color-ink-soft)]">
                Sign in to manage referral partners, review submissions, monitor referral activity, track commissions, and oversee secure administrative operations.
              </p>
              <Link
                href="/admin/referral"
                className="button-primary mt-6 inline-flex min-h-13 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                REFERRAL ADMIN LOGIN
              </Link>
            </article>
            <article className="card-surface rounded-[1.9rem] p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--color-border)] p-3">
                  <LayoutDashboard className="size-5 text-[var(--color-primary)]" />
                </div>
                <p className="eyebrow">CRM Login</p>
              </div>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-soft)]">
                Access the Apex Wellness CRM dashboard.
              </p>
              <p className="mt-3 text-base leading-8 text-[var(--color-ink-soft)]">
                Sign in to manage leads, review submissions, track follow-ups, monitor activity, and oversee internal workflow operations securely.
              </p>
              <Link
                href="/admin/crm/dashboard"
                className="button-primary mt-6 inline-flex min-h-13 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                CRM LOGIN
              </Link>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
