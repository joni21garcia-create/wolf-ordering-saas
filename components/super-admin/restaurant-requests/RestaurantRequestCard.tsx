import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";

import type { RestaurantCreationRequest } from "./RestaurantRequestsPage";

type RestaurantRequestCardProps = {
  request: RestaurantCreationRequest;
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-white/25">
        {icon}
        <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-[11px] text-white/55">
        {value}
      </p>
    </div>
  );
}

export default function RestaurantRequestCard({
  request,
}: RestaurantRequestCardProps) {
  const isLinked = Boolean(request.restaurant_id);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] transition hover:border-white/[0.11] hover:bg-white/[0.035]">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-[10px] font-bold text-orange-300">
              {getInitials(request.restaurant_name)}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white/90">
                {request.restaurant_name}
              </h2>

              <p className="mt-0.5 truncate text-[11px] text-white/35">
                {request.owner_name}
              </p>
            </div>
          </div>

          <StatusBadge status={request.request_status} />
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.05] bg-black/10 p-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <InfoItem
              icon={<UserRound size={13} />}
              label="Propietario"
              value={request.owner_email}
            />

            <InfoItem
              icon={<Building2 size={13} />}
              label="Plan"
              value={request.plan?.toUpperCase() || "—"}
            />

            <InfoItem
              icon={<Clock3 size={13} />}
              label="Solicitud"
              value={formatDate(request.created_at)}
            />

            <InfoItem
              icon={
                isLinked ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <Building2 size={13} />
                )
              }
              label="Restaurante"
              value={isLinked ? "Vinculado" : "Pendiente"}
            />
          </div>
        </div>

        {request.paypal_subscription_id ? (
          <div className="mt-3 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2.5">
            <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
              PayPal
            </span>

            <span className="truncate font-mono text-[9px] text-white/35">
              {request.paypal_subscription_id}
            </span>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/20">
              Estado de pago
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">
              {request.payment_status || "Sin estado"}
            </p>
          </div>

          <a
            href={`/super-admin/restaurant-requests/${request.id}`}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-orange-400"
          >
            Ver solicitud
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}