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

type ScheduleSettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

type SchedulePeriod = {
  open: string;
  close: string;
};

type ScheduleDay = {
  enabled: boolean;
  periods: SchedulePeriod[];
};

type WeeklySchedule = Record<string, ScheduleDay>;

const DAYS = [
  { id: "monday", label: "Lunes", short: "Lun" },
  { id: "tuesday", label: "Martes", short: "Mar" },
  { id: "wednesday", label: "Miércoles", short: "Mié" },
  { id: "thursday", label: "Jueves", short: "Jue" },
  { id: "friday", label: "Viernes", short: "Vie" },
  { id: "saturday", label: "Sábado", short: "Sáb" },
  { id: "sunday", label: "Domingo", short: "Dom" },
] as const;

const DEFAULT_PERIOD: SchedulePeriod = {
  open: "12:00",
  close: "22:00",
};

function createDefaultSchedule(): WeeklySchedule {
  return DAYS.reduce<WeeklySchedule>((schedule, day) => {
    schedule[day.id] = {
      enabled: true,
      periods: [{ ...DEFAULT_PERIOD }],
    };

    return schedule;
  }, {});
}

function normalizeSchedule(value: unknown): WeeklySchedule {
  const defaults = createDefaultSchedule();

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaults;
  }

  const source = value as Record<string, unknown>;

  for (const day of DAYS) {
    const rawDay = source[day.id];

    if (!rawDay || typeof rawDay !== "object" || Array.isArray(rawDay)) {
      continue;
    }

    const dayObject = rawDay as Record<string, unknown>;

    const enabled =
      typeof dayObject.enabled === "boolean"
        ? dayObject.enabled
        : defaults[day.id].enabled;

    const rawPeriods = Array.isArray(dayObject.periods)
      ? dayObject.periods
      : [];

    const periods = rawPeriods
      .filter(
        (period): period is Record<string, unknown> =>
          Boolean(
            period &&
              typeof period === "object" &&
              !Array.isArray(period),
          ),
      )
      .map((period) => ({
        open:
          typeof period.open === "string"
            ? period.open
            : DEFAULT_PERIOD.open,
        close:
          typeof period.close === "string"
            ? period.close
            : DEFAULT_PERIOD.close,
      }))
      .filter((period) => period.open && period.close);

    defaults[day.id] = {
      enabled,
      periods:
        periods.length > 0 ? periods : [{ ...DEFAULT_PERIOD }],
    };
  }

  return defaults;
}

