"use client";

import { useMemo, useState } from "react";

import {
  ReservationSettingsDisclosure,
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import type {
  ReservationSettings,
  ReservationSettingsInput,
} from "@/modules/reservations/repositories/settings.repository";

type PolicySettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

function clampNumber(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max);
}

export function PolicySettings({
  settings,
  isSaving,
  onUpdate,
}: PolicySettingsProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const duration =
    settings?.reservation_duration_minutes ?? 90;

  const interval =
    settings?.slot_interval_minutes ?? 30;

  const minAdvance =
    settings?.min_advance_hours ?? 0;

  const maxAdvance =
    settings?.max_advance_days ?? 30;

  const allowSameDay =
    settings?.allow_same_day ?? true;

  const allowCancellations =
    settings?.allow_cancellations ?? true;

  const cancellationLimit =
    settings?.cancellation_limit_hours ?? 2;

  const summary = useMemo(() => {
    return `${duration} min · cada ${interval} min · ${minAdvance} h de anticipación mínima · ${maxAdvance} días máximo`;
  }, [duration, interval, minAdvance, maxAdvance]);

  const update = async (
    input: ReservationSettingsInput,
  ) => {
    await onUpdate(input);
  };

  return (
    <ReservationSettingsSection
      title="Políticas"
      description="Define cuánto dura una reserva, cuándo puede hacerse y bajo qué condiciones puede cancelarse."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Estas reglas alimentan directamente el motor de disponibilidad y las
          validaciones al crear una reserva.
        </p>
      }
    >
      <div className="rounded-2xl border border-black/10 bg-black/[0.015] px-4 py-3 dark:border-white/10 dark:bg-white/[0.025]">
        <p className="text-xs font-medium text-black/45 dark:text-white/45">
          Resumen actual
        </p>
        <p className="mt-1 text-sm font-medium text-black dark:text-white">
          {summary}
        </p>
      </div>

      <ReservationSettingsRow
        label="Duración de la reserva"
        description="Tiempo que una mesa queda ocupada por una reserva."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={15}
            max={1440}
            step={5}
            value={duration}
            disabled={isSaving || !settings}
            onChange={(event) => {
              const value = clampNumber(
                Number(event.target.value) || 0,
                15,
                1440,
              );

              void update({
                reservation_duration_minutes: value,
              });
            }}
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
            min
          </span>
        </div>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Intervalo entre horarios"
        description="Define cada cuánto aparece una nueva hora disponible."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={5}
            max={1440}
            step={5}
            value={interval}
            disabled={isSaving || !settings}
            onChange={(event) => {
              const value = clampNumber(
                Number(event.target.value) || 0,
                5,
                1440,
              );

              void update({
                slot_interval_minutes: value,
              });
            }}
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
            min
          </span>
        </div>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Anticipación mínima"
        description="Cuánto tiempo antes del inicio debe hacerse la reserva."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={720}
            step={1}
            value={minAdvance}
            disabled={isSaving || !settings}
            onChange={(event) => {
              const value = clampNumber(
                Number(event.target.value) || 0,
                0,
                720,
              );

              void update({
                min_advance_hours: value,
              });
            }}
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
            horas
          </span>
        </div>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Anticipación máxima"
        description="Hasta cuántos días en el futuro puede reservar el cliente."
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={365}
            step={1}
            value={maxAdvance}
            disabled={isSaving || !settings}
            onChange={(event) => {
              const value = clampNumber(
                Number(event.target.value) || 0,
                0,
                365,
              );

              void update({
                max_advance_days: value,
              });
            }}
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
            días
          </span>
        </div>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Reservas el mismo día"
        description="Permite reservar para el día actual respetando la anticipación mínima."
      >
        <button
          type="button"
          role="switch"
          aria-checked={allowSameDay}
          aria-label="Permitir reservas el mismo día"
          disabled={isSaving || !settings}
          onClick={() =>
            void update({
              allow_same_day: !allowSameDay,
            })
          }
          className={[
            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            allowSameDay
              ? "bg-black dark:bg-white"
              : "bg-black/15 dark:bg-white/15",
          ].join(" ")}
        >
          <span
            className={[
              "block h-5 w-5 rounded-full bg-white shadow-sm",
              "transition-transform duration-200",
              allowSameDay
                ? "translate-x-5 dark:bg-black"
                : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </ReservationSettingsRow>

      <ReservationSettingsDisclosure
        title="Cancelaciones"
        description={
          allowCancellations
            ? `Permitidas hasta ${cancellationLimit} horas antes.`
            : "Las cancelaciones están desactivadas."
        }
        open={advancedOpen}
        onOpenChange={setAdvancedOpen}
      >
        <div className="space-y-4">
          <ReservationSettingsRow
            label="Permitir cancelaciones"
            description="Controla si el cliente puede cancelar una reserva."
          >
            <button
              type="button"
              role="switch"
              aria-checked={allowCancellations}
              aria-label="Permitir cancelaciones"
              disabled={isSaving || !settings}
              onClick={() =>
                void update({
                  allow_cancellations: !allowCancellations,
                })
              }
              className={[
                "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2",
                "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                allowCancellations
                  ? "bg-black dark:bg-white"
                  : "bg-black/15 dark:bg-white/15",
              ].join(" ")}
            >
              <span
                className={[
                  "block h-5 w-5 rounded-full bg-white shadow-sm",
                  "transition-transform duration-200",
                  allowCancellations
                    ? "translate-x-5 dark:bg-black"
                    : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </ReservationSettingsRow>

          <ReservationSettingsRow
            label="Límite para cancelar"
            description="Tiempo mínimo antes de la reserva para permitir la cancelación."
            disabled={!allowCancellations}
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={720}
                step={1}
                value={cancellationLimit}
                disabled={
                  isSaving ||
                  !settings ||
                  !allowCancellations
                }
                onChange={(event) => {
                  const value = clampNumber(
                    Number(event.target.value) || 0,
                    0,
                    720,
                  );

                  void update({
                    cancellation_limit_hours: value,
                  });
                }}
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
                horas
              </span>
            </div>
          </ReservationSettingsRow>
        </div>
      </ReservationSettingsDisclosure>

      {isSaving ? (
        <p className="pt-1 text-xs text-black/40 dark:text-white/40">
          Guardando políticas...
        </p>
      ) : null}
    </ReservationSettingsSection>
  );
}