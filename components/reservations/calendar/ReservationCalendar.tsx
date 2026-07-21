"use client";

import type {
  ReservationCalendarEvent,
} from "@/types/reservations";

import {
  ReservationCalendarHeader,
} from "./ReservationCalendarHeader";

import {
  ReservationCalendarGrid,
} from "./ReservationCalendarGrid";



interface ReservationCalendarProps {

  events: ReservationCalendarEvent[];

  date:string;

  loading?:boolean;

  onDateChange?:(
    date:string
  )=>void;


  onSelectReservation?:(
    reservationId:string
  )=>void;

}




export function ReservationCalendar({

  events,

  date,

  loading = false,

  onDateChange,

  onSelectReservation,

}:ReservationCalendarProps){



  if(loading){

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

        Cargando calendario...

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



      <ReservationCalendarHeader

        date={
          date
        }

        onDateChange={
          onDateChange
        }

      />





      <ReservationCalendarGrid

        events={
          events
        }

        onSelectReservation={
          onSelectReservation
        }

      />



    </div>

  );

}

