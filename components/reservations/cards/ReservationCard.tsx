"use client";

import type {
  Reservation,
} from "@/types/reservations";

import {
  ReservationStatus,
} from "@/types/reservations";

import {
  ReservationTableStatus,
} from "../tables";



interface ReservationCardProps {

  reservation: Reservation;

  onClick?:(
    reservation: Reservation
  )=>void;

}



export function ReservationCard({

  reservation,

  onClick,

}:ReservationCardProps){



  const guestName =
    (reservation as any).customer_name
    ??
    reservation.guest.fullName;



  const guests =
    (reservation as any).guests
    ??
    reservation.capacity.guests;



  const date =
    (reservation as any).reservation_date
    ??
    reservation.datetime.date;



  const start =
    (reservation as any).start_time
    ??
    reservation.datetime.startTime;



  const end =
    (reservation as any).end_time
    ??
    reservation.datetime.endTime;




  return (

    <button

      type="button"

      onClick={() =>
        onClick?.(
          reservation
        )
      }

      className="
        w-full
        rounded-xl
        border
        bg-white
        p-5
        text-left
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
          gap-4
        "
      >


        <div>


          <h3
            className="
              font-semibold
              text-gray-900
            "
          >

            {guestName}

          </h3>



          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >

            {date}

          </p>


        </div>




        <ReservationTableStatus

          status={
            reservation.status
          }

        />


      </div>






      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
          text-sm
        "
      >



        <div>

          <span
            className="
              block
              text-xs
              text-gray-400
            "
          >
            Horario
          </span>


          <span
            className="
              font-medium
            "
          >

            {start} - {end}

          </span>


        </div>





        <div>

          <span
            className="
              block
              text-xs
              text-gray-400
            "
          >
            Personas
          </span>


          <span
            className="
              font-medium
            "
          >

            {guests}

          </span>


        </div>



      </div>







      {
        reservation.status === ReservationStatus.CONFIRMED && (

          <div
            className="
              mt-4
              rounded-md
              bg-green-50
              px-3
              py-2
              text-xs
              text-green-700
            "
          >

            Reserva confirmada

          </div>

        )
      }



    </button>

  );

}

