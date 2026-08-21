"use client";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations/reservation-status";

import { ReservationStatus } from "@/types/reservations";

import { ReservationActions } from "./reservation-actions";

interface ReservationCardProps {
  reservation: {
    id: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    confirmation_code?: string | null;
    reservation_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    guests?: number | null;
    status: ReservationStatus | string;
    restaurant_table_assignments?: Array<{
      is_primary?: boolean;
      restaurant_tables?: {
        code?: string | null;
        name?: string | null;
        capacity?: number | null;
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
      month: "short",
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

export function ReservationCard({
  reservation,
  onRefresh,
}: ReservationCardProps) {
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

  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {reservation.customer_name ||
              "Sin nombre"}
          </h3>

          {reservation.confirmation_code ? (
            <p className="mt-1 text-xs text-gray-400">
              {reservation.confirmation_code}
            </p>
          ) : null}
        </div>

        <span
          className={`
            whitespace-nowrap
            rounded-full
            border
            px-3
            py-1
            text-xs
            font-semibold
            ${
              RESERVATION_STATUS_COLORS[
                status
              ] ??
              "border-gray-200 bg-gray-50 text-gray-600"
            }
          `}
        >
          {
            RESERVATION_STATUS_LABELS[
              status
            ] ??
            reservation.status
          }
        </span>
      </div>

      <div
        className="
          mt-5
          grid
          gap-3
          text-sm
        "
      >
        <div className="flex justify-between">
          <span className="text-gray-500">
            Fecha
          </span>

          <span className="font-medium text-gray-900">
            {formatDate(
              reservation.reservation_date
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Hora
          </span>

          <span className="font-medium text-gray-900">
            {formatTime(
              reservation.start_time
            )}
            {" - "}
            {formatTime(
              reservation.end_time
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Personas
          </span>

          <span className="font-medium text-gray-900">
            {reservation.guests ?? 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Mesa
          </span>

          <span className="font-medium text-gray-900">
            {table?.code ||
              table?.name ||
              "Sin asignar"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Teléfono
          </span>

          <span className="font-medium text-gray-900">
            {reservation.customer_phone ||
              "-"}
          </span>
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        <ReservationActions
          reservationId={
            reservation.id
          }
          status={status}
          onUpdated={
            onRefresh
          }
        />
      </div>
    </div>
  );
}