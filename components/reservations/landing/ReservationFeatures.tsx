"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { Check, ShieldCheck, Sparkles, Zap } from "lucide-react";

export interface ReservationFeaturesProps {
  items?: ReactNode[];
  className?: string;
}

const icons = [Zap, ShieldCheck, Sparkles];

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
      aria-label="Beneficios de reservar"
      className={clsx(
        "grid gap-2.5 sm:grid-cols-3 sm:gap-3",
        className
      )}
    >
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];

        return (
          <div
            key={`${index}-${String(item)}`}
            className="
              flex items-center gap-3 rounded-2xl
              border border-border/70 bg-card px-4 py-3.5
              shadow-sm sm:block sm:px-5 sm:py-5 sm:text-center
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 sm:mx-auto sm:mb-3">
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {item}
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground sm:hidden">
                <Check className="mr-1 inline h-3 w-3" />
                Incluido en tu reserva
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}