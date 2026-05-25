"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { ReferralCapture } from "@/components/referral/referral-capture";
import { Header } from "@/components/header";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { TrustBar } from "@/components/trust-bar";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <AnnouncementBar />
      <TrustBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
