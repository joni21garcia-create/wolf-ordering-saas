"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

type RequestGroup =
  | "all"
  | "pending"
  | "completed"
  | "linked";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
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
  const [requests, setRequests] = useState<
    RestaurantCreationRequest[]
  >([]);

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
         * La API de Super Admin resuelve la sesión mediante cookies.
         *
         * No usamos:
         *
         * supabase.auth.getSession()
         * supabase.auth.refreshSession()
         *
         * desde esta página.
         *
         * La sesión sigue siendo obligatoria para entrar a esta
         * sección de Super Admin; simplemente dejamos que la API
         * sea quien valide la sesión.
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
          },
        );

        const result =
          (await response.json()) as ApiResponse;

        if (response.status === 401) {
          throw new Error(
            result.message ||
              result.error ||
              "Necesitas iniciar sesión para consultar las solicitudes.",
          );
        }

        if (response.status === 403) {
          throw new Error(
            result.message ||
              result.error ||
              "No tienes permisos para consultar las solicitudes.",
          );
        }

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

  /*
   * ================================================================
   * GRUPOS
   * ================================================================
   */

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.request_status === "pending",
      ),
    [requests],
  );

  const completedRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.request_status === "completed",
      ),
    [requests],
  );

  const linkedRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          Boolean(request.restaurant_id),
      ),
    [requests],
  );

  const hasFilters = Boolean(
    search.trim() || status || plan,
  );

  const activeFilterCount = [
    search.trim(),
    status,
    plan,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPlan("");
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

        {/* =========================================================
            HEADER
        ========================================================= */}

        <header className="mb-5 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-400/80 sm:text-[10px]">
              <Building2 size={13} />
              Super Admin
            </div>

            <h1 className="text-[22px] font-semibold tracking-[-0.035em] sm:text-3xl">
              Solicitudes de restaurantes
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/40 sm:mt-2 sm:text-sm sm:leading-6">
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
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-xs font-semibold text-white/70 transition hover:border-white/[0.14] hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-auto"
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

        {/* =========================================================
            MOBILE FILTER ACCORDION
            CERRADO POR DEFECTO
        ========================================================= */}

        <section className="mb-4 lg:hidden">
          <details className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101010]">
            <summary className="flex min-h-[64px] cursor-pointer list-none items-center gap-3 px-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  hasFilters
                    ? "border-orange-400/15 bg-orange-400/[0.08] text-orange-300"
                    : "border-white/[0.06] bg-white/[0.035] text-white/35"
                }`}
              >
                <Filter size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="text-xs font-semibold text-white/80">
                    Filtros
                  </strong>

                  {activeFilterCount > 0 ? (
                    <span className="rounded-full bg-orange-400/[0.1] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-orange-300">
                      {activeFilterCount} activo
                      {activeFilterCount > 1
                        ? "s"
                        : ""}
                    </span>
                  ) : null}
                </div>

                <span className="mt-0.5 block truncate text-[10px] text-white/30">
                  {hasFilters
                    ? "Filtros aplicados"
                    : "Buscar y filtrar solicitudes"}
                </span>
              </div>

              <ChevronDown
                size={16}
                className="shrink-0 text-white/30 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>

            <div className="border-t border-white/[0.06] p-3.5">
              <div className="space-y-3">

                {/* Search */}

                <label className="relative block">
                  <span className="sr-only">
                    Buscar solicitudes
                  </span>

                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Buscar restaurante o propietario..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/25 transition focus:border-orange-400/30 focus:ring-2 focus:ring-orange-400/[0.06]"
                  />
                </label>

                {/* Status */}

                <div>
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.13em] text-white/25">
                    Estado
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(
                      (option) => {
                        const active =
                          status ===
                          option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setStatus(
                                option.value,
                              )
                            }
                            className={`rounded-full border px-3 py-2 text-[9px] font-semibold transition ${
                              active
                                ? "border-orange-400/20 bg-orange-400/[0.09] text-orange-300"
                                : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:border-white/[0.12] hover:text-white/60"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Plan */}

                <div>
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.13em] text-white/25">
                    Plan
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {PLAN_OPTIONS.map(
                      (option) => {
                        const active =
                          plan ===
                          option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setPlan(
                                option.value,
                              )
                            }
                            className={`rounded-full border px-3 py-2 text-[9px] font-semibold transition ${
                              active
                                ? "border-orange-400/20 bg-orange-400/[0.09] text-orange-300"
                                : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:border-white/[0.12] hover:text-white/60"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-9 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-orange-300"
                  >
                    <X size={13} />
                    Limpiar filtros
                  </button>
                ) : null}
              </div>
            </div>
          </details>
        </section>

        {/* =========================================================
            DESKTOP FILTERS
        ========================================================= */}

        <section className="mb-5 hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-400/10 bg-orange-400/[0.06] text-orange-300">
                <Filter size={13} />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                Filtrar solicitudes
              </span>
            </div>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/35 transition hover:text-orange-300"
              >
                <X size={12} />
                Limpiar
              </button>
            ) : null}
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_180px]">
            <label className="relative block min-w-0">
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
              className="h-11 rounded-xl border border-white/[0.07] bg-[#111] px-3 text-sm text-white/65 outline-none focus:border-orange-400/30"
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
              className="h-11 rounded-xl border border-white/[0.07] bg-[#111] px-3 text-sm text-white/65 outline-none focus:border-orange-400/30"
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

        {/* =========================================================
            ERROR
        ========================================================= */}

        {error ? (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-300"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-200">
                No pudimos cargar las solicitudes
              </p>

              <p className="mt-1 text-xs leading-5 text-red-200/50">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadRequests(true)
                }
                className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-orange-300"
              >
                <RefreshCw size={12} />
                Reintentar
              </button>
            </div>
          </div>
        ) : null}

        {/* =========================================================
            MOBILE GROUP ACCORDIONS
            TODOS CERRADOS POR DEFECTO
        ========================================================= */}

        <section className="space-y-2.5 lg:hidden">
          <RequestGroupAccordion
            title="Solicitudes"
            description="Todas las solicitudes recibidas"
            icon={<Store size={16} />}
            count={requests.length}
          >
            <MobileRequestList
              requests={requests}
            />
          </RequestGroupAccordion>

          <RequestGroupAccordion
            title="Pendientes"
            description="Solicitudes que requieren atención"
            icon={<Clock3 size={16} />}
            count={pendingRequests.length}
          >
            <MobileRequestList
              requests={pendingRequests}
            />
          </RequestGroupAccordion>

          <RequestGroupAccordion
            title="Completadas"
            description="Solicitudes finalizadas"
            icon={<CheckCircle2 size={16} />}
            count={completedRequests.length}
          >
            <MobileRequestList
              requests={completedRequests}
            />
          </RequestGroupAccordion>

          <RequestGroupAccordion
            title="Vinculadas"
            description="Solicitudes asociadas a un restaurante"
            icon={<Building2 size={16} />}
            count={linkedRequests.length}
          >
            <MobileRequestList
              requests={linkedRequests}
            />
          </RequestGroupAccordion>
        </section>

        {/* =========================================================
            DESKTOP METRICS
        ========================================================= */}

        <section className="mb-4 hidden grid-cols-2 gap-3 lg:grid lg:grid-cols-4">
          <MetricCard
            icon={<Store size={15} />}
            label="Solicitudes"
            value={requests.length}
          />

          <MetricCard
            icon={<Clock3 size={15} />}
            label="Pendientes"
            value={pendingRequests.length}
          />

          <MetricCard
            icon={<CheckCircle2 size={15} />}
            label="Completadas"
            value={completedRequests.length}
          />

          <MetricCard
            icon={<Building2 size={15} />}
            label="Vinculadas"
            value={linkedRequests.length}
          />
        </section>

        {/* =========================================================
            DESKTOP TABLE
        ========================================================= */}

        <section className="mt-5 hidden lg:block">
          {loading ? (
            <LoadingState />
          ) : requests.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onClear={clearFilters}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="grid grid-cols-[minmax(250px,1.5fr)_minmax(190px,1fr)_110px_145px_125px_100px] border-b border-white/[0.06] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                <span>Restaurante</span>
                <span>Propietario</span>
                <span>Plan</span>
                <span>Estado</span>
                <span>Fecha</span>
                <span className="text-right">
                  Acción
                </span>
              </div>

              {requests.map(
                (request) => (
                  <DesktopRequestRow
                    key={request.id}
                    request={request}
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ================================================================
   GROUP ACCORDION
   CERRADO POR DEFECTO
================================================================ */

function RequestGroupAccordion({
  title,
  description,
  icon,
  count,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101010]">
      <summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-3 px-3.5 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-white/35 transition group-open:border-orange-400/15 group-open:bg-orange-400/[0.08] group-open:text-orange-300">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <strong className="text-xs font-semibold text-white/80">
              {title}
            </strong>

            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[8px] font-bold text-white/35 group-open:bg-orange-400/[0.1] group-open:text-orange-300">
              {count}
            </span>
          </div>

          <span className="mt-0.5 block truncate text-[10px] text-white/30">
            {description}
          </span>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-white/30 transition group-open:bg-orange-400/[0.08] group-open:text-orange-300">
          <ChevronDown
            size={15}
            className="transition-transform duration-200 group-open:rotate-180"
          />
        </span>
      </summary>

      <div className="border-t border-white/[0.06] p-2.5">
        {children}
      </div>
    </details>
  );
}

/* ================================================================
   MOBILE REQUEST LIST
================================================================ */

function MobileRequestList({
  requests,
}: {
  requests: RestaurantCreationRequest[];
}) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] px-4 py-8 text-center">
        <Store
          size={18}
          className="mx-auto text-white/20"
        />

        <p className="mt-3 text-xs font-semibold text-white/45">
          No hay solicitudes aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map(
        (request) => (
          <MobileRequestAccordion
            key={request.id}
            request={request}
          />
        ),
      )}
    </div>
  );
}

/* ================================================================
   REQUEST ACCORDION
   CERRADO POR DEFECTO
================================================================ */

function MobileRequestAccordion({
  request,
}: {
  request: RestaurantCreationRequest;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d]">
      <summary className="flex min-h-[66px] cursor-pointer list-none items-center gap-3 px-3 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.07] text-[9px] font-bold text-orange-300">
          {getInitials(
            request.restaurant_name,
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white/80">
            {request.restaurant_name}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-white/30">
            {request.owner_name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge
            status={request.request_status}
          />

          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.035] text-white/25 transition group-open:bg-orange-400/[0.08] group-open:text-orange-300">
            <ChevronDown
              size={14}
              className="transition-transform duration-200 group-open:rotate-180"
            />
          </span>
        </div>
      </summary>

      <div className="border-t border-white/[0.06] px-3 pb-3 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <InfoCell
            icon={<UserRound size={12} />}
            label="Propietario"
            value={request.owner_name}
          />

          <InfoCell
            icon={<Store size={12} />}
            label="Plan"
            value={getPlanLabel(
              request.plan,
            )}
          />

          <InfoCell
            icon={<UserRound size={12} />}
            label="Correo"
            value={request.owner_email}
          />

          <InfoCell
            icon={<Clock3 size={12} />}
            label="Solicitud"
            value={formatDate(
              request.created_at,
            )}
          />

          <InfoCell
            icon={<Building2 size={12} />}
            label="Restaurante"
            value={
              request.restaurant_id
                ? "Vinculado"
                : "Pendiente"
            }
          />

          <InfoCell
            icon={<Filter size={12} />}
            label="Pago"
            value={
              request.payment_status ||
              "—"
            }
          />
        </div>

        {request.owner_phone ? (
          <div className="mt-2">
            <InfoCell
              icon={<UserRound size={12} />}
              label="Teléfono"
              value={request.owner_phone}
            />
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
              Suscripción
            </p>

            <p className="mt-1 truncate text-[10px] text-white/50">
              {request.subscription_status ||
                "—"}
            </p>
          </div>

          <a
            href={`/super-admin/restaurant-requests/${request.id}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-orange-400/15 bg-orange-400/[0.07] px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-orange-300 transition hover:bg-orange-400/[0.11]"
          >
            Ver solicitud
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </details>
  );
}

/* ================================================================
   INFO CELL
================================================================ */

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
    <div className="min-w-0 rounded-xl border border-white/[0.05] bg-white/[0.018] px-2.5 py-2.5">
      <div className="flex items-center gap-1.5 text-white/25">
        {icon}

        <span className="truncate text-[8px] font-bold uppercase tracking-[0.1em]">
          {label}
        </span>
      </div>

      <p className="mt-1 break-words text-[10px] leading-4 text-white/55">
        {value || "—"}
      </p>
    </div>
  );
}

/* ================================================================
   METRIC CARD
================================================================ */

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

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex w-fit max-w-[110px] items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.06em] ${getStatusClasses(
        status,
      )}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />

      <span className="truncate">
        {getStatusLabel(status)}
      </span>
    </span>
  );
}

/* ================================================================
   DESKTOP ROW
================================================================ */

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

      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
        {getPlanLabel(request.plan)}
      </span>

      <StatusBadge
        status={request.request_status}
      />

      <span className="text-[11px] text-white/35">
        {formatDate(request.created_at)}
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

/* ================================================================
   LOADING
================================================================ */

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

/* ================================================================
   EMPTY
================================================================ */

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