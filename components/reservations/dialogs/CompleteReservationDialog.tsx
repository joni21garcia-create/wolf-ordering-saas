"use client";

import {
  useState,
} from "react";

import {
  completeReservation,
} from "@/modules/reservations/actions";



interface CompleteReservationDialogProps {

  reservationId:string;

  open:boolean;

  onClose:()=>void;

  onSuccess?:()=>void;

}



export function CompleteReservationDialog({

  reservationId,

  open,

  onClose,

  onSuccess,

}:CompleteReservationDialogProps){



  const [
    loading,
    setLoading
  ] = useState(false);






  if(!open){

    return null;

  }







  async function handleComplete(){


    try{


      setLoading(true);



      await completeReservation(

        reservationId

      );



      onSuccess?.();



      onClose();



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

          Finalizar reserva

        </h2>





        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >

          La reserva será marcada como finalizada.

        </p>








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
              handleComplete
            }

            disabled={
              loading
            }

            className="
              rounded-md
              bg-emerald-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-emerald-700
            "

          >

            {
              loading
              ?
              "Finalizando..."
              :
              "Finalizar"
            }


          </button>





        </div>




      </div>


    </div>

  );

}

