"use client";

import { useEffect, useState } from "react";

import { ReservationWizardStep } from "../wizard";
import { ReservationButton } from "../common/buttons";
import { useReservationWizard } from "../wizard";

import {
  getAvailableReservationDates,
} from "@/modules/reservations/actions";

interface ReservationDateStepProps {
  restaurantId: string;
}

export default function ReservationDateStep({
  restaurantId,
}: ReservationDateStepProps) {

  const {
    data,
    update,
  } = useReservationWizard();

  const [
    dates,
    setDates,
  ] = useState<string[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {
    async function loadDates() {
      try {
        const available =
          await getAvailableReservationDates(
            restaurantId
          );

        setDates(available);

      } catch (error) {
        console.error(
          "ERROR LOADING RESERVATION DATES",
          error
        );

        setDates([]);

      } finally {
        setLoading(false);
      }
    }

    loadDates();

  }, [restaurantId]);


  return (
    <ReservationWizardStep>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          ¿Qué día deseas reservar?
        </h3>

        <p className="text-sm text-zinc-500">
          Selecciona una fecha disponible.
        </p>
      </div>


      {loading ? (
        <p className="mt-4 text-sm text-zinc-400">
          Cargando fechas disponibles...
        </p>
      ) : null}


      {!loading && dates.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">
          No hay fechas disponibles.
        </p>
      ) : null}


      <div className="
        mt-4
        grid
        grid-cols-2
        gap-3
        md:grid-cols-3
      ">
        {dates.map((date) => {

          const active =
            data.date === date;


          return (
            <ReservationButton
              key={date}
              variant={
                active
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                update({
                  date,
                })
              }
            >
              {date}
            </ReservationButton>
          );
        })}
      </div>

    </ReservationWizardStep>
  );
}