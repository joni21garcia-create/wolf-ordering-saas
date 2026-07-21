"use client";

import {
  useState,
} from "react";

import {
  checkinReservation,
} from "@/modules/reservations/actions";



interface CheckinReservationDialogProps {

  reservationId:string;

  open:boolean;

  onClose:()=>void;

  onSuccess?:()=>void;

}



export function CheckinReservationDialog({

  reservationId,

  open,

  onClose,

  onSuccess,

}:CheckinReservationDialogProps){



  const [
    loading,
    setLoading
  ] = useState(false);






  if(!open){

    return null;

  }








  async function handleCheckin(){


    try{


      setLoading(true);



      await checkinReservation(

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

          Confirmar llegada

        </h2>





        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >

          La reserva pasará a estado de check-in.

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

            Volver

          </button>








          <button

            type="button"

            onClick={
              handleCheckin
            }

            disabled={
              loading
            }

            className="
              rounded-md
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-blue-700
            "

          >

            {
              loading
              ?
              "Registrando..."
              :
              "Confirmar llegada"
            }


          </button>





        </div>




      </div>


    </div>

  );

}

