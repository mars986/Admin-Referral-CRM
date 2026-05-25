import Link from "next/link";

type CtaBannerProps = {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
};

export function CtaBanner({ title, description, href, buttonLabel }: CtaBannerProps) {
  return (
    <section className="section-space pt-0">
      <div className="site-container">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,#ffffff_0%,#f6f9fc_40%,#e9eef4_100%)] px-6 py-8 shadow-[var(--shadow-card)] sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="eyebrow">Next Step</p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-[3rem]">{title}</h2>
              <p className="text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">{description}</p>
            </div>
            <Link
              href={href}
              className="button-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[rgba(0,31,63,0.14)] transition"
            >
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
