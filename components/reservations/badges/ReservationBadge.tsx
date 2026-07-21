"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationBadgeProps {
  children: ReactNode;

  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info";

  className?: string;
}

const variants = {
  default:
    "bg-zinc-100 text-zinc-700",

  success:
    "bg-green-100 text-green-700",

  warning:
    "bg-yellow-100 text-yellow-700",

  danger:
    "bg-red-100 text-red-700",

  info:
    "bg-blue-100 text-blue-700",
};

export default function ReservationBadge({
  children,
  variant = "default",
  className,
}: ReservationBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

