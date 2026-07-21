"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface ReservationIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;

  label?: string;

  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";

  size?: "sm" | "md" | "lg";

  loading?: boolean;

  rounded?: boolean;
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
};

const sizes = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

export default function ReservationIconButton({
  icon,
  label,
  className,
  loading = false,
  disabled,
  rounded = true,
  variant = "ghost",
  size = "md",
  ...props
}: ReservationIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center transition-all duration-200",

        rounded ? "rounded-xl" : "rounded-md",

        "focus:outline-none focus:ring-2 focus:ring-primary/30",

        "disabled:pointer-events-none disabled:opacity-50",

        variants[variant],

        sizes[size],

        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
    </button>
  );
}


