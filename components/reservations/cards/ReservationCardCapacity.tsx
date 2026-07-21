"use client";


interface ReservationCardCapacityProps {

  guests:number;

  adults?:number;

  children?:number;

  babies?:number;

}



export function ReservationCardCapacity({

  guests,

  adults,

  children,

  babies,

}:ReservationCardCapacityProps){



  return (

    <div
      className="
        flex
        flex-col
        gap-1
      "
    >



      <span
        className="
          text-xs
          font-medium
          uppercase
          text-gray-400
        "
      >

        Capacidad

      </span>





      <span
        className="
          font-semibold
          text-gray-900
        "
      >

        {guests}

        {" "}

        personas

      </span>





      {
        (
          adults !== undefined ||
          children !== undefined ||
          babies !== undefined
        )
        &&
        (

          <div
            className="
              text-sm
              text-gray-500
            "
          >

            {
              adults !== undefined &&
              `${adults} adultos`
            }


            {
              children !== undefined &&
              ` · ${children} niños`
            }


            {
              babies !== undefined &&
              ` · ${babies} bebés`
            }


          </div>

        )
      }





    </div>

  );

}

