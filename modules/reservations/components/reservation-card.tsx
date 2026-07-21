"use client";

import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_COLORS,
} from "@/constants/reservations/reservation-status";

import { ReservationStatus } from "@/types/reservations";

import { ReservationActions } from "./reservation-actions";


interface ReservationCardProps {

  reservation:any;

  onRefresh?:()=>void;

}



export function ReservationCard({

  reservation,

  onRefresh,

}:ReservationCardProps){


 const assignment =
  reservation.restaurant_table_assignments?.[0];


 const table =
  assignment?.restaurant_tables;



 return (

  <div
   className="
    rounded-lg
    border
    bg-white
    p-5
    space-y-4
   "
  >



   <div
    className="
     flex
     items-start
     justify-between
    "
   >


    <div>

     <h3
      className="
       font-semibold
       text-lg
      "
     >
      {reservation.customer_name}
     </h3>


     <p
      className="
       text-sm
       text-gray-500
      "
     >
      {reservation.confirmation_code}
     </p>


    </div>



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



   </div>





   <div
    className="
     space-y-2
     text-sm
    "
   >


    <p>

     <strong>
      Fecha:
     </strong>

     {" "}

     {reservation.reservation_date}

    </p>



    <p>

     <strong>
      Hora:
     </strong>

     {" "}

     {reservation.start_time}

     {" - "}

     {reservation.end_time}

    </p>




    <p>

     <strong>
      Personas:
     </strong>

     {" "}

     {reservation.guests}

    </p>





    <p>

     <strong>
      Mesa:
     </strong>

     {" "}

     {table?.code ?? "-"}

    </p>




    <p>

     <strong>
      Teléfono:
     </strong>

     {" "}

     {reservation.customer_phone}

    </p>



   </div>





   <div
    className="
     border-t
     pt-4
    "
   >


    <ReservationActions

     reservationId={
      reservation.id
     }

     onUpdated={
      onRefresh
     }

    />


   </div>




  </div>


 );


}


