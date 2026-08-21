"use client";

import clsx from "clsx";

export interface ReservationTimelineConnectorProps {
  className?: string;
  active?: boolean;
}

export default function ReservationTimelineConnector({
  className,
  active = false,
}: ReservationTimelineConnectorProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "absolute left-[18px] top-10 bottom-0 w-px",
        active
          ? "bg-orange-400"
          : "bg-zinc-200",
        className
      )}
    />
  );
}