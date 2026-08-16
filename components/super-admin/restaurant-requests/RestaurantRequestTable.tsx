import {
  ArrowRight,
  Building2,
  Clock3,
  UserRound,
} from "lucide-react";

import type { RestaurantCreationRequest } from "./RestaurantRequestsPage";

type RestaurantRequestTableProps = {
  requests: RestaurantCreationRequest[];
};

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(value: string) {
  return (
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "R"
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "in_review":
      return "En revisión";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    default:
      return status || "Sin estado";
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "completed":
      return "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300";
    case "in_review":
      return "border-orange-400/15 bg-orange-400/[0.07] text-orange-300";
    case "cancelled":
      return "border-red-400/15 bg-red-400/[0.07] text-red-300";
    case "pending":
    default:
      return "border-white/[0.08] bg-white/[0.045] text-white/60";
  }
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${getStatusClasses(
        status,
      )}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {getStatusLabel(status)}
    </span>
  );
}

export default function RestaurantRequestTable({
  requests,
}: RestaurantRequestTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] lg:block">
      <div className="grid grid-cols-[minmax(250px,1.5fr)_minmax(190px,1fr)_110px_145px_125px_100px] border-b border-white/[0.06] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
        <span>Restaurante</span>
        <span>Propietario</span>
        <span>Plan</span>
        <span>Estado</span>
        <span>Fecha</span>
        <span className="text-right">Acción</span>
      </div>

      {requests.map((request) => (
        <RestaurantRequestRow
          key={request.id}
          request={request}
        />
      ))}
    </div>
  );
}

function RestaurantRequestRow({
  request,
}: {
  request: RestaurantCreationRequest;
}) {
  return (
    <div className="grid grid-cols-[minmax(250px,1.5fr)_minmax(190px,1fr)_110px_145px_125px_100px] items-center border-b border-white/[0.05] px-5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-[10px] font-bold text-orange-300">
          {getInitials(request.restaurant_name)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white/85">
            {request.restaurant_name}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-white/30">
            {request.owner_email}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <UserRound
            size={13}
            className="shrink-0 text-white/20"
          />

          <p className="truncate text-sm text-white/65">
            {request.owner_name}
          </p>
        </div>

        <p className="mt-1 truncate pl-5 text-[11px] text-white/25">
          {request.owner_phone || "Sin teléfono"}
        </p>
      </div>

      <div>
        <span className="inline-flex items-center rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
          {request.plan?.toUpperCase() || "—"}
        </span>
      </div>

      <StatusBadge status={request.request_status} />

      <div className="flex items-center gap-1.5 text-[11px] text-white/35">
        <Clock3 size={12} />
        {formatDate(request.created_at)}
      </div>

      <div className="text-right">
        <a
          href={`/super-admin/restaurant-requests/${request.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-orange-300 transition hover:bg-orange-400/[0.06] hover:text-orange-200"
        >
          Ver
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}