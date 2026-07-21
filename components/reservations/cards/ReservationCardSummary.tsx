"use client";

import type {
  Reservation,
} from "@/types/reservations";



interface ReservationCardSummaryProps {

  reservation: Reservation;

}



export function ReservationCardSummary({

  reservation,

}:ReservationCardSummaryProps){



  const services =
    reservation.services ?? [];



  return (

    <div
      className="
        flex
        flex-col
        gap-3
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

        Resumen

      </span>





      <div
        className="
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
              text-gray-400
            "
          >
            Servicios
          </span>


          <span
            className="
              font-medium
              text-gray-900
            "
          >

            {
              services.length
            }

          </span>


        </div>







        <div>

          <span
            className="
              block
              text-gray-400
            "
          >
            Código
          </span>


          <span
            className="
              font-medium
              text-gray-900
            "
          >

            {
              reservation.confirmationCode
            }

          </span>


        </div>





      </div>







      {
        reservation.customerNotes
        &&
        (

          <div
            className="
              rounded-md
              bg-gray-50
              p-3
              text-sm
              text-gray-600
            "
          >

            <span
              className="
                font-medium
                text-gray-800
              "
            >

              Nota:
              
            </span>


            {" "}

            {
              reservation.customerNotes
            }


          </div>

        )
      }





    </div>

  );

}

