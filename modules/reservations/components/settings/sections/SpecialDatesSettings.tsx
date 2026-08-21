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

import type { SpecialDateSettings } from "@/modules/reservations/repositories/availability.repository";

type SpecialDatesSettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

const EMPTY_ENTRY: Omit<SpecialDateSettings, "date"> = {
  closed: true,
  open: null,
  close: null,
  label: null,
};

function normalize(value: unknown): SpecialDateSettings[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(
          item &&
            typeof item === "object" &&
            !Array.isArray(item),
        ),
    )
    .map((item) => ({
      date: typeof item.date === "string" ? item.date.slice(0, 10) : "",
      closed: item.closed === true,
      open: typeof item.open === "string" ? item.open.slice(0, 5) : null,
      close: typeof item.close === "string" ? item.close.slice(0, 5) : null,
      label: typeof item.label === "string" ? item.label : null,
    }))
    .filter((item) => item.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function validate(entries: SpecialDateSettings[]): string | null {
  const dates = new Set<string>();

  for (const entry of entries) {
    if (dates.has(entry.date)) {
      return `La fecha ${entry.date} está repetida.`;
    }

    dates.add(entry.date);

    if (entry.closed) continue;

    if (!entry.open || !entry.close) {
      return `La fecha ${entry.date} necesita hora de apertura y cierre.`;
    }

    if (entry.open >= entry.close) {
      return `La apertura debe ser anterior al cierre en ${entry.date}.`;
    }
  }

  return null;
}

export function SpecialDatesSettings({
  settings,
  isSaving,
  onUpdate,
}: SpecialDatesSettingsProps) {
  const [entries, setEntries] = useState<SpecialDateSettings[]>(
    () => normalize(settings?.special_dates),
  );
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [draft, setDraft] = useState<SpecialDateSettings>({
    date: "",
    ...EMPTY_ENTRY,
  });
  const [error, setError] = useState<string | null>(null);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  );

  const save = async (next: SpecialDateSettings[]) => {
    const validationError = validate(next);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const result = await onUpdate({
      special_dates: next,
    });

    if (result) {
      setEntries(normalize(result.special_dates));
    }
  };

  const addDate = async () => {
    if (!draft.date) {
      setError("Selecciona una fecha.");
      return;
    }

    const next = [...entries, { ...draft }];

    await save(next);

    setDraft({
      date: "",
      ...EMPTY_ENTRY,
    });
    setOpenDate(null);
  };

  const updateEntry = async (
    date: string,
    patch: Partial<SpecialDateSettings>,
  ) => {
    const next = entries.map((entry) =>
      entry.date === date
        ? { ...entry, ...patch }
        : entry,
    );

    await save(next);
  };

  const removeEntry = async (date: string) => {
    await save(entries.filter((entry) => entry.date !== date));

    if (openDate === date) {
      setOpenDate(null);
    }
  };

  return (
    <ReservationSettingsSection
      title="Fechas especiales"
      description="Cierra días concretos o reemplaza temporalmente su horario habitual."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Una fecha especial tiene prioridad sobre el horario semanal. Si está
          marcada como cerrada, no aparecerá como disponible para reservas.
        </p>
      }
    >
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.025]">
        <p className="text-sm font-medium text-black dark:text-white">
          Añadir fecha
        </p>

        <div className="mt-4 grid gap-3">
          <label>
            <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
              Fecha
            </span>

            <input
              type="date"
              value={draft.date}
              disabled={isSaving}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  date: event.target.value,
                }))
              }
              className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
              Nombre
            </span>

            <input
              type="text"
              value={draft.label ?? ""}
              disabled={isSaving}
              placeholder="Ej. Navidad"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  label: event.target.value || null,
                }))
              }
              className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </label>

          <ReservationSettingsRow
            label="Día cerrado"
            description="Si está activo, esta fecha no tendrá horarios de reserva."
          >
            <button
              type="button"
              role="switch"
              aria-checked={draft.closed}
              aria-label="Marcar fecha como cerrada"
              disabled={isSaving}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  closed: !current.closed,
                }))
              }
              className={[
                "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
                "disabled:opacity-50",
                draft.closed
                  ? "bg-black dark:bg-white"
                  : "bg-black/15 dark:bg-white/15",
              ].join(" ")}
            >
              <span
                className={[
                  "block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  draft.closed
                    ? "translate-x-5 dark:bg-black"
                    : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </ReservationSettingsRow>

          {!draft.closed ? (
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Apertura
                </span>
                <input
                  type="time"
                  value={draft.open ?? ""}
                  disabled={isSaving}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      open: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Cierre
                </span>
                <input
                  type="time"
                  value={draft.close ?? ""}
                  disabled={isSaving}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      close: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </label>
            </div>
          ) : null}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void addDate()}
            className="h-11 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Añadir fecha especial
          </button>
        </div>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 px-4 py-5 text-center dark:border-white/10">
          <p className="text-sm font-medium text-black dark:text-white">
            No hay fechas especiales
          </p>
          <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
            El calendario utilizará el horario semanal normalmente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEntries.map((entry) => {
            const isOpen = openDate === entry.date;

            return (
              <ReservationSettingsDisclosure
                key={entry.date}
                title={entry.label || entry.date}
                description={
                  entry.closed
                    ? `${entry.date} · Cerrado`
                    : `${entry.date} · ${entry.open} – ${entry.close}`
                }
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenDate(open ? entry.date : null)
                }
              >
                <div className="space-y-4">
                  <ReservationSettingsRow
                    label="Día cerrado"
                    description="Anula el horario semanal para esta fecha."
                  >
                    <button
                      type="button"
                      role="switch"
                      aria-checked={entry.closed}
                      disabled={isSaving}
                      onClick={() =>
                        void updateEntry(entry.date, {
                          closed: !entry.closed,
                        })
                      }
                      className={[
                        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
                        "disabled:opacity-50",
                        entry.closed
                          ? "bg-black dark:bg-white"
                          : "bg-black/15 dark:bg-white/15",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                          entry.closed
                            ? "translate-x-5 dark:bg-black"
                            : "translate-x-0",
                        ].join(" ")}
                      />
                    </button>
                  </ReservationSettingsRow>

                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                      Nombre
                    </span>
                    <input
                      type="text"
                      value={entry.label ?? ""}
                      disabled={isSaving}
                      onChange={(event) =>
                        void updateEntry(entry.date, {
                          label: event.target.value || null,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </label>

                  {!entry.closed ? (
                    <div className="grid grid-cols-2 gap-3">
                      <label>
                        <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                          Apertura
                        </span>
                        <input
                          type="time"
                          value={entry.open ?? ""}
                          disabled={isSaving}
                          onChange={(event) =>
                            void updateEntry(entry.date, {
                              open: event.target.value,
                            })
                          }
                          className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </label>

                      <label>
                        <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                          Cierre
                        </span>
                        <input
                          type="time"
                          value={entry.close ?? ""}
                          disabled={isSaving}
                          onChange={(event) =>
                            void updateEntry(entry.date, {
                              close: event.target.value,
                            })
                          }
                          className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </label>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => void removeEntry(entry.date)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:opacity-50 dark:text-red-300"
                  >
                    Eliminar fecha especial
                  </button>
                </div>
              </ReservationSettingsDisclosure>
            );
          })}
        </div>
      )}

      {isSaving ? (
        <p className="pt-1 text-xs text-black/40 dark:text-white/40">
          Guardando fechas especiales...
        </p>
      ) : null}
    </ReservationSettingsSection>
  );
}