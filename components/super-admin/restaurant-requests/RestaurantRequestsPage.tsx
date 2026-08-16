"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  Store,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";

export type RestaurantCreationRequest = {
  id: string;
  user_id: string;
  restaurant_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  plan: string;
  paypal_plan_id: string | null;
  paypal_subscription_id: string | null;
  payment_status: string;
  subscription_status: string;
  request_status: string;
  restaurant_id: string | null;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  success: boolean;
  requests?: RestaurantCreationRequest[];
  count?: number;
  total?: number;
  error?: string;
  message?: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "in_review", label: "En revisión" },
  { value: "completed", label: "Completadas" },
  { value: "cancelled", label: "Canceladas" },
];

const PLAN_OPTIONS = [
  { value: "", label: "Todos los planes" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

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

function getPlanLabel(plan: string) {
  return plan?.toUpperCase() || "—";
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

export default function RestaurantRequestsPage() {
  const [requests, setRequests] = useState<RestaurantCreationRequest[]>(
    [],
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        /*
         * ============================================================
         * AUTENTICACIÓN
         * ============================================================
         *
         * La API de Super Admin exige:
         *
         * Authorization: Bearer <access_token>
         *
         * Obtenemos la sesión real de Supabase antes de consultar.
         */

        let {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn(
            "[RESTAURANT REQUESTS PAGE] getSession no devolvió sesión:",
            sessionError,
          );
        }

        let accessToken =
          sessionData.session?.access_token ?? null;

        // Si la sesión no está disponible todavía en el cliente,
        // intentamos refrescarla antes de marcar al usuario como no autenticado.
        if (!accessToken) {
          const {
            data: refreshedSession,
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (!refreshError) {
            sessionData = refreshedSession;
            accessToken =
              refreshedSession.session?.access_token ?? null;
          } else {
            console.warn(
              "[RESTAURANT REQUESTS PAGE] No se pudo refrescar la sesión:",
              refreshError,
            );
          }
        }

        if (!accessToken) {
          throw new Error(
            "Necesitas una sesión activa para consultar las solicitudes.",
          );
        }

        /*
         * ============================================================
         * FILTROS
         * ============================================================
         */

        const params = new URLSearchParams();

        if (status) {
          params.set("status", status);
        }

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (plan) {
          params.set("plan", plan);
        }

        /*
         * ============================================================
         * API SUPER ADMIN
         * ============================================================
         */

        const response = await fetch(
          `/api/super-admin/restaurant-requests${
            params.toString()
              ? `?${params.toString()}`
              : ""
          }`,
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result =
          (await response.json()) as ApiResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              result.error ||
              "No pudimos cargar las solicitudes.",
          );
        }

        setRequests(result.requests ?? []);
      } catch (requestError) {
        console.error(
          "[RESTAURANT REQUESTS PAGE]",
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No pudimos cargar las solicitudes.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [plan, search, status],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadRequests();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [loadRequests]);

  const visibleRequests = useMemo(
    () => requests,
    [requests],
  );

  const pendingCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.request_status === "pending",
      ).length,
    [requests],
  );

  const completedCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.request_status === "completed",
      ).length,
    [requests],
  );

  const linkedCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          Boolean(request.restaurant_id),
      ).length,
    [requests],
  );

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400/80">
              <Building2
                size={13}
                strokeWidth={1.8}
              />
              Super Admin
            </div>

            <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Solicitudes de restaurantes
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
              Gestiona las solicitudes recibidas y
              completa la creación del restaurante
              desde el flujo existente.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadRequests(true)
            }
            disabled={loading || refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-xs font-semibold text-white/70 transition hover:border-white/[0.14] hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <RefreshCw size={15} />
            )}

            Actualizar
          </button>
        </header>

        <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            icon={<Store size={15} />}
            label="Solicitudes"
            value={requests.length}
          />

          <MetricCard
            icon={<Clock3 size={15} />}
            label="Pendientes"
            value={pendingCount}
          />

          <MetricCard
            icon={<CheckCircle2 size={15} />}
            label="Completadas"
            value={completedCount}
          />

          <MetricCard
            icon={<Building2 size={15} />}
            label="Vinculadas"
            value={linkedCount}
          />
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar restaurante, propietario, correo..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-orange-400/30 focus:ring-2 focus:ring-orange-400/[0.06]"
              />
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="h-11 rounded-xl border border-white/[0.07] bg-[#111] px-3 text-sm text-white/65 outline-none focus:border-orange-400/30 lg:w-44"
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            <select
              value={plan}
              onChange={(event) =>
                setPlan(event.target.value)
              }
              className="h-11 rounded-xl border border-white/[0.07] bg-[#111] px-3 text-sm text-white/65 outline-none focus:border-orange-400/30 lg:w-44"
            >
              {PLAN_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>
        </section>

        {error ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-300"
            />

            <div>
              <p className="text-sm font-semibold text-red-200">
                No pudimos cargar las solicitudes
              </p>

              <p className="mt-1 text-xs leading-5 text-red-200/50">
                {error}
              </p>
            </div>
          </div>
        ) : null}

        <section className="mt-5">
          {loading ? (
            <LoadingState />
          ) : visibleRequests.length === 0 ? (
            <EmptyState
              hasFilters={Boolean(
                search ||
                  status ||
                  plan,
              )}
              onClear={() => {
                setSearch("");
                setStatus("");
                setPlan("");
              }}
            />
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] lg:block">
                <div className="grid grid-cols-[minmax(250px,1.5fr)_minmax(190px,1fr)_110px_145px_125px_100px] border-b border-white/[0.06] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                  <span>
                    Restaurante
                  </span>

                  <span>
                    Propietario
                  </span>

                  <span>
                    Plan
                  </span>

                  <span>
                    Estado
                  </span>

                  <span>
                    Fecha
                  </span>

                  <span className="text-right">
                    Acción
                  </span>
                </div>

                {visibleRequests.map(
                  (request) => (
                    <DesktopRequestRow
                      key={request.id}
                      request={request}
                    />
                  ),
                )}
              </div>

              <div className="grid gap-3 lg:hidden">
                {visibleRequests.map(
                  (request) => (
                    <MobileRequestCard
                      key={request.id}
                      request={request}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-white/30">
        {icon}

        <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </div>
  );
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

function DesktopRequestRow({
  request,
}: {
  request: RestaurantCreationRequest;
}) {
  return (
    <div className="grid grid-cols-[minmax(250px,1.5fr)_minmax(190px,1fr)_110px_145px_125px_100px] items-center border-b border-white/[0.05] px-5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-[10px] font-bold text-orange-300">
          {getInitials(
            request.restaurant_name,
          )}
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
        <p className="truncate text-sm text-white/65">
          {request.owner_name}
        </p>

        <p className="mt-0.5 truncate text-[11px] text-white/25">
          {request.owner_phone ||
            "Sin teléfono"}
        </p>
      </div>

      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
          {getPlanLabel(
            request.plan,
          )}
        </span>
      </div>

      <StatusBadge
        status={
          request.request_status
        }
      />

      <span className="text-[11px] text-white/35">
        {formatDate(
          request.created_at,
        )}
      </span>

      <div className="text-right">
        <a
          href={`/super-admin/restaurant-requests/${request.id}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-orange-300 transition hover:text-orange-200"
        >
          Ver
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}

function MobileRequestCard({
  request,
}: {
  request: RestaurantCreationRequest;
}) {
  return (
    <a
      href={`/super-admin/restaurant-requests/${request.id}`}
      className="block rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-[10px] font-bold text-orange-300">
            {getInitials(
              request.restaurant_name,
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white/85">
              {request.restaurant_name}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-white/35">
              {request.owner_name}
            </p>
          </div>
        </div>

        <StatusBadge
          status={
            request.request_status
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.05] pt-3">
        <InfoCell
          icon={<UserRound size={13} />}
          label="Propietario"
          value={request.owner_email}
        />

        <InfoCell
          icon={<Store size={13} />}
          label="Plan"
          value={getPlanLabel(
            request.plan,
          )}
        />

        <InfoCell
          icon={<Clock3 size={13} />}
          label="Solicitud"
          value={formatDate(
            request.created_at,
          )}
        />

        <InfoCell
          icon={<Building2 size={13} />}
          label="Restaurante"
          value={
            request.restaurant_id
              ? "Vinculado"
              : "Pendiente"
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-white/[0.05] pt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-orange-300">
        Ver solicitud

        <ArrowRight
          size={13}
          className="ml-1.5"
        />
      </div>
    </a>
  );
}

function InfoCell({
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

function LoadingState() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8">
      <div className="flex items-center justify-center gap-3 text-sm text-white/35">
        <Loader2
          size={18}
          className="animate-spin text-orange-300"
        />

        Cargando solicitudes...
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.02] px-5 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-white/25">
        <Store size={20} />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white/70">
        {hasFilters
          ? "No encontramos solicitudes"
          : "No hay solicitudes todavía"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/30">
        {hasFilters
          ? "Prueba cambiando los filtros o limpiando la búsqueda."
          : "Las nuevas solicitudes de restaurantes aparecerán aquí automáticamente."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-300 hover:text-orange-200"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}