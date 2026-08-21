"use client";

import type { Reservation } from "@/types/reservations";

import { ReservationTableStatus } from "./ReservationTableStatus";
import { ReservationTableActions } from "./ReservationTableActions";

interface ReservationTableRowProps {
  reservation: Reservation;
  onRefresh?: () => void;
}

const RESERVATION_TYPE_LABELS: Record<string, string> = {
  table: "Mesa en restaurante",
  event: "Evento especial",
  private: "Área privada",
};

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : "--:--";
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
}

function getReservationType(reservation: Reservation) {
  return (
    reservation.typeName?.trim() ||
    RESERVATION_TYPE_LABELS[
      reservation.typeId ?? ""
    ] ||
    reservation.typeId ||
    "—"
  );
}

export function ReservationTableRow({
  reservation,
  onRefresh,
}: ReservationTableRowProps) {
  const tables =
    reservation.assignment?.tables ?? [];

  const tableNames = tables
    .map((table) => table.name || table.id)
    .filter(Boolean);

  const tableLabel =
    tableNames.length > 0
      ? tableNames.join(", ")
      : "Sin mesa";

  const guests =
    reservation.capacity?.guests ?? 0;

  const reservationType =
    getReservationType(reservation);

  const reservationService =
    reservation.serviceName?.trim() ||
    reservation.serviceId ||
    "";

  const notes =
    reservation.customerNotes?.trim() || "—";

  return (
    <tr
      className="
        border-b border-gray-100
        transition-colors
        hover:bg-gray-50
      "
    >
      {/* CLIENTE */}
      <td className="px-4 py-4">
        <div className="min-w-[180px]">
          <div className="font-medium text-gray-900">
            {reservation.guest?.fullName ||
              "Sin nombre"}
          </div>

          {reservation.guest?.phone ? (
            <div className="mt-0.5 text-sm text-gray-500">
              {reservation.guest.phone}
            </div>
          ) : null}

          {reservation.confirmationCode ? (
            <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {reservation.confirmationCode}
            </div>
          ) : null}
        </div>
      </td>

      {/* FECHA */}
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
        {formatDate(
          reservation.datetime?.date
        )}
      </td>

      {/* HORARIO */}
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
        <span className="font-medium">
          {formatTime(
            reservation.datetime?.startTime
          )}
        </span>

        <span className="mx-1 text-gray-400">
          –
        </span>

        <span>
          {formatTime(
            reservation.datetime?.endTime
          )}
        </span>
      </td>

      {/* PERSONAS */}
      <td className="px-4 py-4 text-center text-sm font-medium text-gray-700">
        {guests}
      </td>

      {/* MESA */}
      <td className="px-4 py-4 text-center">
        <div className="mx-auto max-w-[180px]">
          <div className="truncate text-sm font-semibold text-gray-800">
            {tableLabel}
          </div>

          {tables.length > 1 ? (
            <div className="mt-0.5 text-[11px] text-gray-400">
              {tables.length} mesas
            </div>
          ) : tables[0]?.zone ? (
            <div className="mt-0.5 truncate text-[11px] text-gray-400">
              {tables[0].zone}
            </div>
          ) : null}
        </div>
      </td>

      {/* TIPO DE RESERVA */}
      <td className="px-4 py-4 text-center">
        <div className="mx-auto max-w-[180px]">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-orange-200
              bg-orange-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-orange-700
            "
          >
            {reservationType}
          </span>

          {reservationService ? (
            <div className="mt-1 truncate text-[11px] font-medium text-gray-500">
              {reservationService}
            </div>
          ) : null}
        </div>
      </td>

      {/* NOTAS */}
      <td className="px-4 py-4">
        <div className="max-w-[260px]">
          {notes === "—" ? (
            <span className="text-sm text-gray-400">
              —
            </span>
          ) : (
            <span
              title={notes}
              className="
                block
                truncate
                text-sm
                text-gray-600
              "
            >
              {notes}
            </span>
          )}
        </div>
      </td>

      {/* ESTADO */}
      <td className="px-4 py-4 text-center">
        <ReservationTableStatus
          status={reservation.status}
        />
      </td>

      {/* ACCIONES */}
      <td className="px-4 py-4">
        <ReservationTableActions
          reservation={reservation}
          onRefresh={onRefresh}
        />
      </td>
    </tr>
  );
}