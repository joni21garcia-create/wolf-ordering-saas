"use client";

import type {
  ReservationCalendarEvent,
} from "@/types/reservations";



interface ReservationCalendarGridProps {

  events: ReservationCalendarEvent[];

  onSelectReservation?:(
    reservationId:string
  )=>void;

}



export function ReservationCalendarGrid({

  events,

  onSelectReservation,

}:ReservationCalendarGridProps){



  return (

    <div
      className="
        grid
        gap-3
        p-4
      "
    >



      {
        events.length === 0
        ?

        (

          <div
            className="
              rounded-lg
              border
              border-dashed
              p-8
              text-center
              text-sm
              text-gray-500
            "
          >

            No hay reservas para este día.

          </div>

        )

        :

        (

          events.map(

            event => (

              <button

                key={
                  event.id
                }


                type="button"


                onClick={() =>
                  onSelectReservation?.(
                    event.reservationId
                  )
                }


                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  bg-white
                  p-4
                  text-left
                  transition
                  hover:bg-gray-50
                "

              >



                <div>

                  <h3
                    className="
                      font-semibold
                      text-gray-900
                    "
                  >

                    {event.title}

                  </h3>



                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >

                    {event.start}

                    {" - "}

                    {event.end}

                  </p>




                </div>






                <div
                  className="
                    text-right
                  "
                >


                  <span
                    className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >

                    {event.guests}

                    {" "}

                    personas

                  </span>



                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >

                    {event.status}

                  </span>



                </div>





              </button>

            )

          )

        )

      }



    </div>

  );

}

