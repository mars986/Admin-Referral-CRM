"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenRoutes = ["/become-a-patient", "/contact", "/cart", "/patient-portal", "/portal"];

export function StickyMobileCta() {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/products/") && pathname !== "/products";

  if (pathname === "/") {
    return null;
  }

  if (hiddenRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(226,232,240,0.9)] bg-white/92 px-3 py-3 shadow-[0_-14px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
        <Link
          href={isProductPage ? "/become-a-patient#intake-form" : "/products"}
          className="button-secondary inline-flex min-h-13 items-center justify-center rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold"
        >
          {isProductPage ? "Pre-Order Now" : "View Products"}
        </Link>
        <Link
          href="/become-a-patient"
          className="button-primary inline-flex min-h-13 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold"
        >
          Become a Patient
        </Link>
      </div>
    </div>
  );
}
