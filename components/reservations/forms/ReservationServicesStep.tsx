"use client";

import { Cake, BriefcaseBusiness, Sparkles, Utensils } from "lucide-react";
import { ReservationButton } from "../common/buttons";
import {
  ReservationWizardStep,
  useReservationWizard,
} from "../wizard";

const services = [
  { id: "normal", label: "Reserva normal", icon: Utensils },
  { id: "birthday", label: "Cumpleaños", icon: Cake },
  { id: "business", label: "Reunión empresarial", icon: BriefcaseBusiness },
  { id: "special", label: "Ocasión especial", icon: Sparkles },
];

export default function ReservationServicesStep() {
  const { data, update } = useReservationWizard();
  const selected = data.service ?? "";

  return (
    <ReservationWizardStep>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
          Tipo de servicio
        </h3>
        <p className="text-sm text-zinc-500">
          Selecciona el motivo o tipo de reserva.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Tipo de servicio"
        className="mt-5 grid gap-2.5 sm:grid-cols-2"
      >
        {services.map((service) => {
          const active = selected === service.id;
          const Icon = service.icon;

          return (
            <ReservationButton
              key={service.id}
              variant={active ? "primary" : "secondary"}
              aria-pressed={active}
              onClick={() =>
                update({
                  service: service.id,
                  serviceName: service.label,
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

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {service.label}
                </span>
                <span
                  className={`mt-0.5 block text-[10px] ${
                    active ? "text-white/70" : "text-zinc-400"
                  }`}
                >
                  {active ? "Seleccionado" : "Seleccionar"}
                </span>
              </span>
            </ReservationButton>
          );
        })}
      </div>
    </ReservationWizardStep>
  );
}