import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ResponsiveStatGridProps = {
  children: ReactNode;
  className?: string;
};

export function ResponsiveStatGrid({ children, className }: ResponsiveStatGridProps) {
  return <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>;
}
