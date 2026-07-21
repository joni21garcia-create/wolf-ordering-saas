"use client";


interface ReservationCardDateProps {

  date:string;

  startTime:string;

  endTime:string;

}



export function ReservationCardDate({

  date,

  startTime,

  endTime,

}:ReservationCardDateProps){



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

        Fecha y horario

      </span>





      <span
        className="
          font-semibold
          text-gray-900
        "
      >

        {date}

      </span>





      <span
        className="
          text-sm
          text-gray-600
        "
      >

        {startTime}

        {" - "}

        {endTime}

      </span>



    </div>

  );

}

