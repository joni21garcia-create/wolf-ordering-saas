"use client";

import {
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import type {
  ReservationSettings,
  ReservationSettingsInput,
} from "@/modules/reservations/repositories/settings.repository";

type NotificationSettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

export function NotificationSettings({
  settings,
  isSaving,
  onUpdate,
}: NotificationSettingsProps) {
  const requirePhone = settings?.require_phone ?? true;
  const requireEmail = settings?.require_email ?? false;

  const update = async (
    input: ReservationSettingsInput,
  ) => {
    await onUpdate(input);
  };

  return (
    <ReservationSettingsSection
      title="Notificaciones"
      description="Configura los datos de contacto que deben solicitarse al crear una reserva y deja preparada la base para futuras notificaciones."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Las preferencias de envío de notificaciones todavía no forman parte
          de la configuración persistente actual. Por eso esta pantalla no
          inventa campos de base de datos que aún no existen.
        </p>
      }
    >
      <ReservationSettingsRow
        label="Solicitar teléfono"
        description="El cliente deberá proporcionar un número de teléfono al crear la reserva."
      >
        <button
          type="button"
          role="switch"
          aria-checked={requirePhone}
          aria-label="Solicitar teléfono"
          disabled={isSaving || !settings}
          onClick={() =>
            void update({
              require_phone: !requirePhone,
            })
          }
          className={[
            "relative inline-flex h-7 w-12 shrink-0 items-center",
            "rounded-full p-1 transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            requirePhone
              ? "bg-black dark:bg-white"
              : "bg-black/15 dark:bg-white/15",
          ].join(" ")}
        >
          <span
            className={[
              "block h-5 w-5 rounded-full bg-white shadow-sm",
              "transition-transform duration-200",
              requirePhone
                ? "translate-x-5 dark:bg-black"
                : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </ReservationSettingsRow>

      <ReservationSettingsRow
        label="Solicitar email"
        description="El cliente deberá proporcionar un correo electrónico al crear la reserva."
      >
        <button
          type="button"
          role="switch"
          aria-checked={requireEmail}
          aria-label="Solicitar email"
          disabled={isSaving || !settings}
          onClick={() =>
            void update({
              require_email: !requireEmail,
            })
          }
          className={[
            "relative inline-flex h-7 w-12 shrink-0 items-center",
            "rounded-full p-1 transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            requireEmail
              ? "bg-black dark:bg-white"
              : "bg-black/15 dark:bg-white/15",
          ].join(" ")}
        >
          <span
            className={[
              "block h-5 w-5 rounded-full bg-white shadow-sm",
              "transition-transform duration-200",
              requireEmail
                ? "translate-x-5 dark:bg-black"
                : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </ReservationSettingsRow>

      <div className="rounded-2xl border border-black/10 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.025]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
            i
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-black dark:text-white">
              Datos disponibles para notificaciones
            </p>

            <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
              {requirePhone && requireEmail
                ? "La reserva puede disponer de teléfono y email para futuras confirmaciones y recordatorios."
                : requirePhone
                  ? "El teléfono estará disponible como dato de contacto principal."
                  : requireEmail
                    ? "El email estará disponible como dato de contacto principal."
                    : "No se está solicitando teléfono ni email de forma obligatoria."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-black/10 px-4 py-4 dark:border-white/10">
        <p className="text-sm font-medium text-black dark:text-white">
          Preferencias de envío
        </p>

        <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
          Próximamente podremos añadir aquí canales y eventos como
          confirmación, recordatorio, cancelación y cambios de reserva. Esta
          parte queda separada para poder incorporar esos campos sin modificar
          la estructura visual de la pantalla.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/45 dark:bg-white/10 dark:text-white/45">
            Confirmación
          </span>

          <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/45 dark:bg-white/10 dark:text-white/45">
            Recordatorio
          </span>

          <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/45 dark:bg-white/10 dark:text-white/45">
            Cancelación
          </span>

          <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/45 dark:bg-white/10 dark:text-white/45">
            Cambios
          </span>
        </div>
      </div>

      {isSaving ? (
        <p className="pt-1 text-xs text-black/40 dark:text-white/40">
          Guardando configuración...
        </p>
      ) : null}
    </ReservationSettingsSection>
  );
}