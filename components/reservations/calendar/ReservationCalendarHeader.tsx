"use client";


interface ReservationCalendarHeaderProps {

  date:string;

  onDateChange?:(
    date:string
  )=>void;

}



export function ReservationCalendarHeader({

  date,

  onDateChange,

}:ReservationCalendarHeaderProps){



  function changeDate(
    days:number
  ){


    const current =
      new Date(
        date
      );


    current.setDate(
      current.getDate() + days
    );


    const next =
      current
        .toISOString()
        .split("T")[0];


    onDateChange?.(
      next
    );


  }





  return (

    <div
      className="
        flex
        items-center
        justify-between
        border-b
        bg-white
        p-4
      "
    >



      <button

        type="button"

        onClick={() =>
          changeDate(-1)
        }

        className="
          rounded-md
          border
          px-3
          py-2
          text-sm
          hover:bg-gray-50
        "

      >

        ← Anterior

      </button>







      <div
        className="
          text-center
        "
      >

        <h2
          className="
            text-lg
            font-semibold
            text-gray-900
          "
        >

          Calendario de reservas

        </h2>



        <p
          className="
            text-sm
            text-gray-500
          "
        >

          {date}

        </p>


      </div>








      <button

        type="button"

        onClick={() =>
          changeDate(1)
        }

        className="
          rounded-md
          border
          px-3
          py-2
          text-sm
          hover:bg-gray-50
        "

      >

        Siguiente →

      </button>





    </div>

  );

}

