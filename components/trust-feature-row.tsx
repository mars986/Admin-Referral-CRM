"use client";

import { useState } from "react";
import { ChevronDown, LockKeyhole, PackageCheck, ShieldCheck, Sparkles, Stethoscope, TestTube2 } from "lucide-react";
import { trustItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const iconMap = [Sparkles, ShieldCheck, TestTube2, PackageCheck, Stethoscope, LockKeyhole];

export function TrustFeatureRow() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="-mt-6 pb-10 sm:-mt-10 sm:pb-16 lg:pb-20">
      <div className="site-container">
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(191,199,209,0.44)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-7 shadow-[var(--shadow-glow)] sm:rounded-[2.4rem] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="eyebrow">Trust Components</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-[3.2rem]">
                Premium trust layers built for clarity, discretion, and confidence.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-[var(--color-ink-soft)] lg:text-[1.05rem]">
              Explore the key standards behind the Apex Wellness experience through compact, expandable trust components.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trustItems.map((item, index) => {
              const Icon = iconMap[index];
              const isOpen = openIndex === index;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className={cn(
                    "text-left rounded-[1.6rem] border p-5 transition duration-300",
                    isOpen
                      ? "border-[rgba(59,130,246,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,247,255,0.94))] shadow-[var(--shadow-card)]"
                      : "border-[var(--color-border)] bg-white/86 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div className="w-fit rounded-2xl border border-[rgba(59,130,246,0.14)] bg-[rgba(59,130,246,0.08)] p-3">
                        <Icon className="size-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-ink)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
                          {isOpen ? item.description : `${item.description.slice(0, 74)}...`}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-1 size-5 shrink-0 text-[var(--color-primary)] transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
