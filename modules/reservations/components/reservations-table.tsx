"use client";

import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

import { ReservationStatus } from "@/types/reservations";

import { ReservationActions } from "./reservation-actions";

interface ReservationTableReservation {
  id: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  reservation_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  guests?: number | null;
  status: ReservationStatus | string;
  confirmation_code?: string | null;
  restaurant_table_assignments?: Array<{
    id: string;
    is_primary?: boolean;
    assigned_guests?: number;
    restaurant_tables?: {
      id: string;
      code?: string | null;
      name?: string | null;
      capacity?: number | null;
    } | null;
  }>;
}

interface ReservationTableProps {
  reservations: ReservationTableReservation[];
  loading?: boolean;
  onRefresh?: () => void;
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
  }).format(date);
}

function formatTime(value?: string | null) {
  if (!value) return "-";
  return value.slice(0, 5);
}

function getReservationMeta(reservation: ReservationTableReservation) {
  const assignment =
    reservation.restaurant_table_assignments?.find(
      (item) => item.is_primary
    ) ?? reservation.restaurant_table_assignments?.[0];

  const table = assignment?.restaurant_tables;
  const status = reservation.status as ReservationStatus;

  const statusLabel =
    RESERVATION_STATUS_LABELS[status] ?? reservation.status;

  const statusColor =
    RESERVATION_STATUS_COLORS[status] ??
    "border-gray-200 bg-gray-50 text-gray-600";

  return {
    assignment,
    table,
    status,
    statusLabel,
    statusColor,
  };
}

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${className}
      `}
    >
      {label}
    </span>
  );
}

function ReservationMobileCard({
  reservation,
  onRefresh,
}: {
  reservation: ReservationTableReservation;
  onRefresh?: () => void;
}) {
  const {
    table,
    status,
    statusLabel,
    statusColor,
  } = getReservationMeta(reservation);

  const [date, time, guests] = [
    formatDate(reservation.reservation_date),
    `${formatTime(reservation.start_time)} – ${formatTime(
      reservation.end_time
    )}`,
    reservation.guests ?? 0,
  ];

  return (
    <details className="group border-b border-gray-100 last:border-b-0">
      <summary className="list-none cursor-pointer px-4 py-4 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-gray-900">
              {reservation.customer_name || "Sin nombre"}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
              <span>{time}</span>
              <span aria-hidden="true">·</span>
              <span>{guests} personas</span>
              {table ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    {table.code || table.name || "Mesa"}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge
              label={statusLabel}
              className={statusColor}
            />

            <span
              aria-hidden="true"
              className="
                flex h-7 w-7 items-center justify-center
                rounded-full border border-gray-200
                text-gray-500 transition-transform
                group-open:rotate-180
              "
            >
              ↓
            </span>
          </div>
        </div>
      </summary>

      <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Fecha
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {date}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Horario
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {time}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Personas
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {guests}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Mesa
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {table
                ? `${table.code || table.name || "Mesa"}${
                    table.capacity
                      ? ` · ${table.capacity} personas`
                      : ""
                  }`
                : "Sin asignar"}
            </p>
          </div>

          {reservation.customer_phone ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Teléfono
              </p>
              <p className="mt-1 break-all text-sm font-medium text-gray-800">
                {reservation.customer_phone}
              </p>
            </div>
          ) : null}

          {reservation.customer_email ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Email
              </p>
              <p className="mt-1 break-all text-sm font-medium text-gray-800">
                {reservation.customer_email}
              </p>
            </div>
          ) : null}

          {reservation.confirmation_code ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Código
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {reservation.confirmation_code}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
          <StatusBadge
            label={statusLabel}
            className={statusColor}
          />

          <div className="w-full sm:w-auto">
            <ReservationActions
              reservationId={reservation.id}
              status={status}
              onUpdated={onRefresh}
            />
          </div>
        </div>
      </div>
    </details>
  );
}

export function ReservationTable({
  reservations,
  loading = false,
  onRefresh,
}: ReservationTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto max-w-sm">
          <div
            className="
              mx-auto
              mb-4
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-gray-200
              border-t-gray-900
            "
          />

          <p className="font-medium">Cargando reservas...</p>

          <p className="mt-1 text-sm text-gray-500">
            Estamos actualizando la agenda.
          </p>
        </div>
      </div>
    );
  }

  if (!reservations.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div
          className="
            mx-auto
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-gray-100
            text-xl
          "
        >
          —
        </div>

        <h3 className="mt-4 font-semibold">No hay reservas</h3>

        <p className="mt-1 text-sm text-gray-500">
          No encontramos reservas con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* ================================================================
       * MOBILE
       * ============================================================ */}
      <div className="block md:hidden">
        <div className="border-b bg-gray-50/80 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Reservas
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Toca una reserva para ver todos sus datos.
              </p>
            </div>

            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200">
              {reservations.length}
            </span>
          </div>
        </div>

        <div>
          {reservations.map((reservation) => (
            <ReservationMobileCard
              key={reservation.id}
              reservation={reservation}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      </div>

      {/* ================================================================
       * DESKTOP / TABLET
       * ============================================================ */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[920px] w-full">
          <thead className="border-b bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cliente
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Fecha
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Horario
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Personas
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mesa
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Estado
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {reservations.map((reservation) => {
              const {
                table,
                status,
                statusLabel,
                statusColor,
              } = getReservationMeta(reservation);

              return (
                <tr
                  key={reservation.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-4 py-4">
                    <div className="min-w-[190px]">
                      <div className="font-semibold text-gray-900">
                        {reservation.customer_name || "Sin nombre"}
                      </div>

                      {reservation.customer_phone ? (
                        <div className="mt-1 text-sm text-gray-500">
                          {reservation.customer_phone}
                        </div>
                      ) : reservation.customer_email ? (
                        <div className="mt-1 text-sm text-gray-500">
                          {reservation.customer_email}
                        </div>
                      ) : null}

                      {reservation.confirmation_code ? (
                        <div className="mt-1 text-xs text-gray-400">
                          {reservation.confirmation_code}
                        </div>
                      ) : null}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {formatDate(reservation.reservation_date)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                    {formatTime(reservation.start_time)}
                    {" – "}
                    {formatTime(reservation.end_time)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-gray-900">
                      {reservation.guests ?? 0}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {table ? (
                      <div className="inline-flex flex-col items-center">
                        <span className="font-semibold text-gray-900">
                          {table.code || table.name || "-"}
                        </span>

                        {table.capacity ? (
                          <span className="text-xs text-gray-400">
                            {table.capacity} personas
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Sin asignar
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <StatusBadge
                      label={statusLabel}
                      className={statusColor}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <ReservationActions
                        reservationId={reservation.id}
                        status={status}
                        onUpdated={onRefresh}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t bg-gray-50/60 px-4 py-3 text-xs text-gray-500">
        {reservations.length === 1
          ? "1 reserva"
          : `${reservations.length} reservas`}
      </div>
    </div>
  );
}