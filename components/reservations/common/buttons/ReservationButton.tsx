"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface ReservationButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  loading?: boolean;

  fullWidth?: boolean;

  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";

  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90",

  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",

  outline:
    "border border-border bg-background hover:bg-muted",

  ghost:
    "hover:bg-muted",

  danger:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700",
};

const sizes = {
  sm: "h-9 px-3 text-sm",

  md: "h-11 px-5 text-sm",

  lg: "h-12 px-6 text-base",
};

export default function ReservationButton({
  children,
  className,
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  fullWidth = false,
  variant = "primary",
  size = "md",
  ...props
}: ReservationButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",

        "focus:outline-none focus:ring-2 focus:ring-primary/30",

        "disabled:pointer-events-none disabled:opacity-50",

        variants[variant],

        sizes[size],

        fullWidth && "w-full",

        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {!loading && leftIcon}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
}


