"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationTimelineItemProps {
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  className?: string;
  active?: boolean;
}

export default function ReservationTimelineItem({
  title,
  description,
  time,
  icon,
  className,
  active = false,
}: ReservationTimelineItemProps) {
  return (
    <div
      role="listitem"
      className={clsx(
        "relative flex gap-3 pb-6 sm:gap-4 sm:pb-8",
        className
      )}
    >
      <div className="relative z-10 flex w-9 shrink-0 justify-center">
        <div
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-xl border",
            active
              ? "border-orange-200 bg-orange-50 text-orange-600"
              : "border-zinc-200 bg-white text-zinc-500",
            "shadow-sm"
          )}
        >
          {icon}
        </div>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <h3 className="min-w-0 text-sm font-bold text-zinc-900 sm:text-base">
            {title}
          </h3>

          {time ? (
            <time className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-zinc-400 sm:text-xs">
              {time}
            </time>
          ) : null}
        </div>

        {description ? (
          <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500 sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}