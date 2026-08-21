"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { ArrowRight, CalendarPlus } from "lucide-react";

export interface ReservationCTAProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function ReservationCTA({
  title = "¿Listo para reservar?",
  description = "Haz tu reserva ahora y disfruta de nuestra experiencia.",
  action,
  className,
}: ReservationCTAProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-orange-200/60",
        "bg-orange-500 px-5 py-8 text-white shadow-sm",
        "sm:px-8 sm:py-10",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-white/80">
            <CalendarPlus className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
              Reservaciones
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-5 text-white/80">
            {description}
          </p>
        </div>

        {action ? (
          <div className="shrink-0 [&_button]:w-full sm:[&_button]:w-auto">
            {action}
          </div>
        ) : (
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:flex">
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </section>
  );
}