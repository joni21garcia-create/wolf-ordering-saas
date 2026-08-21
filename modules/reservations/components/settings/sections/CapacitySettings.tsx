"use client";

import { useMemo } from "react";

import {
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import type {
  ReservationSettings,
  ReservationSettingsInput,
} from "@/modules/reservations/repositories/settings.repository";

type CapacitySettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(Math.max(Math.round(value), min), max);
}

export function CapacitySettings({
  settings,
  isSaving,
  onUpdate,
}: CapacitySettingsProps) {
  const minGuests =
    settings?.min_guests_per_reservation ?? 1;

  const maxGuests =
    settings?.max_guests_per_reservation ?? 12;

  const summary = useMemo(() => {
    if (minGuests === maxGuests) {
      return `${minGuests} personas por reserva`;
    }

    return `${minGuests}–${maxGuests} personas por reserva`;
  }, [minGuests, maxGuests]);

  const update = async (
    input: ReservationSettingsInput,
  ) => {
    await onUpdate(input);
  };

  const handleMinChange = (rawValue: string) => {
    const value = clampInteger(
      Number(rawValue) || 1,
      1,
      Math.max(maxGuests, 1),
    );

    void update({
      min_guests_per_reservation: value,
    });
  };

  const handleMaxChange = (rawValue: string) => {
    const value = clampInteger(
      Number(rawValue) || 1,
      Math.max(minGuests, 1),
      100,
    );

    void update({
      max_guests_per_reservation: value,
    });
  };

  return (
    <ReservationSettingsSection
      title="Capacidad"
      description="Define cuántas personas puede incluir una reserva y los límites que utilizará el motor de disponibilidad."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Estos límites se aplican a la reserva completa. La disponibilidad
          final también depende de las mesas y de sus capacidades.
        </p>
      }
    >
      <div className="rounded-2xl border border-black/10 bg-black/[0.015] px-4 py-3 dark:border-white/10 dark:bg-white/[0.025]">
        <p className="text-xs font-medium text-black/45 dark:text-white/45">
          Rango actual
        </p>

        <p className="mt-1 text-sm font-medium text-black dark:text-white">
          {summary}
        </p>
      </div>

      <ReservationSettingsRow
        label="Mínimo de personas"
        description="Cantidad mínima de personas permitida en una reserva."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={maxGuests}
            step={1}
            value={minGuests}
            disabled={isSaving || !settings}
            onChange={(event) =>
              handleMinChange(event.target.value)
            }
            inputMode="numeric"
            className={[
              "h-11 w-24 rounded-xl border px-3",
              "border-black/10 bg-white text-right text-sm",
              "text-black outline-none",
              "focus:border-black/30",
              "disabled:opacity-50",
              "dark:border-white/10 dark:bg-white/5",
              "dark:text-white dark:focus:border-white/30",
            ].join(" ")}
          />

          <span className="text-xs text-black/40 dark:text-white/40">
            personas
          </span>
        </div>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Máximo de personas"
        description="Cantidad máxima de personas que puede solicitar una reserva."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={minGuests}
            max={100}
            step={1}
            value={maxGuests}
            disabled={isSaving || !settings}
            onChange={(event) =>
              handleMaxChange(event.target.value)
            }
            inputMode="numeric"
            className={[
              "h-11 w-24 rounded-xl border px-3",
              "border-black/10 bg-white text-right text-sm",
              "text-black outline-none",
              "focus:border-black/30",
              "disabled:opacity-50",
              "dark:border-white/10 dark:bg-white/5",
              "dark:text-white dark:focus:border-white/30",
            ].join(" ")}
          />

          <span className="text-xs text-black/40 dark:text-white/40">
            personas
          </span>
        </div>
      </ReservationSettingsRow>

      <div className="rounded-2xl border border-black/10 px-4 py-4 dark:border-white/10">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
            i
          </div>

          <div>
            <p className="text-sm font-medium text-black dark:text-white">
              La disponibilidad depende de las mesas
            </p>

            <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
              El máximo de personas no significa que una reserva de ese tamaño
              siempre tenga un horario disponible. El sistema debe encontrar
              una combinación de mesas compatible con la cantidad solicitada.
            </p>
          </div>
        </div>
      </div>

      {minGuests > maxGuests ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          El mínimo de personas no puede ser mayor que el máximo.
        </div>
      ) : null}

      {isSaving ? (
        <p className="pt-1 text-xs text-black/40 dark:text-white/40">
          Guardando capacidad...
        </p>
      ) : null}
    </ReservationSettingsSection>
  );
}