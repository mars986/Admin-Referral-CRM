"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CART_EVENT_NAME, getCartCount, readCartItems } from "@/lib/cart";
import { siteNavigation } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
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
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(5,16,31,0.64)] transition duration-300 lg:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "ml-auto flex h-full w-full max-w-sm flex-col bg-[linear-gradient(180deg,#071f45_0%,#05101f_100%)] shadow-2xl transition duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/14 bg-white/8 p-2 text-white"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          <nav aria-label="Mobile navigation links" className="flex flex-col gap-2">
            {siteNavigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-[#F4F7FB]/96 px-4 py-4 text-base font-semibold text-[#0B1B3B] shadow-[0_18px_34px_rgba(3,10,24,0.14)] backdrop-blur-xl transition duration-300",
                    active
                      ? "border-[rgba(255,255,255,0.08)] bg-[#F4F7FB] text-[#0B1B3B] shadow-[0_22px_42px_rgba(3,10,24,0.18)]"
                      : "hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.08)] hover:bg-white hover:text-[#0B1B3B]",
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="size-4 text-[#0B1B3B]" />
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 space-y-3">
            <Link
              href="/become-a-patient"
              onClick={onClose}
              className="button-primary flex min-h-14 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white/90 shadow-lg transition hover:text-white"
            >
              Become a Patient
            </Link>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex min-h-13 items-center justify-between rounded-xl border border-white/10 bg-[#F4F7FB]/96 px-4 py-3 text-sm font-semibold text-[#0B1B3B] shadow-[0_18px_34px_rgba(3,10,24,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                <span>Cart</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{cartCount}</span>
                  <ShoppingCart className="size-4 text-[#0B1B3B]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
