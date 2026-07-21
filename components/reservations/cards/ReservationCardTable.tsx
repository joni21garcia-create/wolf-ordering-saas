"use client";


interface ReservationCardTableProps {

  table?: {

    id:string;

    code?:string;

    name?:string;

    capacity?:number;

  };

}



export function ReservationCardTable({

  table,

}:ReservationCardTableProps){



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

        Mesa asignada

      </span>





      {
        table
        ?

        (

          <>

            <span
              className="
                font-semibold
                text-gray-900
              "
            >

              {
                table.code
                ??
                table.name
                ??
                "Mesa"
              }

            </span>



            {
              table.capacity &&
              (

                <span
                  className="
                    text-sm
                    text-gray-500
                  "
                >

                  Capacidad:
                  {" "}
                  {table.capacity}

                </span>

              )
            }


          </>

        )

        :

        (

          <span
            className="
              text-sm
              text-gray-500
            "
          >

            Sin mesa asignada

          </span>

        )

      }



    </div>

  );

}

