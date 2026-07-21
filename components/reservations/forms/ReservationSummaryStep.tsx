"use client";

import {
  ReservationWizardStep,
} from "../wizard";

import {
  useReservationWizard,
} from "../wizard";



export default function ReservationSummaryStep(){



  const {
    data,
  } = useReservationWizard();






  return (

    <ReservationWizardStep>


      <div className="space-y-2">

        <h3 className="text-xl font-semibold">
          Resumen de la reserva
        </h3>


        <p className="text-sm text-zinc-500">
          Revisa los datos antes de confirmar.
        </p>


      </div>








      <div
        className="
          mt-5
          space-y-4
          rounded-lg
          border
          p-5
        "
      >



        <div>

          <span className="text-sm text-zinc-500">
            Cliente
          </span>


          <p className="font-medium">
            {
              data.customerName ||
              "No indicado"
            }
          </p>

        </div>








        <div>

          <span className="text-sm text-zinc-500">
            Fecha
          </span>


          <p className="font-medium">
            {
              data.date ||
              "No seleccionada"
            }
          </p>


        </div>








        <div>

          <span className="text-sm text-zinc-500">
            Personas
          </span>


          <p className="font-medium">

            {
              data.guests ??
              0
            }

            {" personas"}

          </p>


        </div>








        <div>

          <span className="text-sm text-zinc-500">
            Horario
          </span>


          <p className="font-medium">

            {
              data.time ||
              "No seleccionado"
            }

          </p>


        </div>








        <div>

          <span className="text-sm text-zinc-500">
            Servicio
          </span>


          <p className="font-medium">

            {
              data.service ||
              "Reserva normal"
            }

          </p>


        </div>








        <div>

          <span className="text-sm text-zinc-500">
            Notas
          </span>


          <p className="font-medium">

            {
              data.notes ||
              "Sin notas"
            }

          </p>


        </div>





      </div>





    </ReservationWizardStep>

  );

}

