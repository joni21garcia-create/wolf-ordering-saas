"use client";

import type {
  ReservationCalendarEvent,
} from "@/types/reservations";

import {
  ReservationCalendarDay,
} from "./ReservationCalendarDay";



interface ReservationCalendarWeekProps {

  days:{
    date:string;
    events:ReservationCalendarEvent[];
  }[];

  onSelectReservation?:(
    reservationId:string
  )=>void;

}



export function ReservationCalendarWeek({

  days,

  onSelectReservation,

}:ReservationCalendarWeekProps){



  return (

    <div
      className="
        grid
        grid-cols-1
        gap-4

        md:grid-cols-7
      "
    >



      {
        days.map(

          day => (

            <ReservationCalendarDay

              key={
                day.date
              }

              date={
                day.date
              }

              events={
                day.events
              }

              onSelectReservation={
                onSelectReservation
              }

            />

          )

        )
      }



    </div>

  );

}

