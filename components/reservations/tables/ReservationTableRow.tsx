"use client";

import type {
  Reservation,
} from "@/types/reservations";

import {
  ReservationTableStatus,
} from "./ReservationTableStatus";

import {
  ReservationTableActions,
} from "./ReservationTableActions";


interface ReservationTableRowProps {

  reservation: Reservation;

  onRefresh?:()=>void;

}




export function ReservationTableRow({

  reservation,

  onRefresh,

}:ReservationTableRowProps){



  const assignment =
    (reservation as any)
      .restaurant_table_assignments?.[0];



  const table =
    assignment?.restaurant_tables;



  return (

    <tr
      className="
        hover:bg-gray-50
      "
    >


      <td
        className="
          px-4
          py-4
        "
      >

        <div
          className="
            font-medium
            text-gray-900
          "
        >

          {
            (reservation as any)
              .customer_name
            ??
            reservation.guest.fullName
          }

        </div>


        <div
          className="
            text-sm
            text-gray-500
          "
        >

          {
            (reservation as any)
              .customer_phone
            ??
            reservation.guest.phone
          }

        </div>


      </td>






      <td
        className="
          px-4
          py-4
          text-sm
        "
      >

        {
          (reservation as any)
            .reservation_date
          ??
          reservation.datetime.date
        }

      </td>






      <td
        className="
          px-4
          py-4
          text-sm
        "
      >

        {
          (reservation as any)
            .start_time
          ??
          reservation.datetime.startTime
        }


        {" - "}


        {
          (reservation as any)
            .end_time
          ??
          reservation.datetime.endTime
        }


      </td>







      <td
        className="
          px-4
          py-4
          text-center
        "
      >

        {
          (reservation as any)
            .guests
          ??
          reservation.capacity.guests
        }

      </td>






      <td
        className="
          px-4
          py-4
          text-center
        "
      >

        {
          table?.code
          ??
          table?.name
          ??
          "-"
        }

      </td>







      <td
        className="
          px-4
          py-4
          text-center
        "
      >

        <ReservationTableStatus

          status={
            reservation.status
          }

        />

      </td>








      <td
        className="
          px-4
          py-4
        "
      >

        <ReservationTableActions

          reservation={
            reservation
          }

          onRefresh={
            onRefresh
          }

        />

      </td>






    </tr>

  );

}

