"use client";

import {
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import type {
  ReservationSettings,
  ReservationSettingsInput,
} from "@/modules/reservations/repositories/settings.repository";

type ConfirmationSettingsProps = {
  settings: ReservationSettings | null;
  isSaving: boolean;
  onUpdate: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
};

export function ConfirmationSettings({
  settings,
  isSaving,
  onUpdate,
}: ConfirmationSettingsProps) {
  const autoConfirm = settings?.auto_confirm ?? false;

  const handleToggle = async () => {
    await onUpdate({
      auto_confirm: !autoConfirm,
    });
  };

  return (
    <ReservationSettingsSection
      title="Confirmación"
      description="Define si las reservas nuevas se confirman automáticamente o quedan pendientes para revisión."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          El modo seleccionado determina el estado inicial de las nuevas
          reservas. El restaurante podrá seguir gestionando posteriormente sus
          estados desde el calendario de reservas.
        </p>
      }
    >
      <ReservationSettingsRow
        label="Confirmación automática"
        description={
          autoConfirm
            ? "Las nuevas reservas entran directamente como confirmadas."
            : "Las nuevas reservas entran como pendientes y requieren revisión."
        }
      >
        <button
          type="button"
          role="switch"
          aria-checked={autoConfirm}
          aria-label="Activar o desactivar confirmación automática"
          disabled={isSaving || !settings}
          onClick={() => void handleToggle()}
          className={[
            "relative inline-flex h-7 w-12 shrink-0 items-center",
            "rounded-full p-1 transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            autoConfirm
              ? "bg-black dark:bg-white"
              : "bg-black/15 dark:bg-white/15",
          ].join(" ")}
        >
          <span
            className={[
              "block h-5 w-5 rounded-full bg-white shadow-sm",
              "transition-transform duration-200",
              autoConfirm
                ? "translate-x-5 dark:bg-black"
                : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </ReservationSettingsRow>

      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className={[
            "rounded-2xl border p-4 transition-colors duration-200",
            autoConfirm
              ? "border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.035]"
              : "border-black/5 bg-black/[0.01] dark:border-white/5 dark:bg-white/[0.02]",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <span
              className={[
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-full text-xs font-semibold",
                autoConfirm
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/45 dark:bg-white/10 dark:text-white/45",
              ].join(" ")}
            >
              A
            </span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-black dark:text-white">
                Automática
              </p>

              <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
                El cliente recibe una reserva confirmada sin intervención
                manual.
              </p>
            </div>
          </div>
        </div>

        <div
          className={[
            "rounded-2xl border p-4 transition-colors duration-200",
            !autoConfirm
              ? "border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.035]"
              : "border-black/5 bg-black/[0.01] dark:border-white/5 dark:bg-white/[0.02]",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <span
              className={[
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-full text-xs font-semibold",
                !autoConfirm
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/45 dark:bg-white/10 dark:text-white/45",
              ].join(" ")}
            >
              M
            </span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-black dark:text-white">
                Manual
              </p>

              <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
                La reserva queda pendiente hasta que el restaurante la revise y
                la confirme.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 px-4 py-4 dark:border-white/10">
        <p className="text-xs font-medium text-black/45 dark:text-white/45">
          Estado actual
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              autoConfirm
                ? "bg-emerald-500"
                : "bg-amber-500",
            ].join(" ")}
          />

          <p className="text-sm font-medium text-black dark:text-white">
            {autoConfirm
              ? "Las nuevas reservas serán confirmadas automáticamente"
              : "Las nuevas reservas quedarán pendientes"}
          </p>
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