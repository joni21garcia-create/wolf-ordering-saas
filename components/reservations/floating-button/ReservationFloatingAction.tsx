"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";
import clsx from "clsx";

export interface ReservationFloatingActionProps {
  children?: ReactNode;

  onClick?: () => void;

  className?: string;
}

export default function ReservationFloatingAction({
  children = "Nueva reserva",
  onClick,
  className,
}: ReservationFloatingActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground shadow-lg transition hover:scale-105",
        className
      )}
    >
      <Plus className="h-5 w-5" />

      {children}
    </button>
  );
}

