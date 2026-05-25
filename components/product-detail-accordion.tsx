"use client";

import { ClipboardList, FlaskConical, Minus, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductAccordionSection =
  | {
      id: string;
      title: string;
      type: "overview";
      paragraphs: string[];
    }
  | {
      id: string;
      title: string;
      type: "highlights";
      highlights: string[];
    }
  | {
      id: string;
      title: string;
      type: "ingredients";
      ingredients: string[];
    }
  | {
      id: string;
      title: string;
      type: "usage";
      paragraphs: string[];
    }
  | {
      id: string;
      title: string;
      type: "reconstitution";
      intro: string;
      steps: string[];
      note?: string;
    }
  | {
      id: string;
      title: string;
      type: "storage";
      stabilityTitle?: string;
      stabilityDescription?: string;
      details: string[];
    };

type ProductDetailAccordionProps = {
  sections: ProductAccordionSection[];
};

const sectionIcons = {
  overview: ClipboardList,
  highlights: Sparkles,
  ingredients: FlaskConical,
  usage: ClipboardList,
  reconstitution: FlaskConical,
  storage: ShieldCheck,
} as const;

export function ProductDetailAccordion({ sections }: ProductDetailAccordionProps) {
  const [openSection, setOpenSection] = useState(sections[0]?.id ?? "");

  return (
    <div className="space-y-2.5">
      {sections.map((section) => {
        const open = openSection === section.id;
        const Icon = sectionIcons[section.type];

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-[1.75rem] border border-[rgba(191,199,209,0.42)] bg-white shadow-[var(--shadow-glow)]"
          >
            <button
              type="button"
              onClick={() => setOpenSection(open ? "" : section.id)}
              className="flex min-h-15 w-full items-center justify-between gap-4 px-5 py-3.5 text-left sm:px-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[rgba(7,31,69,0.12)] bg-[var(--color-cloud)] p-3">
                  <Icon className="size-5 text-[var(--color-primary)]" />
                </div>
                <p className="eyebrow text-[0.74rem] tracking-[0.18em] text-[var(--color-ink)]">
                  {section.title}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)]">
                {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
              </span>
            </button>
            <div
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <div className="border-t border-[var(--color-border)] px-5 py-5 sm:px-6">
                  {section.type === "overview" ? (
                    <div className="space-y-4 text-base leading-8 text-[var(--color-ink-soft)]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  {section.type === "highlights" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {section.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-cloud)] px-4 py-4 text-sm font-semibold leading-6 text-[var(--color-primary)]"
                        >
                          {highlight}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section.type === "ingredients" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {section.ingredients.map((ingredient) => (
                        <div
                          key={ingredient}
                          className="rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] px-4 py-4 text-sm font-semibold leading-6 text-[var(--color-primary)]"
                        >
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section.type === "usage" ? (
                    <div className="space-y-3 text-base leading-8 text-[var(--color-ink-soft)]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  {section.type === "reconstitution" ? (
                    <div className="space-y-4">
                      <p className="text-base leading-8 text-[var(--color-ink-soft)]">{section.intro}</p>
                      <div className="space-y-3">
                        {section.steps.map((step, index) => (
                          <div
                            key={step}
                            className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] px-4 py-4"
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
                              {index + 1}
                            </span>
                            <span className="text-base leading-7 text-[var(--color-ink-soft)]">{step}</span>
                          </div>
                        ))}
                      </div>
                      {section.note ? (
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-cloud)] px-4 py-4 text-sm leading-7 text-[var(--color-ink)]">
                          {section.note}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {section.type === "storage" ? (
                    <div className="space-y-3">
                      {section.stabilityTitle && section.stabilityDescription ? (
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-cloud)] px-4 py-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                            {section.stabilityTitle}
                          </p>
                          <p className="mt-2 text-base leading-7 text-[var(--color-ink-soft)]">
                            {section.stabilityDescription}
                          </p>
                        </div>
                      ) : null}
                      {section.details.map((detail) => (
                        <div
                          key={detail}
                          className="rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] px-4 py-4 text-base leading-7 text-[var(--color-ink-soft)]"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
