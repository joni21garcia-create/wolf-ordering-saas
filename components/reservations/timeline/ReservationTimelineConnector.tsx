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
      className={clsx(
        "absolute left-4 top-8 h-full w-px",
        active ? "bg-primary" : "bg-border",
        className
      )}
    />
  );
}