function scheduleToJson(schedule: WeeklySchedule) {
  return schedule;
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value: number): string {
  const normalized = Math.max(0, Math.min(24 * 60 - 1, value));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function validateSchedule(schedule: WeeklySchedule): string | null {
  for (const day of DAYS) {
    const config = schedule[day.id];

    if (!config.enabled) {
      continue;
    }

    if (config.periods.length === 0) {
      return `${day.label} necesita al menos un horario.`;
    }

    for (const period of config.periods) {
      if (!isValidTime(period.open) || !isValidTime(period.close)) {
        return `Revisa las horas de ${day.label}.`;
      }

      if (timeToMinutes(period.open) >= timeToMinutes(period.close)) {
        return `La hora de apertura debe ser anterior al cierre en ${day.label}.`;
      }
    }

    const ordered = [...config.periods].sort(
      (a, b) => timeToMinutes(a.open) - timeToMinutes(b.open),
    );

    for (let index = 1; index < ordered.length; index += 1) {
      if (
        timeToMinutes(ordered[index].open) <
        timeToMinutes(ordered[index - 1].close)
      ) {
        return `Los horarios de ${day.label} se están cruzando.`;
      }
    }
  }

  return null;
}

function formatDaySummary(day: ScheduleDay): string {
  if (!day.enabled) {
    return "Cerrado";
  }

  return day.periods
    .map((period) => `${period.open} – ${period.close}`)
    .join(" · ");
}

export function ScheduleSettings({
  settings,
  isSaving,
  onUpdate,
}: ScheduleSettingsProps) {
  const initialSchedule = useMemo(
    () => normalizeSchedule(settings?.weekly_schedule),
    [settings?.weekly_schedule],
  );

  const [schedule, setSchedule] =
    useState<WeeklySchedule>(initialSchedule);

  const [openDay, setOpenDay] = useState<string | null>("monday");
  const [localError, setLocalError] = useState<string | null>(null);

  const updateSchedule = async (nextSchedule: WeeklySchedule) => {
    const validationError = validateSchedule(nextSchedule);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    setSchedule(nextSchedule);

    const saved = await onUpdate({
      weekly_schedule: scheduleToJson(nextSchedule),
    });

    if (!saved) {
      setSchedule(normalizeSchedule(settings?.weekly_schedule));
    }
  };

  const updateDay = (
    dayId: string,
    updater: (day: ScheduleDay) => ScheduleDay,
  ) => {
    const currentDay =
      schedule[dayId] ?? {
        enabled: false,
        periods: [{ ...DEFAULT_PERIOD }],
      };

    const nextSchedule: WeeklySchedule = {
      ...schedule,
      [dayId]: updater(currentDay),
    };

    void updateSchedule(nextSchedule);
  };

  const toggleDay = (dayId: string) => {
    updateDay(dayId, (day) => ({
      ...day,
      enabled: !day.enabled,
    }));
  };

  const updatePeriod = (
    dayId: string,
    periodIndex: number,
    field: keyof SchedulePeriod,
    value: string,
  ) => {
    updateDay(dayId, (day) => ({
      ...day,
      periods: day.periods.map((period, index) =>
        index === periodIndex
          ? {
              ...period,
              [field]: value,
            }
          : period,
      ),
    }));
  };

  const addPeriod = (dayId: string) => {
    updateDay(dayId, (day) => {
      const ordered = [...day.periods].sort(
        (a, b) => timeToMinutes(a.open) - timeToMinutes(b.open),
      );

      // Añadimos una franja en el primer espacio disponible para evitar
      // crear por defecto una franja que se cruce con la anterior.
      const durationMinutes = 120;
      const dayEndMinutes = 24 * 60;

      const candidates: Array<{ open: number; close: number }> = [];

      // Preferimos continuar justo después de la última franja.
      if (ordered.length > 0) {
        const lastClose = timeToMinutes(ordered[ordered.length - 1].close);
        if (lastClose + durationMinutes < dayEndMinutes) {
          candidates.push({
            open: lastClose,
            close: lastClose + durationMinutes,
          });
        }
      }

      // Si no cabe al final, buscamos espacio antes de la primera franja.
      if (ordered.length > 0) {
        const firstOpen = timeToMinutes(ordered[0].open);
        if (firstOpen >= durationMinutes) {
          candidates.push({
            open: firstOpen - durationMinutes,
            close: firstOpen,
          });
        }
      }

      // Finalmente buscamos cualquier hueco entre dos franjas existentes.
      for (let index = 1; index < ordered.length; index += 1) {
        const previousClose = timeToMinutes(ordered[index - 1].close);
        const nextOpen = timeToMinutes(ordered[index].open);

        if (nextOpen - previousClose >= durationMinutes) {
          candidates.push({
            open: previousClose,
            close: previousClose + durationMinutes,
          });
          break;
        }
      }

      const candidate = candidates[0];

      if (!candidate) {
        setLocalError(
          `No hay espacio disponible para añadir otra franja el ${DAYS.find((item) => item.id === dayId)?.label ?? "día"}. Ajusta primero uno de los horarios existentes.`,
        );
        return day;
      }

      setLocalError(null);

      return {
        ...day,
        periods: [
          ...day.periods,
          {
            open: minutesToTime(candidate.open),
            close: minutesToTime(candidate.close),
          },
        ],
      };
    });
  };

  const removePeriod = (dayId: string, periodIndex: number) => {
    updateDay(dayId, (day) => {
      if (day.periods.length <= 1) {
        return day;
      }

      return {
        ...day,
        periods: day.periods.filter(
          (_, index) => index !== periodIndex,
        ),
      };
    });
  };

  const applyDayToAll = (dayId: string) => {
    const source = schedule[dayId];

    if (!source) {
      return;
    }

    const nextSchedule: WeeklySchedule = {
      ...schedule,
    };

    for (const day of DAYS) {
      nextSchedule[day.id] = {
        enabled: source.enabled,
        periods: source.periods.map((period) => ({
          ...period,
        })),
      };
    }

    void updateSchedule(nextSchedule);
  };

  return (
    <ReservationSettingsSection
      title="Horarios"
      description="Define los días y franjas en los que el restaurante acepta reservas."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Los horarios guardados aquí son la base que utiliza el motor de
          disponibilidad para generar los turnos de reserva.
        </p>
      }
    >
      {localError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {localError}
        </div>
      ) : null}

      {DAYS.map((day) => {
        const daySchedule =
          schedule[day.id] ?? {
            enabled: false,
            periods: [{ ...DEFAULT_PERIOD }],
          };

        const isOpen = openDay === day.id;

        return (
          <ReservationSettingsDisclosure
            key={day.id}
            title={day.label}
            description={formatDaySummary(daySchedule)}
            open={isOpen}
            onOpenChange={(open) =>
              setOpenDay(open ? day.id : null)
            }
          >
            <div className="space-y-4">
              <ReservationSettingsRow
                label={`Reservas del ${day.label.toLowerCase()}`}
                description={
                  daySchedule.enabled
                    ? "El restaurante acepta reservas este día."
                    : "El día permanece cerrado para reservas."
                }
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={daySchedule.enabled}
                  aria-label={`Activar reservas el ${day.label}`}
                  disabled={isSaving || !settings}
                  onClick={() => toggleDay(day.id)}
                  className={[
                    "relative inline-flex h-7 w-12 shrink-0 items-center",
                    "rounded-full p-1 transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2",
                    "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    daySchedule.enabled
                      ? "bg-black dark:bg-white"
                      : "bg-black/15 dark:bg-white/15",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-5 w-5 rounded-full bg-white shadow-sm",
                      "transition-transform duration-200",
                      daySchedule.enabled
                        ? "translate-x-5 dark:bg-black"
                        : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </ReservationSettingsRow>

              {daySchedule.enabled ? (
                <>
                  <div className="space-y-3">
                    {daySchedule.periods.map((period, periodIndex) => (
                      <div
                        key={`${day.id}-${periodIndex}`}
                        className="rounded-2xl border border-black/10 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.025]"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                              Apertura
                            </span>

                            <input
                              type="time"
                              value={period.open}
                              disabled={isSaving}
                              onChange={(event) =>
                                updatePeriod(
                                  day.id,
                                  periodIndex,
                                  "open",
                                  event.target.value,
                                )
                              }
                              className={[
                                "h-11 w-full rounded-xl border",
                                "border-black/10 bg-white px-3",
                                "text-sm text-black outline-none",
                                "transition-colors",
                                "focus:border-black/30",
                                "disabled:opacity-50",
                                "dark:border-white/10 dark:bg-white/5",
                                "dark:text-white dark:focus:border-white/30",
                              ].join(" ")}
                            />
                          </label>

                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                              Cierre
                            </span>

                            <input
                              type="time"
                              value={period.close}
                              disabled={isSaving}
                              onChange={(event) =>
                                updatePeriod(
                                  day.id,
                                  periodIndex,
                                  "close",
                                  event.target.value,
                                )
                              }
                              className={[
                                "h-11 w-full rounded-xl border",
                                "border-black/10 bg-white px-3",
                                "text-sm text-black outline-none",
                                "transition-colors",
                                "focus:border-black/30",
                                "disabled:opacity-50",
                                "dark:border-white/10 dark:bg-white/5",
                                "dark:text-white dark:focus:border-white/30",
                              ].join(" ")}
                            />
                          </label>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-xs text-black/40 dark:text-white/40">
                            Franja {periodIndex + 1}
                          </span>

                          {daySchedule.periods.length > 1 ? (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() =>
                                removePeriod(day.id, periodIndex)
                              }
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500/10 disabled:opacity-40 dark:text-red-300"
                            >
                              Eliminar
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => addPeriod(day.id)}
                      className={[
                        "rounded-xl border border-black/10 px-3.5 py-2.5",
                        "text-xs font-medium text-black/65",
                        "transition hover:bg-black/5",
                        "disabled:opacity-40",
                        "dark:border-white/10 dark:text-white/65",
                        "dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      + Añadir franja
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => applyDayToAll(day.id)}
                      className={[
                        "rounded-xl px-3.5 py-2.5",
                        "text-xs font-medium text-black/55",
                        "transition hover:bg-black/5",
                        "disabled:opacity-40",
                        "dark:text-white/55 dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      Aplicar a todos
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl bg-black/[0.025] px-3 py-3 text-xs leading-5 text-black/45 dark:bg-white/[0.035] dark:text-white/45">
                  Este día está cerrado para reservas.
                </div>
              )}
            </div>
          </ReservationSettingsDisclosure>
        );
      })}

      {isSaving ? (
        <p className="pt-1 text-xs text-black/40 dark:text-white/40">
          Guardando horarios...
        </p>
      ) : null}
    </ReservationSettingsSection>
  );
}