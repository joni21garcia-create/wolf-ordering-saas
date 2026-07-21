"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationSectionProps {
  children: ReactNode;

  title?: ReactNode;

  description?: ReactNode;

  actions?: ReactNode;

  className?: string;

  spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
  sm: "space-y-3",
  md: "space-y-6",
  lg: "space-y-10",
};

export default function ReservationSection({
  children,
  title,
  description,
  actions,
  className,
  spacing = "md",
}: ReservationSectionProps) {
  return (
    <section
      className={clsx(
        spacingClasses[spacing],
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl font-semibold">
                {title}
              </h2>
            )}

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
        </div>
      )}

      {children}
    </section>
  );
}

