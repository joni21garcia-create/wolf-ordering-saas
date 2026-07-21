"use client";

import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

import { ReservationStatus } from "@/types/reservations";

import { ReservationActions } from "./reservation-actions";

interface ReservationTableProps {
  reservations: any[];

  loading?: boolean;

  onRefresh?: () => void;
}

export function ReservationTable({
  reservations,
  loading = false,
  onRefresh,
}: ReservationTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Cargando reservas...
      </div>
    );
  }

  if (!reservations.length) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        No existen reservas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full">

        <thead className="border-b bg-gray-50">

          <tr>

            <th className="px-4 py-3 text-left">
              Cliente
            </th>

            <th className="px-4 py-3 text-left">
              Fecha
            </th>

            <th className="px-4 py-3 text-left">
              Horario
            </th>

            <th className="px-4 py-3 text-center">
              Personas
            </th>

            <th className="px-4 py-3 text-center">
              Mesa
            </th>

            <th className="px-4 py-3 text-center">
              Estado
            </th>

            <th className="px-4 py-3 text-center">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {reservations.map((reservation) => {

            const assignment =
              reservation.restaurant_table_assignments?.[0];

            const table =
              assignment?.restaurant_tables;

            return (

              <tr
                key={reservation.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="px-4 py-4">

                  <div className="font-medium">
                    {reservation.customer_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {reservation.customer_phone}
                  </div>

                </td>

                <td className="px-4 py-4">
                  {reservation.reservation_date}
                </td>

                <td className="px-4 py-4">

                  {reservation.start_time}

                  {" - "}

                  {reservation.end_time}

                </td>

                <td className="px-4 py-4 text-center">
                  {reservation.guests}
                </td>

                <td className="px-4 py-4 text-center">
                  {table?.code ?? "-"}
                </td>

                <td className="px-4 py-4 text-center">

                  <span
                    className={`
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        RESERVATION_STATUS_COLORS[
                          reservation.status as ReservationStatus
                        ]
                      }
                    `}
                  >
                    {
                      RESERVATION_STATUS_LABELS[
                        reservation.status as ReservationStatus
                      ]
                    }
                  </span>

                </td>

                <td className="px-4 py-4">

                  <ReservationActions
                    reservationId={
                      reservation.id
                    }
                    onUpdated={
                      onRefresh
                    }
                  />

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>
    </div>
  );
}


