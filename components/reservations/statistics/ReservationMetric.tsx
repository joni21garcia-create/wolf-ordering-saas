"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationMetricProps {
  label: ReactNode;

  value: ReactNode;

  description?: ReactNode;

  className?: string;
}

export default function ReservationMetric({
  label,
  value,
  description,
  className,
}: ReservationMetricProps) {
  return (
    <div
      className={clsx(
        "space-y-1",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="text-3xl font-bold tracking-tight">
        {value}
      </p>

      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

