/* FILE: modules/reservations/components/settings/sections/DepositSettings.tsx */

"use client";

import { useEffect, useState } from "react";

import {
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import type {
  ReservationDepositSettings,
  ReservationDepositSettingsInput,
} from "@/modules/reservations/repositories/deposit.repository";

type Props = {
  restaurantId: string;
};

export function DepositSettings({
  restaurantId,
}: Props) {
  const [settings, setSettings] =
    useState<ReservationDepositSettings | null>(
      null,
    );

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void import(
      "@/modules/reservations/actions"
    ).then(
      async ({
        getReservationDepositSettings,
      }) => {
        try {
          const result =
            await getReservationDepositSettings(
              restaurantId,
            );

          if (!cancelled) {
            setSettings(result);
          }
        } catch (caught) {
          if (!cancelled) {
            setError(
              caught instanceof Error
                ? caught.message
                : "No pudimos cargar la configuración del anticipo.",
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const update = async (
    input: ReservationDepositSettingsInput,
  ) => {
    setSaving(true);
    setError(null);

    try {
      const {
        updateReservationDepositSettings,
      } = await import(
        "@/modules/reservations/actions"
      );

      const result =
        await updateReservationDepositSettings(
          restaurantId,
          input,
        );

      setSettings(result);
      return result;
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No pudimos guardar la configuración.",
      );

      return null;
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="h-24 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  /*
   * El anticipo solamente puede activarse cuando
   * existe un monto y está habilitada la consignación
   * bancaria / QR.
   *
   * PayPal ya no forma parte del flujo.
   */
  const canEnable =
    settings.amount > 0 &&
    settings.allow_transfer;

  return (
    <ReservationSettingsSection
      title="Anticipo"
      description="Solicita un anticipo opcional al confirmar una reserva, sin modificar el flujo normal de reservas."
      footer={
        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          El anticipo pertenece exclusivamente a
          Reservas. No modifica pedidos ni la
          suscripción mensual de Wolf.
        </p>
      }
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <ReservationSettingsRow
          label="Monto del anticipo"
          description="Monto fijo que se solicita por cada reserva."
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/40 dark:text-white/40">
              $
            </span>

            <input
              type="number"
              min={0}
              step={0.01}
              value={settings.amount}
              disabled={saving}
              onChange={(event) =>
                void update({
                  amount: Math.max(
                    0,
                    Number(
                      event.target.value,
                    ) || 0,
                  ),
                })
              }
              className="h-11 w-28 rounded-xl border border-black/10 bg-white px-3 text-right text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
          </div>
        </ReservationSettingsRow>

        <ReservationSettingsRow
          label="Consignación bancaria / QR"
          description="El cliente podrá pagar el anticipo mediante transferencia o el QR configurado."
        >
          <button
            type="button"
            role="switch"
            aria-checked={
              settings.allow_transfer
            }
            disabled={saving}
            onClick={() =>
              void update({
                allow_transfer:
                  !settings.allow_transfer,
                allow_cash: false,
              })
            }
            className={[
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1",
              "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              settings.allow_transfer
                ? "bg-black dark:bg-white"
                : "bg-black/15 dark:bg-white/15",
            ].join(" ")}
          >
            <span
              className={[
                "block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                settings.allow_transfer
                  ? "translate-x-5 dark:bg-black"
                  : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </ReservationSettingsRow>

        {settings.allow_transfer ? (
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-black dark:text-white">
                Banco

                <input
                  type="text"
                  value={
                    settings.bank_name ?? ""
                  }
                  disabled={saving}
                  onChange={(event) =>
                    void update({
                      bank_name:
                        event.target.value,
                    })
                  }
                  placeholder="Nombre del banco"
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <label className="text-sm font-medium text-black dark:text-white">
                Tipo de cuenta

                <select
                  value={
                    settings.bank_account_type ??
                    ""
                  }
                  disabled={saving}
                  onChange={(event) =>
                    void update({
                      bank_account_type:
                        event.target.value ===
                        "checking"
                          ? "checking"
                          : event.target.value ===
                              "savings"
                            ? "savings"
                            : null,
                    })
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                >
                  <option value="">
                    Selecciona...
                  </option>

                  <option value="checking">
                    Corriente
                  </option>

                  <option value="savings">
                    Ahorros
                  </option>
                </select>
              </label>

              <label className="text-sm font-medium text-black dark:text-white">
                Número de cuenta

                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    settings.bank_account_number ??
                    ""
                  }
                  disabled={saving}
                  onChange={(event) =>
                    void update({
                      bank_account_number:
                        event.target.value,
                    })
                  }
                  placeholder="Número de cuenta"
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <label className="text-sm font-medium text-black dark:text-white">
                Titular de la cuenta

                <input
                  type="text"
                  value={
                    settings.bank_account_holder ??
                    ""
                  }
                  disabled={saving}
                  onChange={(event) =>
                    void update({
                      bank_account_holder:
                        event.target.value,
                    })
                  }
                  placeholder="Nombre del titular"
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <label className="text-sm font-medium text-black dark:text-white sm:col-span-2">
                Documento / NIT del titular

                <input
                  type="text"
                  value={
                    settings.bank_account_document ??
                    ""
                  }
                  disabled={saving}
                  onChange={(event) =>
                    void update({
                      bank_account_document:
                        event.target.value,
                    })
                  }
                  placeholder="Documento o NIT"
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <label className="text-sm font-medium text-black dark:text-white sm:col-span-2">
                Instrucciones de consignación

                <textarea
                  value={
                    settings.transfer_instructions ??
                    ""
                  }
                  disabled={saving}
                  onChange={(event) =>
                    void update({
                      transfer_instructions:
                        event.target.value,
                    })
                  }
                  placeholder="Indica qué debe hacer el cliente y cómo enviar el comprobante."
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-black outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <div className="sm:col-span-2">
                <div className="text-sm font-medium text-black dark:text-white">
                  Código QR
                </div>

                <div className="mt-2 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                  {settings.qr_image_url ? (
                    <div className="mb-4 flex items-center gap-4">
                      <img
                        src={
                          settings.qr_image_url
                        }
                        alt="Código QR para pagos de anticipo"
                        className="h-32 w-32 rounded-xl border border-black/10 bg-white object-contain p-2 dark:border-white/10"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black dark:text-white">
                          QR configurado
                        </p>

                        <p className="mt-1 break-all text-xs text-black/40 dark:text-white/40">
                          {
                            settings.qr_image_url
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-4 text-sm text-black/50 dark:text-white/50">
                      Todavía no has cargado el
                      QR.
                    </p>
                  )}

                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-white/90">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      disabled={saving}
                      onChange={async (
                        event,
                      ) => {
                        const file =
                          event.target.files?.[0];

                        if (!file) {
                          return;
                        }

                        setSaving(true);
                        setError(null);

                        try {
                          const formData =
                            new FormData();

                          formData.append(
                            "file",
                            file,
                          );

                          formData.append(
                            "restaurantId",
                            restaurantId,
                          );

                          const response =
                            await fetch(
                              "/api/reservations/deposit/upload-qr",
                              {
                                method:
                                  "POST",
                                body: formData,
                              },
                            );

                          const result =
                            await response.json();

                          if (
                            !response.ok ||
                            !result?.success ||
                            !result?.url
                          ) {
                            throw new Error(
                              result?.message ??
                                "No pudimos subir el QR.",
                            );
                          }

                          const updated =
                            await update({
                              qr_image_url:
                                result.url,
                            });

                          if (updated) {
                            setSettings(
                              updated,
                            );
                          }
                        } catch (caught) {
                          setError(
                            caught instanceof
                              Error
                              ? caught.message
                              : "No pudimos subir el QR.",
                          );
                        } finally {
                          setSaving(false);
                          event.target.value =
                            "";
                        }
                      }}
                    />

                    {saving
                      ? "Subiendo..."
                      : "Subir imagen QR"}
                  </label>

                  <p className="mt-2 text-xs text-black/40 dark:text-white/40">
                    PNG, JPG/JPEG o WebP. Máximo 5
                    MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="border-t border-black/10 pt-3 dark:border-white/10">
          <ReservationSettingsRow
            label="Solicitar anticipo"
            description={
              settings.enabled
                ? `El cliente deberá pagar mediante consignación bancaria / QR $${settings.amount.toFixed(2)} ${settings.currency}.`
                : "Las reservas continúan funcionando exactamente como antes."
            }
          >
            <button
              type="button"
              role="switch"
              aria-checked={
                settings.enabled
              }
              disabled={
                saving || !canEnable
              }
              onClick={() =>
                void update({
                  enabled:
                    !settings.enabled,
                  allow_cash: false,
                })
              }
              className={[
                "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1",
                "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                settings.enabled
                  ? "bg-black dark:bg-white"
                  : "bg-black/15 dark:bg-white/15",
              ].join(" ")}
            >
              <span
                className={[
                  "block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                  settings.enabled
                    ? "translate-x-5 dark:bg-black"
                    : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </ReservationSettingsRow>
        </div>

        <p className="text-xs leading-5 text-black/40 dark:text-white/40">
          Para activar el anticipo necesitas un
          monto mayor que 0 y tener activa la
          consignación bancaria / QR.
        </p>
      </div>
    </ReservationSettingsSection>
  );
}