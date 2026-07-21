"use client";

import {
  ReservationStatus,
} from "@/types/reservations";

import type {
  Reservation,
} from "@/types/reservations";

import {
  confirmReservation,
  cancelReservation,
  checkinReservation,
} from "@/modules/reservations/actions";



interface ReservationCardActionsProps {

  reservation: Reservation;

  onRefresh?:()=>void;

}



export function ReservationCardActions({

  reservation,

  onRefresh,

}:ReservationCardActionsProps){





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





 return (

  <div
    className="
      flex
      flex-wrap
      gap-2
    "
  >





    {
      reservation.status === ReservationStatus.PENDING
      &&
      (

        <button

          type="button"

          onClick={
            handleConfirm
          }

          className="
            rounded-md
            bg-green-600
            px-3
            py-2
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
      reservation.status === ReservationStatus.CONFIRMED
      &&
      (

        <button

          type="button"

          onClick={
            handleCheckin
          }

          className="
            rounded-md
            bg-blue-600
            px-3
            py-2
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
      reservation.status !== ReservationStatus.CANCELLED
      &&
      reservation.status !== ReservationStatus.COMPLETED
      &&
      reservation.status !== ReservationStatus.NO_SHOW
      &&
      (

        <button

          type="button"

          onClick={
            handleCancel
          }

          className="
            rounded-md
            bg-red-600
            px-3
            py-2
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

