"use client";

import type {
  Reservation,
} from "@/types/reservations";

import {
  ReservationStatus,
} from "@/types/reservations";

import {
  confirmReservation,
  cancelReservation,
  checkinReservation,
} from "@/modules/reservations/actions";



interface ReservationTableActionsProps {

  reservation: Reservation;

  onRefresh?:()=>void;

}



export function ReservationTableActions({

  reservation,

  onRefresh,

}:ReservationTableActionsProps){



 async function handleConfirm(){

  await confirmReservation(
    reservation.id
  );

  onRefresh?.();

 }



 async function handleCancel(){

  await cancelReservation(
    reservation.id
  );

  onRefresh?.();

 }



 async function handleCheckin(){

  await checkinReservation(
    reservation.id
  );

  onRefresh?.();

 }




 const status =
  reservation.status;



 return (

  <div
    className="
      flex
      justify-center
      gap-2
    "
  >



    {
      status === ReservationStatus.PENDING && (

        <button

          type="button"

          onClick={
            handleConfirm
          }

          className="
            rounded-md
            bg-green-600
            px-3
            py-1
            text-xs
            font-medium
            text-white
            hover:bg-green-700
          "

        >

          Confirmar

        </button>

      )
    }






    {
      status === ReservationStatus.CONFIRMED && (

        <button

          type="button"

          onClick={
            handleCheckin
          }

          className="
            rounded-md
            bg-blue-600
            px-3
            py-1
            text-xs
            font-medium
            text-white
            hover:bg-blue-700
          "

        >

          Check-in

        </button>

      )
    }






    {
      status !== ReservationStatus.CANCELLED &&
      status !== ReservationStatus.COMPLETED &&
      status !== ReservationStatus.NO_SHOW && (

        <button

          type="button"

          onClick={
            handleCancel
          }

          className="
            rounded-md
            bg-red-600
            px-3
            py-1
            text-xs
            font-medium
            text-white
            hover:bg-red-700
          "

        >

          Cancelar

        </button>

      )
    }




  </div>

 );

}

