"use client";

import {
  ReservationWizardStep,
} from "../wizard";

import {
  ReservationButton,
} from "../common/buttons";

import {
  useReservationWizard,
} from "../wizard";



const reservationTypes = [

  {
    id:"table",
    label:"Mesa en restaurante",
  },

  {
    id:"event",
    label:"Evento especial",
  },

  {
    id:"private",
    label:"Área privada",
  },

];





export default function ReservationTypeStep(){



  const {
    data,
    update,
  } = useReservationWizard();






  const selected =
    data.type ?? "";







  return (

    <ReservationWizardStep>



      <div className="space-y-2">


        <h3 className="text-xl font-semibold">
          Tipo de reserva
        </h3>


        <p className="text-sm text-zinc-500">
          Selecciona cómo deseas realizar tu reserva.
        </p>


      </div>








      <div
        className="
          mt-5
          grid
          gap-3
          md:grid-cols-3
        "
      >



        {
          reservationTypes.map(

            type => {


              const active =
                selected === type.id;





              return (

                <ReservationButton

                  key={
                    type.id
                  }


                  variant={
                    active
                    ?
                    "primary"
                    :
                    "secondary"
                  }


                  onClick={() =>
                    update({
                      type:
                        type.id
                    })
                  }

                >

                  {
                    type.label
                  }


                </ReservationButton>

              );

            }

          )
        }



      </div>





    </ReservationWizardStep>

  );

}

