"use client";

import { ReservationWizardStep } from "../wizard";
import { ReservationButton } from "../common/buttons";
import { useReservationWizard } from "../wizard";

export default function ReservationGuestsStep() {
  const { data, update } = useReservationWizard();

  const guests = data.guests ?? 2;

  return (
    <ReservationWizardStep>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          ¿Cuántas personas?
        </h3>

        <p className="text-sm text-zinc-500">
          Indica el número de asistentes.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5">
        <ReservationButton
          variant="secondary"
          onClick={() =>
            update({
              guests: Math.max(1, guests - 1),
            })
          }
        >
          −
        </ReservationButton>

        <div className="w-20 text-center text-4xl font-bold">
          {guests}
        </div>

        <ReservationButton
          onClick={() =>
            update({
              guests: guests + 1,
            })
          }
        >
          +
        </ReservationButton>
      </div>
    </ReservationWizardStep>
  );
}


