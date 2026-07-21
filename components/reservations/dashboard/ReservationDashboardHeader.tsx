"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationDashboardHeaderProps {
  title: ReactNode;

  description?: ReactNode;

  actions?: ReactNode;

  className?: string;
}

export default function ReservationDashboardHeader({
  title,
  description,
  actions,
  className,
}: ReservationDashboardHeaderProps) {
  return (
    <header
      className={clsx(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

