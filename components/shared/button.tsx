import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-royal-800 text-white hover:bg-royal-700 shadow-sm shadow-royal-900/20 focus-visible:ring-royal-400",
  secondary:
    "bg-sunflower-500 text-royal-950 hover:bg-sunflower-400 shadow-sm shadow-sunflower-900/20 focus-visible:ring-sunflower-400",
  outline:
    "border border-royal-200 bg-white/60 text-royal-800 hover:border-royal-300 hover:bg-royal-50 focus-visible:ring-royal-300",
  ghost: "text-royal-800 hover:bg-royal-50 focus-visible:ring-royal-300",
  whatsapp:
    "bg-mint-600 text-white hover:bg-mint-500 shadow-sm shadow-mint-900/20 focus-visible:ring-mint-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export function Button({ ...props}: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props as BaseProps;

  if (props.href !== undefined) {
    return (
      <Link
        {...(props as ButtonAsLink)}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...(props as ButtonAsButton)}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </button>
  );
}

export function getButtonClasses(variant: Variant, size: Size, className?: string): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export type { Variant as ButtonVariant, Size as ButtonSize };