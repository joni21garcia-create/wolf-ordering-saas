"use client";

import { ReactNode } from "react";
import { CalendarX } from "lucide-react";

export interface ReservationEmptyStateProps {
  title?: ReactNode;

  description?: ReactNode;

  icon?: ReactNode;
}

export default function ReservationEmptyState({
  title = "No hay reservas",
  description = "Todavía no tienes reservas creadas.",
  icon,
}: ReservationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? (
          <CalendarX className="h-7 w-7" />
        )}
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

