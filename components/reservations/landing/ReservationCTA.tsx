"use client";

import { ReactNode } from "react";
import clsx from "clsx";

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
        "flex flex-col items-center gap-5 px-6 py-16 text-center",
        "rounded-3xl bg-primary text-primary-foreground",
        className
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight">
        {title}
      </h2>

      <p className="max-w-xl text-sm opacity-90">
        {description}
      </p>

      {action && (
        <div>
          {action}
        </div>
      )}
    </section>
  );
}

