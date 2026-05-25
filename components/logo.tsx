import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  inverted?: boolean;
  priority?: boolean;
};

export function Logo({
  href = "/",
  className,
  inverted = false,
  priority = false,
}: LogoProps) {
  const image = (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/logo-wordmark.png"
        alt="Apex Wellness"
        width={1350}
        height={500}
        priority={priority}
        className={cn("h-auto w-[158px] sm:w-[230px] lg:w-[286px]", inverted && "footer-logo")}
      />
    </span>
  );

  return href ? <Link href={href}>{image}</Link> : image;
}
