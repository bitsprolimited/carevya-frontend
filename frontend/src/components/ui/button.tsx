import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  primary:
    "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-sm",
  secondary:
    "bg-white text-navy border border-border hover:bg-surface-soft",
  ghost: "bg-transparent text-navy hover:bg-surface-soft",
  emerald: "bg-emerald text-white hover:bg-emerald-dark shadow-sm",
} as const;

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
