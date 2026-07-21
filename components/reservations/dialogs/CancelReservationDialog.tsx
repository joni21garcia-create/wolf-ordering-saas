"use client";

import {
  useState,
} from "react";

import {
  cancelReservation,
} from "@/modules/reservations/actions";



interface CancelReservationDialogProps {

  reservationId:string;

  open:boolean;

  onClose:()=>void;

  onSuccess?:()=>void;

}



export function CancelReservationDialog({

  reservationId,

  open,

  onClose,

  onSuccess,

}:CancelReservationDialogProps){



  const [
    reason,
    setReason
  ] = useState("");



  const [
    loading,
    setLoading
  ] = useState(false);





  if(!open){

    return null;

  }





  async function handleCancel(){


    try{


      setLoading(true);



      await cancelReservation(reservationId);



      onSuccess?.();



      onClose();



      setReason("");



    }finally{


      setLoading(false);


    }


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
          max-w-md
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

          Cancelar reserva

        </h2>





        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >

          Esta acción cambiará el estado de la reserva a cancelada.

        </p>







        <textarea

          value={
            reason
          }

          onChange={
            e =>
              setReason(
                e.target.value
              )
          }

          placeholder="Motivo de cancelación (opcional)"

          className="
            mt-4
            min-h-[100px]
            w-full
            rounded-md
            border
            p-3
            text-sm
          "

        />








        <div
          className="
            mt-5
            flex
            justify-end
            gap-3
          "
        >



          <button

            type="button"

            onClick={
              onClose
            }

            disabled={
              loading
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

            Volver

          </button>








          <button

            type="button"

            onClick={
              handleCancel
            }

            disabled={
              loading
            }

            className="
              rounded-md
              bg-red-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-red-700
            "

          >

            {
              loading
              ?
              "Cancelando..."
              :
              "Cancelar reserva"
            }


          </button>





        </div>




      </div>


    </div>

  );

}



