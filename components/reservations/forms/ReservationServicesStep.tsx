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



const services = [

  {
    id:"normal",
    label:"Reserva normal",
  },

  {
    id:"birthday",
    label:"Cumpleaños",
  },

  {
    id:"business",
    label:"Reunión empresarial",
  },

  {
    id:"special",
    label:"Ocasión especial",
  },

];





export default function ReservationServicesStep(){



  const {
    data,
    update,
  } = useReservationWizard();





  const selected =
    data.service ?? "";






  return (

    <ReservationWizardStep>


      <div className="space-y-2">

        <h3 className="text-xl font-semibold">
          Tipo de servicio
        </h3>


        <p className="text-sm text-zinc-500">
          Selecciona el motivo o tipo de reserva.
        </p>


      </div>








      <div
        className="
          mt-5
          grid
          gap-3
          md:grid-cols-2
        "
      >



        {
          services.map(

            service => {


              const active =
                selected === service.id;




              return (

                <ReservationButton

                  key={
                    service.id
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
                      service:
                        service.id
                    })
                  }

                >

                  {
                    service.label
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

