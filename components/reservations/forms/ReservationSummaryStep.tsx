"use client";

import {
  CalendarDays,
  Clock3,
  FileText,
  UserRound,
  Users,
  Tag,
} from "lucide-react";
import {
  ReservationWizardStep,
  useReservationWizard,
} from "../wizard";

const reservationTypeLabels: Record<string, string> = {
  table: "Mesa en restaurante",
  event: "Evento especial",
  private: "Área privada",
};

const serviceLabels: Record<string, string> = {
  normal: "Reserva normal",
  birthday: "Cumpleaños",
  business: "Reunión empresarial",
  special: "Ocasión especial",
};

export default function ReservationSummaryStep() {
  const { data } = useReservationWizard();

  const reservationType =
    data.typeName?.trim() ||
    reservationTypeLabels[data.type ?? ""] ||
    data.type ||
    "No seleccionado";

  const service =
    data.serviceName?.trim() ||
    serviceLabels[data.service ?? ""] ||
    data.service ||
    "No seleccionado";


  return (
    <ReservationWizardStep>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
          Resumen de la reserva
        </h3>
        <p className="text-sm text-zinc-500">
          Revisa los datos antes de confirmar.
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid sm:grid-cols-2">
          <SummaryItem
            icon={<UserRound className="h-4 w-4" />}
            label="Cliente"
            value={data.customerName || "No indicado"}
          />

          <SummaryItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Fecha"
            value={data.date || "No seleccionada"}
          />

          <SummaryItem
            icon={<Users className="h-4 w-4" />}
            label="Personas"
            value={`${data.guests ?? 0} personas`}
          />

          <SummaryItem
            icon={<Clock3 className="h-4 w-4" />}
            label="Horario"
            value={data.time || "No seleccionado"}
          />

          <SummaryItem
            icon={<Tag className="h-4 w-4" />}
            label="Tipo de reserva"
            value={reservationType}
          />

          <SummaryItem
            label="Servicio"
            value={service}
          />

          <SummaryItem
            icon={<FileText className="h-4 w-4" />}
            label="Notas"
            value={data.customerNotes || "Sin notas"}
            multiline
          />
        </div>
      </div>

      <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-xs leading-5 text-orange-800">
        Verifica que los datos sean correctos antes de confirmar la reserva.
      </div>
    </ReservationWizardStep>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  multiline = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="border-b border-zinc-100 p-4 last:border-b-0 sm:nth-[odd]:border-r sm:nth-[5]:border-b-0">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>

      <p
        className={`mt-1 text-sm font-semibold text-zinc-900 ${
          multiline ? "leading-5" : "truncate"
        }`}
      >
        {value}
      </p>
    </div>
  );
}