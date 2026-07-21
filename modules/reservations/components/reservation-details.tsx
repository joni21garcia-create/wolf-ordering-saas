"use client";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations/reservation-status";

import { ReservationStatus } from "@/types/reservations";

import { ReservationActions } from "./reservation-actions";

interface ReservationDetailsProps {
  reservation: any;

  onRefresh?: () => void;
}

export function ReservationDetails({
  reservation,
  onRefresh,
}: ReservationDetailsProps) {
  const assignment =
    reservation.restaurant_table_assignments?.[0];

  const table =
    assignment?.restaurant_tables;

  return (
    <div className="space-y-6">

      <div className="rounded-lg border bg-white p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              {reservation.customer_name}
            </h2>

            <p className="text-sm text-gray-500">
              {reservation.confirmation_code}
            </p>

          </div>

          <span
            className={`
              rounded-full
              border
              px-3
              py-1
              text-sm
              font-medium
              ${RESERVATION_STATUS_COLORS[
                reservation.status as ReservationStatus
              ]}
            `}
          >
            {
              RESERVATION_STATUS_LABELS[
                reservation.status as ReservationStatus
              ]
            }
          </span>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-lg border bg-white p-6">

          <h3 className="mb-4 font-semibold">
            Cliente
          </h3>

          <div className="space-y-2">

            <p>
              <strong>Nombre:</strong>{" "}
              {reservation.customer_name}
            </p>

            <p>
              <strong>Teléfono:</strong>{" "}
              {reservation.customer_phone}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {reservation.customer_email || "-"}
            </p>

          </div>

        </div>

        <div className="rounded-lg border bg-white p-6">

          <h3 className="mb-4 font-semibold">
            Reserva
          </h3>

          <div className="space-y-2">

            <p>
              <strong>Fecha:</strong>{" "}
              {reservation.reservation_date}
            </p>

            <p>
              <strong>Horario:</strong>{" "}
              {reservation.start_time}
              {" - "}
              {reservation.end_time}
            </p>

            <p>
              <strong>Personas:</strong>{" "}
              {reservation.guests}
            </p>

            <p>
              <strong>Mesa:</strong>{" "}
              {table?.code ?? "-"}
            </p>

          </div>

        </div>

      </div>

      <div className="rounded-lg border bg-white p-6">

        <h3 className="mb-4 font-semibold">
          Acciones
        </h3>

        <ReservationActions
          reservationId={reservation.id}
          onUpdated={onRefresh}
        />

      </div>

    </div>
  );
}


