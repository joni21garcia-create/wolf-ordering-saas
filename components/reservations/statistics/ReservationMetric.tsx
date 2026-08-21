"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationMetricProps {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function ReservationMetric({
  label,
  value,
  description,
  icon,
  className,
}: ReservationMetricProps) {
  return (
    <div
      className={clsx(
        "min-w-0",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            {icon}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:text-xs">
            {label}
          </p>

          <p className="mt-0.5 truncate text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>

          {description ? (
            <p className="mt-0.5 truncate text-[11px] leading-4 text-muted-foreground sm:text-xs">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}