"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationFeaturesProps {
  items?: ReactNode[];

  className?: string;
}

export default function ReservationFeatures({
  items = [
    "Reserva rápida y sencilla",
    "Confirmación inmediata",
    "Atención personalizada",
  ],
  className,
}: ReservationFeaturesProps) {
  return (
    <section
      className={clsx(
        "grid gap-6 px-6 py-12 sm:grid-cols-3",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-6 text-center"
        >
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            ✓
          </div>

          <p className="text-sm font-medium">
            {item}
          </p>
        </div>
      ))}
    </section>
  );
}

