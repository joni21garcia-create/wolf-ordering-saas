"use client";

import { useState } from "react";

import {
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import type {
  ReservationSettings,
  ReservationSettingsInput,
} from "@/modules/reservations/repositories/settings.repository";

type GeneralSettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

export function GeneralSettings({
  settings,
  isSaving,
  onUpdate,
}: GeneralSettingsProps) {
  const [showDisabledMessage, setShowDisabledMessage] = useState(false);

  const reservationsEnabled = settings?.reservations_enabled ?? true;

  const handleToggleReservations = async () => {
    await onUpdate({
      reservations_enabled: !reservationsEnabled,
    });
  };

  return (
    <ReservationSettingsSection
      title="General"
      description="Controla el estado principal del sistema de reservas del restaurante."
    >
      <ReservationSettingsRow
        label="Reservas online"
        description={
          reservationsEnabled
            ? "Las reservas están activas y pueden utilizarse desde el canal público."
            : "Las reservas están desactivadas para el público."
        }
      >
        <button
          type="button"
          role="switch"
          aria-checked={reservationsEnabled}
          aria-label="Activar o desactivar reservas online"
          disabled={isSaving || !settings}
          onClick={handleToggleReservations}
          className={[
            "relative inline-flex h-7 w-12 shrink-0 items-center",
            "rounded-full p-1",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            reservationsEnabled
              ? "bg-black dark:bg-white"
              : "bg-black/15 dark:bg-white/15",
          ].join(" ")}
        >
          <span
            className={[
              "block h-5 w-5 rounded-full bg-white shadow-sm",
              "transition-transform duration-200",
              reservationsEnabled
                ? "translate-x-5 dark:bg-black"
                : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Botón de reservas"
        description={
          reservationsEnabled
            ? "Queda preparado para mostrarse como acceso flotante en el landing cuando el módulo esté activo."
            : "El acceso público a reservas debe permanecer oculto mientras el módulo esté desactivado."
        }
        disabled={!reservationsEnabled}
      >
        <span
          className={[
            "inline-flex items-center rounded-full px-3 py-1.5",
            "text-xs font-medium",
            reservationsEnabled
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40",
          ].join(" ")}
        >
          {reservationsEnabled ? "Visible al activar" : "Desactivado"}
        </span>
      </ReservationSettingsRow>

      <div className="rounded-2xl border border-black/10 dark:border-white/10">
        <button
          type="button"
          onClick={() => setShowDisabledMessage((value) => !value)}
          aria-expanded={showDisabledMessage}
          className={[
            "flex w-full items-center justify-between gap-4",
            "px-4 py-4 text-left",
            "transition-colors duration-200",
            "hover:bg-black/[0.025] dark:hover:bg-white/[0.035]",
            "active:bg-black/[0.04] dark:active:bg-white/[0.05]",
          ].join(" ")}
        >
          <span>
            <span className="block text-sm font-medium text-black dark:text-white">
              Comportamiento cuando están desactivadas
            </span>

            <span className="mt-1 block text-xs leading-5 text-black/45 dark:text-white/45">
              Ajustes visuales y de experiencia para el estado inactivo.
            </span>
          </span>

          <span
            aria-hidden="true"
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center",
              "rounded-full bg-black/5 text-sm text-black/60",
              "transition-transform duration-200",
              "dark:bg-white/10 dark:text-white/60",
              showDisabledMessage ? "rotate-180" : "",
            ].join(" ")}
          >
            ↓
          </span>
        </button>

        {showDisabledMessage ? (
          <div className="border-t border-black/10 p-4 dark:border-white/10">
            <div className="rounded-xl bg-black/[0.025] px-3 py-3 text-xs leading-5 text-black/50 dark:bg-white/[0.035] dark:text-white/50">
              El mensaje personalizado para este estado todavía no tiene un
              campo persistente en la configuración de reservas actual. Por
              ahora, esta sección queda preparada sin inventar una columna en
              la base de datos.
            </div>
          </div>
        ) : null}
      </div>

      {isSaving ? (
        <p className="pt-1 text-xs text-black/40 dark:text-white/40">
          Guardando cambios...
        </p>
      ) : null}
    </ReservationSettingsSection>
  );
}