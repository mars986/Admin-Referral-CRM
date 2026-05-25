type PolicySectionProps = {
  sections: readonly (readonly [title: string, description: string])[];
};

export function PolicySection({ sections }: PolicySectionProps) {
  return (
    <section className="section-space">
      <div className="site-container grid gap-5">
        {sections.map(([title, description]) => (
          <article key={title} className="card-surface rounded-[1.75rem] p-6 sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              {title}
            </h2>
            <p className="mt-3 text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
