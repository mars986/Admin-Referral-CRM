import Link from "next/link";
import { ArrowRight, Beaker, PackageCheck, Sparkles } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";

const visualPanels = [
  {
    eyebrow: "Ingredient Purity",
    title: "Clean visual language for ingredients, handling, and presentation.",
    description:
      "Clinical imagery and tighter copy help the product story feel more premium and less technical.",
    imageSrc: "/images/background-pipette.png",
    icon: Beaker,
  },
  {
    eyebrow: "Process & Precision",
    title: "Guided review and refined product structure from first click forward.",
    description:
      "The redesigned site emphasizes readability, trust, and better conversion rhythm across the full experience.",
    imageSrc: "/images/background-molecular.png",
    icon: Sparkles,
  },
  {
    eyebrow: "Packaging & Discretion",
    title: "Protective presentation and discreet fulfillment in a calmer visual system.",
    description:
      "Structured support sections and image-backed cards make the experience feel more considered and more trustworthy.",
    imageSrc: "/images/background-lab.png",
    icon: PackageCheck,
  },
];

export function ScienceMosaic() {
  return (
    <section className="section-space pt-0">
      <div className="site-container space-y-8 lg:space-y-10">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="space-y-4">
            <p className="eyebrow">Clinical Visual Sections</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-[3.3rem]">
              Real visual sections for purity, process, packaging, and discretion.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-ink-soft)] lg:text-[1.06rem]">
              Apex Wellness now uses richer clinical imagery, softer glass layers,
              and cleaner negative space so the brand feels more like a premium
              wellness platform and less like a compressed catalog.
            </p>
            <Link
              href="/quality-standards"
              className="button-secondary inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-primary)]/20 px-5 py-3 text-sm font-semibold text-[var(--color-primary)]"
            >
              Explore Quality Standards
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <MediaPlaceholder
            label="Sterile lab-style separator background"
            imageSrc="/images/background-wave.png"
            className="min-h-[320px] sm:min-h-[360px] lg:min-h-[420px]"
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {visualPanels.map(({ eyebrow, title, description, imageSrc, icon: Icon }) => (
            <article
              key={title}
              className="overflow-hidden rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-white shadow-[var(--shadow-card)]"
            >
              <MediaPlaceholder label={title} imageSrc={imageSrc} className="min-h-[220px]" />
              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.08)] p-3">
                    <Icon className="size-5 text-[var(--color-primary)]" />
                  </div>
                  <p className="eyebrow">{eyebrow}</p>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {title}
                </h3>
                <p className="mt-4 text-[0.98rem] leading-8 text-[var(--color-ink-soft)]">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a5f_68%,#27476f_100%)] px-6 py-8 text-white shadow-[var(--shadow-strong)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-0 opacity-20">
            <MediaPlaceholder label="Sterile lab-style separator" imageSrc="/images/background-molecular.png" className="h-full rounded-none border-0 shadow-none" />
          </div>
          <div className="relative grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <p className="eyebrow text-white/66">Sterile Lab-Style Separator</p>
              <h3 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                A cleaner line between product storytelling and reassurance.
              </h3>
            </div>
            <p className="max-w-3xl text-base leading-8 text-white/82 lg:text-[1.04rem]">
              Instead of repeating the same quality language section after section,
              the redesign uses stronger visual rhythm, softer glass layers, and
              focused trust messages that make each block feel distinct.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
