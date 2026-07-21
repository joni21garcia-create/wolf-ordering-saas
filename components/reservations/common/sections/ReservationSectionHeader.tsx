"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationSectionHeaderProps {
  title: ReactNode;

  description?: ReactNode;

  className?: string;

  centered?: boolean;
}

export default function ReservationSectionHeader({
  title,
  description,
  className,
  centered = false,
}: ReservationSectionHeaderProps) {
  return (
    <div
      className={clsx(
        "space-y-1",
        centered && "text-center",
        className
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

