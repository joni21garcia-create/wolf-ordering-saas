"use client";

import {
  ReservationWizardStep,
} from "../wizard";

import {
  ReservationTextarea,
} from "../common/inputs";

import {
  useReservationWizard,
} from "../wizard";



export default function ReservationNotesStep(){



  const {
    data,
    update,
  } = useReservationWizard();





  return (

    <ReservationWizardStep>


      <div className="space-y-2">

        <h3 className="text-xl font-semibold">
          Notas de la reserva
        </h3>


        <p className="text-sm text-zinc-500">
          Agrega solicitudes especiales o información adicional.
        </p>


      </div>







      <div className="mt-5">


        <ReservationTextarea

          label="Notas"

          value={
            data.notes ?? ""
          }

          onChange={
            (value)=>
              update({
                notes:value.target.value
              })
          }

          placeholder="
            Ej: Mesa cerca de ventana,
            celebración de cumpleaños,
            alergias o preferencias
          "

        />



      </div>





    </ReservationWizardStep>

  );

}


