"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { CART_EVENT_NAME, getCartCount, readCartItems } from "@/lib/cart";
import { siteNavigation } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function syncCartCount() {
      setCartCount(getCartCount(readCartItems()));
    }

    syncCartCount();
    window.addEventListener(CART_EVENT_NAME, syncCartCount as EventListener);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener(CART_EVENT_NAME, syncCartCount as EventListener);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/80 bg-white/92 shadow-[0_8px_24px_rgba(5,16,31,0.06)] backdrop-blur-xl">
        <div className="site-container flex items-center justify-between gap-3 py-3 sm:gap-5 sm:py-4">
          <Logo priority className="drop-shadow-[0_4px_18px_rgba(7,31,69,0.08)]" />
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
            {siteNavigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-soft)]"
                >
                  <span>{item.label}</span>
                  {item.showCaret ? <ChevronDown className="size-3.5 text-[var(--color-primary)]" /> : null}
                  <span
                    className={cn(
                      "absolute -bottom-3 left-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/become-a-patient"
              className="button-primary rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-[rgba(7,31,69,0.14)] transition"
            >
              Become a Patient
            </Link>
            <Link
              href="/login"
              aria-label="Customer login"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-[var(--color-ink)] transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
            >
              <UserRound className="size-5" />
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-[var(--color-ink)] transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
            >
              <ShoppingCart className="size-5" />
              <span className="text-base font-semibold">{cartCount}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/login"
              aria-label="Customer login"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white/88 px-3 py-2 text-[var(--color-ink)] shadow-sm"
            >
              <UserRound className="size-4.5" />
            </Link>
            <Link
              href="/cart"
              className="flex min-h-11 items-center gap-1 rounded-xl border border-[var(--color-border)] bg-white/88 px-3 py-2 text-[var(--color-ink)] shadow-sm"
            >
              <ShoppingCart className="size-4.5" />
              <span className="text-sm font-semibold">{cartCount}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] p-2 text-[var(--color-ink)] shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
