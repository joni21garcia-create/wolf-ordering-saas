"use client";

import { ReservationWizardStep } from "../wizard";
import { ReservationButton } from "../common/buttons";
import { useReservationWizard } from "../wizard";

const hours = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export default function ReservationTimeStep() {
  const { data, update } = useReservationWizard();

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

      <div className="grid grid-cols-3 gap-3">
        {hours.map((hour) => (
          <ReservationButton
            key={hour}
            variant={data.time === hour ? "primary" : "secondary"}
            onClick={() => update({ time: hour })}
          >
            {hour}
          </ReservationButton>
        ))}
      </div>
    </ReservationWizardStep>
  );
}


