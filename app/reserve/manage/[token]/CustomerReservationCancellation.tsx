"use client";

import { useEffect, useState } from "react";

type Props = {
  token: string;
};

type ReservationData = {
  id?: string;
  status?: string;
  confirmationCode?: string | null;

  guest?: {
    fullName?: string | null;
  };

  datetime?: {
    date?: string | null;
    startTime?: string | null;
    endTime?: string | null;
  };
};

type ApiResponse = {
  success: boolean;
  message?: string;

  reservation?: ReservationData;

  cancellation?: {
    allowed: boolean;
    reason?: string;
    deadline?: string;
  };
};

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function formatTime(
  value?: string | null,
) {
  return value
    ? value.slice(0, 5)
    : "—";
}

export default function CustomerReservationCancellation({
  token,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [cancelling, setCancelling] =
    useState(false);

  const [cancelled, setCancelled] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [data, setData] =
    useState<ApiResponse | null>(
      null,
    );

  useEffect(() => {
    let disposed = false;

    async function loadReservation() {
      try {
        const response =
          await fetch(
            `/api/reservations/customer-cancel/${encodeURIComponent(token)}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        const result =
          (await response.json()) as ApiResponse;

        if (disposed) {
          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "No pudimos cargar la reserva.",
          );
        }

        setData(result);
      } catch (caught) {
        if (!disposed) {
          setError(
            caught instanceof Error
              ? caught.message
              : "No pudimos cargar la reserva.",
          );
        }
      } finally {
        if (!disposed) {
          setLoading(false);
        }
      }
    }

    void loadReservation();

    return () => {
      disposed = true;
    };
  }, [token]);

  async function handleCancel() {
    const confirmed =
      window.confirm(
        "¿Estás seguro de que quieres cancelar esta reserva?",
      );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      const response =
        await fetch(
          `/api/reservations/customer-cancel/${encodeURIComponent(token)}`,
          {
            method: "POST",
          },
        );

      const result =
        (await response.json()) as ApiResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "No pudimos cancelar la reserva.",
        );
      }

      setCancelled(true);

      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          cancellation: {
            allowed: false,
          },
          reservation:
            current.reservation
              ? {
                  ...current.reservation,
                  status:
                    "cancelled",
                }
              : current.reservation,
        };
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No pudimos cancelar la reserva.",
      );
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 text-black">
        <div className="mx-auto max-w-lg rounded-3xl border border-black/10 p-7">
          <p className="text-sm text-black/50">
            Cargando tu reserva...
          </p>
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 text-black">
        <div className="mx-auto max-w-lg rounded-3xl border border-red-500/20 bg-red-500/5 p-7">
          <h1 className="text-xl font-semibold">
            Enlace no disponible
          </h1>

          <p className="mt-3 text-sm text-black/60">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const reservation =
    data?.reservation;

  if (
    cancelled ||
    reservation?.status ===
      "cancelled"
  ) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 text-black">
        <div className="mx-auto max-w-lg rounded-3xl border border-black/10 p-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Reserva cancelada
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/60">
            Tu reserva fue cancelada
            correctamente.
          </p>
        </div>
      </main>
    );
  }

  const cancellation =
    data?.cancellation;

  const canCancel =
    cancellation?.allowed === true;

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-black">
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-black/10 p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
            Wolf Ordering
          </p>

          <h1 className="mt-3 text-2xl font-semibold">
            Gestionar mi reserva
          </h1>

          <div className="mt-6 space-y-4 rounded-2xl bg-black/[0.03] p-5">
            <div>
              <p className="text-xs text-black/40">
                Cliente
              </p>

              <p className="mt-1 text-sm font-medium">
                {reservation?.guest
                  ?.fullName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-black/40">
                Fecha
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(
                  reservation
                    ?.datetime?.date,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-black/40">
                Hora
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatTime(
                  reservation
                    ?.datetime?.startTime,
                )}
              </p>
            </div>

            {reservation
              ?.confirmationCode ? (
              <div>
                <p className="text-xs text-black/40">
                  Código de confirmación
                </p>

                <p className="mt-1 text-sm font-medium">
                  {
                    reservation.confirmationCode
                  }
                </p>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {canCancel ? (
            <div className="mt-7">
              <p className="text-sm leading-6 text-black/60">
                Esta reserva puede ser cancelada
                porque todavía estás dentro del
                plazo permitido por el restaurante.
              </p>

              <button
                type="button"
                disabled={cancelling}
                onClick={() =>
                  void handleCancel()
                }
                className="mt-5 w-full rounded-2xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling
                  ? "Cancelando..."
                  : "Cancelar mi reserva"}
              </button>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <p className="text-sm font-semibold">
                Esta reserva ya no puede
                ser cancelada
              </p>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {cancellation?.reason ===
                "disabled"
                  ? "El restaurante no permite cancelaciones."
                  : cancellation?.reason ===
                      "invalid_configuration"
                    ? "El restaurante tiene una configuración de cancelación inválida."
                    : cancellation?.reason ===
                        "deadline_passed"
                      ? "El plazo permitido para cancelar esta reserva ya venció."
                      : "La reserva no puede cancelarse en su estado actual."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}