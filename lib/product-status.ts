import type { ProductStatus } from "@/lib/types";

type ProductStatusMeta = {
  badgeLabel: string;
  badgeClassName: string;
  availabilityLabel: string;
  availabilityClassName: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  primaryCtaClassName: string;
  noticeTitle?: string;
  noticeBody?: string;
};

export function getProductStatusMeta(status: ProductStatus): ProductStatusMeta {
  switch (status) {
    case "available":
      return {
        badgeLabel: "AVAILABLE NOW",
        badgeClassName: "border-[rgba(22,163,74,0.2)] bg-[rgba(22,163,74,0.08)] text-emerald-600",
        availabilityLabel: "Available Now",
        availabilityClassName: "text-emerald-700",
        primaryCtaLabel: "Start Assessment",
        primaryCtaHref: "/become-a-patient#intake-form",
        primaryCtaClassName: "button-primary shadow-lg shadow-[rgba(7,31,69,0.14)]",
      };
    case "sold-out":
      return {
        badgeLabel: "TEMPORARILY UNAVAILABLE",
        badgeClassName: "border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.08)] text-red-600",
        availabilityLabel: "Temporarily Unavailable",
        availabilityClassName: "text-red-700",
        primaryCtaLabel: "Get Restock Update",
        primaryCtaHref: "/contact",
        primaryCtaClassName: "bg-[var(--color-cloud)] text-[var(--color-primary)] hover:bg-white",
        noticeTitle: "Restock Notice",
        noticeBody:
          "This product is temporarily unavailable. Use the restock update option to receive availability changes when inventory returns.",
      };
    case "coming-soon":
      return {
        badgeLabel: "COMING SOON",
        badgeClassName: "border-[rgba(47,95,143,0.28)] bg-[rgba(47,95,143,0.08)] text-[var(--color-primary)]",
        availabilityLabel: "Coming Soon",
        availabilityClassName: "text-[var(--color-primary)]",
        primaryCtaLabel: "Join Availability List",
        primaryCtaHref: "/contact",
        primaryCtaClassName: "bg-[var(--color-cloud)] text-[var(--color-primary)] hover:bg-white",
        noticeTitle: "Launch Notice",
        noticeBody:
          "This product is coming soon. Join the availability list for release and availability updates.",
      };
    case "pre-order":
    default:
      return {
        badgeLabel: "PRE-ORDER",
        badgeClassName: "border-[rgba(180,83,9,0.22)] bg-[rgba(245,158,11,0.12)] text-amber-700",
        availabilityLabel: "Pre-Order",
        availabilityClassName: "text-amber-700",
        primaryCtaLabel: "Pre-Order Now",
        primaryCtaHref: "/become-a-patient#intake-form",
        primaryCtaClassName: "button-primary shadow-lg shadow-[rgba(7,31,69,0.14)]",
        noticeTitle: "Pre-Order Notice",
      };
  }
}
