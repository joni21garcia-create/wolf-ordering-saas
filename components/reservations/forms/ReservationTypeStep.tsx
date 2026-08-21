"use client";

import { Armchair, CalendarHeart, LockKeyhole } from "lucide-react";
import { ReservationButton } from "../common/buttons";
import {
  ReservationWizardStep,
  useReservationWizard,
} from "../wizard";

const reservationTypes = [
  {
    id: "table",
    label: "Mesa en restaurante",
    icon: Armchair,
  },
  {
    id: "event",
    label: "Evento especial",
    icon: CalendarHeart,
  },
  {
    id: "private",
    label: "Área privada",
    icon: LockKeyhole,
  },
];

export default function ReservationTypeStep() {
  const { data, update } = useReservationWizard();
  const selected = data.type ?? "";

  return (
    <ReservationWizardStep>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
          Tipo de reserva
        </h3>
        <p className="text-sm text-zinc-500">
          Selecciona cómo deseas realizar tu reserva.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Tipo de reserva"
        className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {reservationTypes.map((type) => {
          const active = selected === type.id;
          const Icon = type.icon;

          return (
            <ReservationButton
              key={type.id}
              variant={active ? "primary" : "secondary"}
              aria-pressed={active}
              onClick={() =>
                update({
                  type: type.id,
                  typeName: type.label,
                })}
              className="!h-auto min-h-14 justify-start gap-3 rounded-2xl px-4 py-3 text-left"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-white/15 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {type.label}
              </span>
            </ReservationButton>
          );
        })}
      </div>
    </ReservationWizardStep>
  );
}