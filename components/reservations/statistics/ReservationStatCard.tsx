"use client";

import type { ReactNode } from "react";
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
    <section
      className={clsx(
        "min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-colors",
        "sm:p-5",
        className
      )}
    >
      {(title || icon) ? (
        <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
          {title ? (
            <h3 className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:text-xs">
              {title}
            </h3>
          ) : (
            <span />
          )}

          {icon ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              {icon}
            </span>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}