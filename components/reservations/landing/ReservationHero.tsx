"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { CalendarDays } from "lucide-react";

export interface ReservationHeroProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function ReservationHero({
  title = "Reserva tu experiencia",
  description = "Realiza tu reserva de forma rápida, sencilla y segura.",
  action,
  className,
}: ReservationHeroProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-card",
        "px-5 py-10 text-center shadow-sm sm:px-8 sm:py-14",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-500/10 to-transparent"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
          <CalendarDays className="h-5 w-5" />
        </div>

        <h1 className="max-w-3xl text-3xl font-black tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {description}
        </p>

        {action ? (
          <div className="mt-6 w-full sm:w-auto">
            {action}
          </div>
        ) : null}
      </div>
    </section>
  );
}