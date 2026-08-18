import {
  ArrowRight,
  Building2,
  CheckCircle2,
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
      .map(
        (part) =>
          part[0]?.toUpperCase() ?? "",
      )
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

      {/* ========================================================
          TABLE HEADER
      ======================================================== */}

      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
            Solicitudes
          </p>

          <p className="mt-1 text-xs text-white/35">
            {requests.length}{" "}
            {requests.length === 1
              ? "solicitud"
              : "solicitudes"}{" "}
            encontradas
          </p>
        </div>

        <div className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 text-[9px] text-white/25">
          <Building2 size={12} />

          Restaurante
        </div>
      </div>

      {/* ========================================================
          COLUMN HEADERS
      ======================================================== */}

      <div className="grid grid-cols-[minmax(260px,1.55fr)_minmax(190px,1fr)_100px_145px_125px_125px] items-center border-b border-white/[0.06] bg-black/10 px-5 py-2.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/20">
        <span>Restaurante</span>

        <span>Propietario</span>

        <span>Plan</span>

        <span>Estado</span>

        <span>Fecha</span>

        <span className="text-right">
          Acción
        </span>
      </div>

      {/* ========================================================
          ROWS
      ======================================================== */}

      {requests.length > 0 ? (
        requests.map((request) => (
          <RestaurantRequestRow
            key={request.id}
            request={request}
          />
        ))
      ) : (
        <div className="flex min-h-[180px] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-white/20">
              <Building2 size={16} />
            </div>

            <p className="mt-3 text-xs font-medium text-white/45">
              No hay solicitudes
            </p>

            <p className="mt-1 text-[10px] text-white/20">
              No encontramos solicitudes
              para mostrar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   ROW
================================================================ */

function RestaurantRequestRow({
  request,
}: {
  request: RestaurantCreationRequest;
}) {
  const isLinked = Boolean(
    request.restaurant_id,
  );

  return (
    <div className="group grid grid-cols-[minmax(260px,1.55fr)_minmax(190px,1fr)_100px_145px_125px_125px] items-center border-b border-white/[0.045] px-5 py-4 transition duration-150 last:border-b-0 hover:bg-white/[0.018]">

      {/* ======================================================
          RESTAURANTE
      ====================================================== */}

      <div className="flex min-w-0 items-center gap-3">

        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-[10px] font-bold text-orange-300 transition group-hover:border-orange-400/20 group-hover:bg-orange-400/[0.09]">
          {getInitials(
            request.restaurant_name,
          )}

          {isLinked ? (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#101010] bg-emerald-400 text-black">
              <CheckCircle2
                size={8}
                strokeWidth={3}
              />
            </span>
          ) : null}
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-white/80 transition group-hover:text-white/90">
            {request.restaurant_name}
          </p>

          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[10px] text-white/25">
              {request.owner_email}
            </span>

            {isLinked ? (
              <>
                <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400/40" />

                <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.08em] text-emerald-300/60">
                  Vinculado
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* ======================================================
          PROPIETARIO
      ====================================================== */}

      <div className="min-w-0">

        <div className="flex min-w-0 items-center gap-2">

          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.035] text-white/25">
            <UserRound size={11} />
          </div>

          <p className="truncate text-xs font-medium text-white/55">
            {request.owner_name}
          </p>
        </div>

        <p className="mt-1 truncate pl-8 text-[10px] text-white/20">
          {request.owner_phone ||
            "Sin teléfono"}
        </p>
      </div>

      {/* ======================================================
          PLAN
      ====================================================== */}

      <div>
        <span className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/45">
          {request.plan?.toUpperCase() ||
            "—"}
        </span>
      </div>

      {/* ======================================================
          STATUS
      ====================================================== */}

      <StatusBadge
        status={request.request_status}
      />

      {/* ======================================================
          FECHA
      ====================================================== */}

      <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-white/30">
        <Clock3
          size={12}
          className="shrink-0 text-white/20"
        />

        <span className="truncate">
          {formatDate(
            request.created_at,
          )}
        </span>
      </div>

      {/* ======================================================
          ACTION
      ====================================================== */}

      <div className="flex justify-end">

        <a
          href={`/super-admin/restaurant-requests/${request.id}`}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 text-[9px] font-bold uppercase tracking-[0.08em] text-white/40 transition hover:border-orange-400/15 hover:bg-orange-400/[0.06] hover:text-orange-300"
        >
          Ver solicitud

          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  );
}