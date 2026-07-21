"use client";

import type {
  Reservation,
} from "@/types/reservations";

import {
  ReservationCardGuest,
  ReservationCardDate,
  ReservationCardCapacity,
  ReservationCardTable,
  ReservationCardSummary,
} from "../cards";

import {
  ReservationCardActions,
} from "../cards/ReservationCardActions";



interface ReservationDetailsDialogProps {

  reservation?: Reservation;

  open:boolean;

  onClose:()=>void;

  onRefresh?:()=>void;

}



export function ReservationDetailsDialog({

  reservation,

  open,

  onClose,

  onRefresh,

}:ReservationDetailsDialogProps){



  if(!open || !reservation){

    return null;

  }





  const assignment =
    (reservation as any)
      .restaurant_table_assignments?.[0];



  const table =
    assignment?.restaurant_tables;




  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
    >



      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "
      >




        <div
          className="
            mb-6
            flex
            items-start
            justify-between
          "
        >


          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-gray-900
              "
            >

              Detalle de reserva

            </h2>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >

              Código:

              {" "}

              {
                reservation.confirmationCode
              }

            </p>


          </div>





          <button

            type="button"

            onClick={
              onClose
            }

            className="
              rounded-md
              px-3
              py-1
              text-gray-500
              hover:bg-gray-100
            "

          >

            ✕


          </button>



        </div>







        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >



          <ReservationCardGuest

            guest={
              reservation.guest
            }

          />




          <ReservationCardDate

            date={
              reservation.datetime.date
            }

            startTime={
              reservation.datetime.startTime
            }

            endTime={
              reservation.datetime.endTime
            }

          />




          <ReservationCardCapacity

            guests={
              reservation.capacity.guests
            }

            adults={
              reservation.capacity.adults
            }

            children={
              reservation.capacity.children
            }

            babies={
              reservation.capacity.babies
            }

          />





          <ReservationCardTable

            table={
              table
            }

          />



        </div>








        <div
          className="
            mt-6
          "
        >

          <ReservationCardSummary

            reservation={
              reservation
            }

          />

        </div>








        <div
          className="
            mt-6
            border-t
            pt-5
          "
        >


          <ReservationCardActions

            reservation={
              reservation
            }

            onRefresh={
              onRefresh
            }

          />


        </div>





      </div>


    </div>

  );

}

