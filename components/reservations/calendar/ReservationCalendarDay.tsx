"use client";

import type {
  ReservationCalendarEvent,
} from "@/types/reservations";

import {
  ReservationCalendarEvent as CalendarEvent,
} from "./ReservationCalendarEvent";



interface ReservationCalendarDayProps {

  date:string;

  events:ReservationCalendarEvent[];

  onSelectReservation?:(
    reservationId:string
  )=>void;

}



export function ReservationCalendarDay({

  date,

  events,

  onSelectReservation,

}:ReservationCalendarDayProps){



  return (

    <div
      className="
        flex
        min-h-[180px]
        flex-col
        rounded-lg
        border
        bg-white
        p-3
      "
    >



      <div
        className="
          mb-3
          border-b
          pb-2
        "
      >

        <span
          className="
            text-sm
            font-semibold
            text-gray-900
          "
        >

          {date}

        </span>


      </div>






      <div
        className="
          flex
          flex-col
          gap-2
        "
      >



        {
          events.length === 0

          ?

          (

            <span
              className="
                text-xs
                text-gray-400
              "
            >

              Sin reservas

            </span>

          )

          :

          (

            events.map(

              event => (

                <CalendarEvent

                  key={
                    event.id
                  }

                  event={
                    event
                  }

                  onClick={
                    onSelectReservation
                  }

                />

              )

            )

          )

        }



      </div>



    </div>

  );

}

