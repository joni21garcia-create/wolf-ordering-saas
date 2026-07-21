"use client";

import type {
  ReservationStatus,
} from "@/types/reservations";

import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";



interface ReservationTableStatusProps {

  status: ReservationStatus;

}



export function ReservationTableStatus({

  status,

}:ReservationTableStatusProps){


  return (

    <span

      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-medium

        ${
          RESERVATION_STATUS_COLORS[
            status
          ]
        }
      `}

    >

      {
        RESERVATION_STATUS_LABELS[
          status
        ]
      }

    </span>

  );

}

