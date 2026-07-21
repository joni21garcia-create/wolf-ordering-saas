"use client";

import type {
  ReservationStatus,
} from "@/types/reservations";



interface ReservationStatusDialogProps {

  status:ReservationStatus;

  open:boolean;

  onClose:()=>void;

}



const statusLabels = {

  pending:
    "Pendiente",

  confirmed:
    "Confirmada",

  checked_in:
    "Cliente llegó",

  completed:
    "Completada",

  cancelled:
    "Cancelada",

  no_show:
    "No asistió",

};





export function ReservationStatusDialog({

  status,

  open,

  onClose,

}:ReservationStatusDialogProps){



  if(!open){

    return null;

  }






  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
    >



      <div
        className="
          w-full
          max-w-sm
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "
      >



        <h2
          className="
            text-lg
            font-semibold
            text-gray-900
          "
        >

          Estado de reserva

        </h2>






        <div
          className="
            mt-5
            rounded-lg
            bg-gray-50
            p-4
            text-center
          "
        >


          <span
            className="
              text-sm
              text-gray-500
            "
          >

            Estado actual

          </span>





          <p
            className="
              mt-1
              text-lg
              font-semibold
              text-gray-900
            "
          >

            {
              statusLabels[
                status as keyof typeof statusLabels
              ]
              ??
              status
            }

          </p>



        </div>







        <div
          className="
            mt-6
            flex
            justify-end
          "
        >



          <button

            type="button"

            onClick={
              onClose
            }

            className="
              rounded-md
              border
              px-4
              py-2
              text-sm
              hover:bg-gray-50
            "

          >

            Cerrar

          </button>





        </div>




      </div>


    </div>

  );

}

