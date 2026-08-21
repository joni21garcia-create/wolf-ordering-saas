"use client";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations/reservation-status";

import { ReservationStatus } from "@/types/reservations";

import { ReservationActions } from "./reservation-actions";

interface ReservationDetailsProps {
  reservation: {
    id: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_email?: string | null;
    confirmation_code?: string | null;
    reservation_number?: string | null;
    reservation_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    guests?: number | null;
    status: ReservationStatus | string;
    occasion?: string | null;
    notes?: string | null;
    internal_notes?: string | null;
    timezone?: string | null;
    source?: string | null;
    restaurant_table_assignments?: Array<{
      id: string;
      is_primary?: boolean;
      assigned_guests?: number;
      assigned_at?: string;
      notes?: string | null;
      restaurant_tables?: {
        id: string;
        code?: string | null;
        name?: string | null;
        capacity?: number | null;
        area?: string | null;
      } | null;
    }>;
  };

  onRefresh?: () => void;
}

function formatDate(
  value?: string | null
) {
  if (!value) return "-";

  const date =
    new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function formatTime(
  value?: string | null
) {
  return value
    ? value.slice(0, 5)
    : "-";
}

export function ReservationDetails({
  reservation,
  onRefresh,
}: ReservationDetailsProps) {
  const assignment =
    reservation.restaurant_table_assignments?.find(
      (item) =>
        item.is_primary
    ) ??
    reservation.restaurant_table_assignments?.[0];

  const table =
    assignment?.restaurant_tables;

  const status =
    reservation.status as ReservationStatus;

  const statusLabel =
    RESERVATION_STATUS_LABELS[
      status
    ] ??
    reservation.status;

  const statusColor =
    RESERVATION_STATUS_COLORS[
      status
    ] ??
    "border-gray-200 bg-gray-50 text-gray-600";

  return (
    <div className="space-y-6">
      <section
        className="
          rounded-2xl
          border
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {reservation.reservation_number ??
                "Reserva"}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {reservation.customer_name ||
                "Sin nombre"}
            </h2>

            {reservation.confirmation_code ? (
              <p className="mt-1 text-sm text-gray-500">
                Código:{" "}
                {reservation.confirmation_code}
              </p>
            ) : null}
          </div>

          <span
            className={`
              inline-flex
              w-fit
              rounded-full
              border
              px-3
              py-1
              text-sm
              font-semibold
              ${statusColor}
            `}
          >
            {statusLabel}
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Cliente
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">
                Nombre
              </p>

              <p className="mt-0.5 font-medium text-gray-900">
                {reservation.customer_name ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Teléfono
              </p>

              <p className="mt-0.5 text-gray-700">
                {reservation.customer_phone ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Email
              </p>

              <p className="mt-0.5 break-all text-gray-700">
                {reservation.customer_email ||
                  "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Reserva
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">
                Fecha
              </p>

              <p className="mt-0.5 font-medium text-gray-900">
                {formatDate(
                  reservation.reservation_date
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Horario
              </p>

              <p className="mt-0.5 font-medium text-gray-900">
                {formatTime(
                  reservation.start_time
                )}
                {" – "}
                {formatTime(
                  reservation.end_time
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Personas
              </p>

              <p className="mt-0.5 font-medium text-gray-900">
                {reservation.guests ??
                  0}
              </p>
            </div>

            {reservation.occasion ? (
              <div>
                <p className="text-xs text-gray-400">
                  Ocasión
                </p>

                <p className="mt-0.5 font-medium text-gray-900">
                  {reservation.occasion}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Mesa
          </h3>

          {table ? (
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {table.code ||
                  table.name ||
                  "-"}
              </p>

              {table.name &&
              table.code ? (
                <p className="mt-1 text-sm text-gray-500">
                  {table.name}
                </p>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    Capacidad
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {table.capacity ??
                      "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    Personas
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {assignment?.assigned_guests ??
                      reservation.guests ??
                      "-"}
                  </p>
                </div>
              </div>

              {table.area ? (
                <p className="mt-3 text-sm text-gray-500">
                  Área: {table.area}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              Esta reserva todavía no tiene una mesa asignada.
            </div>
          )}
        </section>
      </div>

      {(reservation.notes ||
        reservation.internal_notes) ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {reservation.notes ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                Nota del cliente
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {reservation.notes}
              </p>
            </div>
          ) : null}

          {reservation.internal_notes ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                Nota interna
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {reservation.internal_notes}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 font-semibold text-gray-900">
          Acciones
        </h3>

        <ReservationActions
          reservationId={
            reservation.id
          }
          status={status}
          onUpdated={
            onRefresh
          }
        />
      </section>
    </div>
  );
}