"use client";

import { ReactNode } from "react";
import clsx from "clsx";

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
        "flex flex-col items-center justify-center gap-6 px-6 py-20 text-center",
        className
      )}
    >
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
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

