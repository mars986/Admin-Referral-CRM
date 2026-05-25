import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(180deg,#3c5f8f_0%,#1e3a5f_100%)] px-4 py-2.5 text-white shadow-[0_18px_30px_rgba(9,15,28,0.28)] hover:brightness-110",
        secondary:
          "border border-white/10 bg-white/5 px-4 py-2.5 text-white hover:bg-white/10",
        outline:
          "border border-[var(--color-border)] bg-white px-4 py-2.5 text-[var(--color-ink)] hover:border-[var(--color-primary)]/35",
        ghost: "px-3 py-2 text-[var(--color-ink-soft)] hover:bg-white/6 hover:text-white",
        destructive:
          "bg-[linear-gradient(180deg,#ca5a5a_0%,#a83838_100%)] px-4 py-2.5 text-white hover:brightness-105",
      },
      size: {
        default: "h-10",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
