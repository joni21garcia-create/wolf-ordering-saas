"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationTimelineItemProps {
  title: ReactNode;

  description?: ReactNode;

  time?: ReactNode;

  icon?: ReactNode;

  className?: string;
}

export default function ReservationTimelineItem({
  title,
  description,
  time,
  icon,
  className,
}: ReservationTimelineItemProps) {
  return (
    <div
      className={clsx(
        "relative flex gap-4 pb-8",
        className
      )}
    >
      <div className="relative flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {time && (
          <p className="text-xs text-muted-foreground">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}

