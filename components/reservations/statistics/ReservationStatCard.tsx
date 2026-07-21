"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationStatCardProps {
  children: ReactNode;

  title?: ReactNode;

  icon?: ReactNode;

  className?: string;
}

export default function ReservationStatCard({
  children,
  title,
  icon,
  className,
}: ReservationStatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
          )}

          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

