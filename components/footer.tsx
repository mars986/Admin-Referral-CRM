import type { ComponentProps } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { contactConfig, footerLinkGroups, globalDisclaimer } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="relative bg-[linear-gradient(180deg,#071f45_0%,#05101f_100%)] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(191,199,209,0),rgba(191,199,209,0.7),rgba(191,199,209,0))]" />
      <div className="site-container py-10 sm:py-12 lg:py-14">
        <div className="border-b border-white/10 pb-8">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <Logo inverted />
            <div className="mt-4 hidden items-center gap-3 sm:flex">
              {[
                { label: "Instagram", href: "/instagram", icon: InstagramIcon },
                { label: "Facebook", href: "/facebook", icon: FacebookIcon },
                { label: "X", href: "/x", icon: XMarkIcon },
                { label: "YouTube", href: "/youtube", icon: YoutubeIcon },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/16 text-white/82 transition hover:border-white/38 hover:text-white"
                >
                  <Icon className="size-4" />
                </Link>
                ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:hidden">
            {footerLinkGroups.map((group) => (
              <details
                key={group.title}
                className="col-span-2 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/6"
              >
                <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
                  {group.title}
                </summary>
                <ul className="space-y-3 border-t border-white/10 px-4 py-4 text-sm text-white/82">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="block py-1 transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <div className="mt-10 hidden grid-cols-2 gap-8 sm:grid sm:grid-cols-3 lg:grid-cols-4">
            {footerLinkGroups.slice(0, 4).map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-white/58">
                  {group.title}
                </h3>
                <ul className="space-y-2.5 text-sm text-white/82">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-sm leading-7 text-white/68">{globalDisclaimer}</p>
          </div>
          <ul className="grid gap-2.5 text-sm text-white/78 sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <span>{contactConfig.email}</span>
            </li>
          </ul>
        </div>
        <div className="border-t border-white/10 pt-5 text-sm text-white/56">
          &copy; 2026 Apex Wellness. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function XMarkIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.53 3H20.9l-7.36 8.41L22 21h-6.61l-5.18-6.42L4.6 21H1.2l7.87-8.99L1 3h6.78l4.68 5.82L17.53 3Zm-1.16 16h1.86L6.77 4.9H4.78L16.37 19Z" />
    </svg>
  );
}

function InstagramIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7h2.4l.36-2.73H13.5V9.53c0-.79.22-1.32 1.36-1.32h1.56V5.76c-.27-.04-1.2-.12-2.27-.12-2.25 0-3.79 1.37-3.79 3.89v1.74H8v2.73h2.35v7h3.15Z" />
    </svg>
  );
}

function YoutubeIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 8.3a2.88 2.88 0 0 0-2.02-2.03C17.77 5.8 12 5.8 12 5.8s-5.77 0-7.58.47A2.88 2.88 0 0 0 2.4 8.3 30.9 30.9 0 0 0 2 12a30.9 30.9 0 0 0 .4 3.7 2.88 2.88 0 0 0 2.02 2.03c1.81.47 7.58.47 7.58.47s5.77 0 7.58-.47a2.88 2.88 0 0 0 2.02-2.03A30.9 30.9 0 0 0 22 12a30.9 30.9 0 0 0-.4-3.7ZM10.1 15.15V8.85L15.55 12l-5.45 3.15Z" />
    </svg>
  );
}
