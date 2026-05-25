import { ClipboardCheck, FlaskConical, PackageCheck, ShieldPlus, Stethoscope } from "lucide-react";
import { howItWorksSteps } from "@/lib/site-data";

const iconMap = [ClipboardCheck, Stethoscope, ShieldPlus, FlaskConical, PackageCheck];

export function HowItWorks() {
  return (
    <section className="section-space bg-[linear-gradient(180deg,#071f45_0%,#05101f_100%)] py-12 text-white sm:py-14">
      <div className="site-container space-y-8 sm:space-y-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-white/70">How It Works</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[3rem]">
            A simpler path from intake to discreet fulfillment.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {howItWorksSteps.map((step, index) => {
            const Icon = iconMap[index];
            return (
              <div
                key={step.title}
                className="rounded-[1.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-5 py-5 backdrop-blur-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl border border-white/12 bg-white/8 p-3">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/54">
                    Step {index + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/68">
                  {step.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/84">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
