"use client";

import type {
  ReservationCalendarEvent,
} from "@/types/reservations";

import {
  ReservationCalendarDay,
} from "./ReservationCalendarDay";



interface ReservationCalendarMonthProps {


  days:{
    date:string;

    events:ReservationCalendarEvent[];

  }[];


  onSelectReservation?:(
    reservationId:string
  )=>void;


}



export function ReservationCalendarMonth({

  days,

  onSelectReservation,

}:ReservationCalendarMonthProps){



  return (

    <div
      className="
        grid
        grid-cols-1
        gap-3

        sm:grid-cols-2

        lg:grid-cols-7
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

