"use client";

import type {
  Reservation,
} from "@/types/reservations";

import {
  ReservationTableHeader,
} from "./ReservationTableHeader";

import {
  ReservationTableRow,
} from "./ReservationTableRow";

interface ReservationTableProps {

  reservations: Reservation[];

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

      <div
        className="
          rounded-lg
          border
          bg-white
          p-8
          text-center
          text-gray-500
        "
      >

        Cargando reservas...

      </div>

    );

  }





  if (!reservations.length) {

    return (

      <div
        className="
          rounded-lg
          border
          bg-white
          p-8
          text-center
          text-gray-500
        "
      >

        No existen reservas registradas.

      </div>

    );

  }






  return (

    <div
      className="
        overflow-hidden
        rounded-lg
        border
        bg-white
      "
    >


      <table
        className="
          min-w-full
          divide-y
        "
      >


        <ReservationTableHeader />



        <tbody
          className="
            divide-y
          "
        >


          {
            reservations.map(

              reservation => (

                <ReservationTableRow

                  key={
                    reservation.id
                  }

                  reservation={
                    reservation
                  }

                  onRefresh={
                    onRefresh
                  }

                />

              )

            )
          }


        </tbody>


      </table>


    </div>

  );

}

