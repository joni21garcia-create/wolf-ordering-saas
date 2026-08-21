"use client";

import { Minus, Plus, Users } from "lucide-react";
import { ReservationButton } from "../common/buttons";
import {
  ReservationWizardStep,
  useReservationWizard,
} from "../wizard";

export default function ReservationGuestsStep() {
  const { data, update } = useReservationWizard();
  const guests = Math.max(1, data.guests ?? 2);

  return (
    <ReservationWizardStep>
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Users className="h-5 w-5" />
        </div>

        <h3 className="pt-1 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
          ¿Cuántas personas?
        </h3>

        <p className="text-sm text-zinc-500">
          Indica el número de asistentes.
        </p>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-xs items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-2 sm:max-w-sm">
        <ReservationButton
          variant="secondary"
          aria-label="Reducir número de personas"
          disabled={guests <= 1}
          onClick={() =>
            update({ guests: Math.max(1, guests - 1) })
          }
          className="h-12 w-12 rounded-xl p-0"
        >
          <Minus className="h-5 w-5 text-black" strokeWidth={2.5} />
        </ReservationButton>

        <div className="min-w-[92px] text-center">
          <div className="text-4xl font-black tracking-tight text-zinc-900">
            {guests}
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            {guests === 1 ? "persona" : "personas"}
          </div>
        </div>

        <ReservationButton
          aria-label="Aumentar número de personas"
          onClick={() =>
            update({ guests: guests + 1 })
          }
          className="h-12 w-12 rounded-xl p-0"
        >
          <Plus className="h-5 w-5 text-black" strokeWidth={2.5} />
        </ReservationButton>
      </div>
    </ReservationWizardStep>
  );
}