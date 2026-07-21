"use client";

import type {
  ReservationCalendarEvent as ReservationEventType,
} from "@/types/reservations";



interface ReservationCalendarEventProps {

  event: ReservationEventType;

  onClick?:(
    reservationId:string
  )=>void;

}



export function ReservationCalendarEvent({

  event,

  onClick,

}:ReservationCalendarEventProps){



  return (

    <button

      type="button"

      onClick={() =>
        onClick?.(
          event.reservationId
        )
      }

      className="
        w-full
        rounded-md
        border
        bg-white
        p-3
        text-left
        transition
        hover:bg-gray-50
      "

    >



      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >


        <span
          className="
            font-medium
            text-gray-900
          "
        >

          {event.title}

        </span>



        <span
          className="
            text-xs
            text-gray-500
          "
        >

          {event.status}

        </span>



      </div>





      <div
        className="
          mt-2
          text-sm
          text-gray-600
        "
      >

        {event.start}

        {" - "}

        {event.end}

      </div>





      <div
        className="
          mt-1
          text-xs
          text-gray-500
        "
      >

        {event.guests}

        {" personas"}

      </div>



    </button>

  );

}

