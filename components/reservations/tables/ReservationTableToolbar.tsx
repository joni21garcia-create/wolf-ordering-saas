"use client";

interface ReservationTableToolbarProps {

  total:number;

  onCreate?:()=>void;

}



export function ReservationTableToolbar({

  total,

  onCreate,

}:ReservationTableToolbarProps){


  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-t-lg
        border
        border-b-0
        bg-white
        p-4
      "
    >


      <div>

        <h2
          className="
            text-lg
            font-semibold
            text-gray-900
          "
        >
          Reservas
        </h2>


        <p
          className="
            text-sm
            text-gray-500
          "
        >
          {total} reservas registradas
        </p>


      </div>





      {
        onCreate && (

          <button

            type="button"

            onClick={
              onCreate
            }

            className="
              rounded-md
              bg-black
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-gray-800
            "

          >

            Nueva reserva

          </button>

        )
      }



    </div>

  );

}

