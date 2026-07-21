"use client";

import type {
  ReservationGuest,
} from "@/types/reservations";



interface ReservationCardGuestProps {

  guest: ReservationGuest;

}



export function ReservationCardGuest({

  guest,

}:ReservationCardGuestProps){



  return (

    <div
      className="
        flex
        flex-col
        gap-1
      "
    >


      <span
        className="
          text-xs
          font-medium
          uppercase
          text-gray-400
        "
      >

        Cliente

      </span>




      <span
        className="
          font-semibold
          text-gray-900
        "
      >

        {guest.fullName}

      </span>




      {
        guest.phone && (

          <span
            className="
              text-sm
              text-gray-600
            "
          >

            {guest.phone}

          </span>

        )
      }






      {
        guest.email && (

          <span
            className="
              text-sm
              text-gray-500
            "
          >

            {guest.email}

          </span>

        )
      }





    </div>

  );

}

