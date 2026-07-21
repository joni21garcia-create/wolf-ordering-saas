"use client";

import {
  useState,
} from "react";

import {
  noShowReservation,
} from "@/modules/reservations/actions";



interface NoShowReservationDialogProps {

  reservationId:string;

  open:boolean;

  onClose:()=>void;

  onSuccess?:()=>void;

}



export function NoShowReservationDialog({

  reservationId,

  open,

  onClose,

  onSuccess,

}:NoShowReservationDialogProps){



  const [
    loading,
    setLoading
  ] = useState(false);



  const [
    reason,
    setReason
  ] = useState("");







  if(!open){

    return null;

  }







  async function handleNoShow(){


    try{


      setLoading(true);



      await noShowReservation(

        reservationId

      );



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

          Cliente no asistió

        </h2>





        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >

          La reserva será marcada como no presentada.

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

          placeholder="Observación (opcional)"

          className="
            mt-4
            min-h-[90px]
            w-full
            rounded-md
            border
            p-3
            text-sm
          "

        />








        <div
          className="
            mt-6
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

            Cancelar

          </button>







          <button

            type="button"

            onClick={
              handleNoShow
            }

            disabled={
              loading
            }

            className="
              rounded-md
              bg-orange-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-orange-700
            "

          >

            {
              loading
              ?
              "Guardando..."
              :
              "Marcar no asistió"
            }


          </button>





        </div>




      </div>


    </div>

  );

}

