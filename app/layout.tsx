import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wellness.apexcompounding.com"),
  title: {
    default: "Apex Wellness | Precision Wellness Formulations",
    template: "%s | Apex Wellness",
  },
  icons: {
    icon: "/images/logo-icon.png",
    shortcut: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  description:
    "Premium wellness support designed with quality and discretion.",
  openGraph: {
    title: "Apex Wellness | Precision Wellness Formulations",
    description:
      "Premium wellness support designed with quality and discretion.",
    url: "https://wellness.apexcompounding.com",
    siteName: "Apex Wellness",
    type: "website",
    images: [
      {
        url: "/images/new-logo.png",
        width: 1200,
        height: 630,
        alt: "Apex Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Wellness | Precision Wellness Formulations",
    description:
      "Premium wellness support designed with quality and discretion.",
    images: ["/images/new-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-[var(--color-background)] font-sans text-[var(--color-ink)] antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
