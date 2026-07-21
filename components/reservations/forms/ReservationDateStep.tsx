"use client";

import { ReservationWizardStep } from "../wizard";
import { ReservationButton } from "../common/buttons";
import { useReservationWizard } from "../wizard";

const mockDates = [
  "2026-07-20",
  "2026-07-21",
  "2026-07-22",
  "2026-07-23",
  "2026-07-24",
];

export default function ReservationDateStep() {
  const { data, update } = useReservationWizard();

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

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {mockDates.map((date) => {
          const active = data.date === date;

          return (
            <ReservationButton
              key={date}
              variant={active ? "primary" : "secondary"}
              onClick={() => update({ date })}
            >
              {date}
            </ReservationButton>
          );
        })}
      </div>
    </ReservationWizardStep>
  );
}


