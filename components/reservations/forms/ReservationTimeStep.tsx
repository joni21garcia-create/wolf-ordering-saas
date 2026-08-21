"use client";

import { useEffect, useState } from "react";

import { ReservationWizardStep } from "../wizard";
import { ReservationButton } from "../common/buttons";
import { useReservationWizard } from "../wizard";

import {
  getAvailableReservationTimes,
} from "@/modules/reservations/actions";


interface ReservationTimeStepProps {
  restaurantId: string;
}


export default function ReservationTimeStep({
  restaurantId,
}: ReservationTimeStepProps) {

  const {
    data,
    update,
  } = useReservationWizard();


  const [
    hours,
    setHours,
  ] = useState<string[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    async function loadTimes() {

      if (!data.date) {
        setHours([]);
        setLoading(false);
        return;
      }


      try {

const available =
  await getAvailableReservationTimes(
    restaurantId,
    data.date,
    data.guests ?? 1
  );


        setHours(
          available
        );


      } catch (error) {

        console.error(
          "ERROR LOADING RESERVATION TIMES",
          error
        );

        setHours([]);

      } finally {

        setLoading(false);

      }
    }


    loadTimes();


}, [
  restaurantId,
  data.date,
  data.guests,
]);



  return (
    <ReservationWizardStep>

      <div className="space-y-2">

        <h3 className="text-xl font-semibold">
          Selecciona una hora
        </h3>


        <p className="text-sm text-zinc-500">
          Solo mostramos horarios disponibles.
        </p>

      </div>


      {loading ? (
        <p className="mt-4 text-sm text-zinc-400">
          Cargando horarios...
        </p>
      ) : null}



      {!loading && hours.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">
          No hay horarios disponibles.
        </p>
      ) : null}



      <div className="
        mt-4
        grid
        grid-cols-3
        gap-3
      ">

        {hours.map((hour) => (

          <ReservationButton

            key={hour}

            variant={
              data.time === hour
                ? "primary"
                : "secondary"
            }

            onClick={() =>
              update({
                time: hour,
              })
            }

          >
            {hour}
          </ReservationButton>

        ))}

      </div>


    </ReservationWizardStep>
  );
}