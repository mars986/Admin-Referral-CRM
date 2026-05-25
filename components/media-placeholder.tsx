import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  label: string;
  imageSrc?: string;
  className?: string;
};

export function MediaPlaceholder({ label, imageSrc, className }: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-[rgba(191,199,209,0.42)] bg-[linear-gradient(180deg,#ffffff_0%,#eef3f8_100%)] shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={label}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.56),rgba(255,255,255,0.1))]" />
          <div className="absolute inset-y-0 left-0 w-28 bg-[linear-gradient(90deg,rgba(255,255,255,0.45),transparent)]" />
        </>
      ) : (
        <>
          <div className="molecular-grid absolute inset-y-0 left-0 w-24 opacity-35" />
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-[rgba(47,95,143,0.1)] blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(191,199,209,0.22))]" />
          <div className="absolute bottom-6 right-8 h-24 w-10 rounded-t-[1.8rem] border border-white/70 bg-white/55" />
          <div className="absolute bottom-6 right-[5.5rem] h-[4.5rem] w-7 rounded-t-[1.5rem] border border-white/70 bg-white/45" />
          <div className="absolute bottom-6 right-[8rem] h-32 w-12 rounded-t-[2rem] border border-white/70 bg-white/50" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.42))]" />
        </>
      )}
    </div>
  );
}
