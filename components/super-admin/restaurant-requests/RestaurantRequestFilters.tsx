"use client";

import {
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export type RestaurantRequestFilterValues = {
  search: string;
  status: string;
  plan: string;
};

type RestaurantRequestFiltersProps = {
  value: RestaurantRequestFilterValues;
  onChange: (
    nextValue: RestaurantRequestFilterValues,
  ) => void;
  onReset?: () => void;
  disabled?: boolean;
};

const STATUS_OPTIONS = [
  {
    value: "",
    label: "Todos",
  },
  {
    value: "pending",
    label: "Pendientes",
  },
  {
    value: "in_review",
    label: "En revisión",
  },
  {
    value: "completed",
    label: "Completadas",
  },
  {
    value: "cancelled",
    label: "Canceladas",
  },
];

const PLAN_OPTIONS = [
  {
    value: "",
    label: "Todos",
  },
  {
    value: "basic",
    label: "Basic",
  },
  {
    value: "pro",
    label: "Pro",
  },
];

function getActiveFilterCount(
  value: RestaurantRequestFilterValues,
) {
  return [
    value.search.trim(),
    value.status,
    value.plan,
  ].filter(Boolean).length;
}

export default function RestaurantRequestFilters({
  value,
  onChange,
  onReset,
  disabled = false,
}: RestaurantRequestFiltersProps) {
  const activeFilterCount =
    getActiveFilterCount(value);

  const hasFilters =
    activeFilterCount > 0;

  const update = (
    field: keyof RestaurantRequestFilterValues,
    fieldValue: string,
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const reset = () => {
    if (onReset) {
      onReset();
      return;
    }

    onChange({
      search: "",
      status: "",
      plan: "",
    });
  };

  const selectedStatus =
    STATUS_OPTIONS.find(
      (option) =>
        option.value === value.status,
    );

  const selectedPlan =
    PLAN_OPTIONS.find(
      (option) =>
        option.value === value.plan,
    );

  return (
    <section
      aria-label="Filtros de solicitudes"
      className="w-full"
    >
      {/* =========================================================
          MOBILE
          ========================================================= */}

      <details
        className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101010] lg:hidden"
        open={false}
      >
        <summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-3 px-3.5 py-3">
          {/* Icon */}

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
              hasFilters
                ? "border-orange-400/15 bg-orange-400/[0.08] text-orange-300"
                : "border-white/[0.07] bg-white/[0.035] text-white/35"
            }`}
          >
            <SlidersHorizontal size={16} />
          </div>

          {/* Title */}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white/80">
                Filtros
              </span>

              {hasFilters ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-400/[0.1] px-1.5 py-0.5 text-[8px] font-bold text-orange-300">
                  {activeFilterCount}
                </span>
              ) : null}
            </div>

            <p className="mt-0.5 truncate text-[10px] text-white/30">
              {hasFilters
                ? getFilterSummary(
                    value,
                    selectedStatus?.label,
                    selectedPlan?.label,
                  )
                : "Buscar y filtrar solicitudes"}
            </p>
          </div>

          {/* Chevron */}

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-white/25 transition group-open:bg-orange-400/[0.08] group-open:text-orange-300">
            <ChevronDown
              size={15}
              className="transition-transform duration-200 group-open:rotate-180"
            />
          </div>
        </summary>

        {/* =======================================================
            MOBILE FILTER CONTENT
            ======================================================= */}

        <div className="border-t border-white/[0.06]">
          <div className="space-y-4 p-3.5">

            {/* Search */}

            <div>
              <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.14em] text-white/25">
                Buscar
              </label>

              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="search"
                  value={value.search}
                  onChange={(event) =>
                    update(
                      "search",
                      event.target.value,
                    )
                  }
                  disabled={disabled}
                  autoComplete="off"
                  placeholder="Restaurante, propietario o correo..."
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-10 text-xs text-white outline-none placeholder:text-white/20 transition focus:border-orange-400/30 focus:bg-black/30 focus:ring-2 focus:ring-orange-400/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
                />

                {value.search ? (
                  <button
                    type="button"
                    onClick={() =>
                      update("search", "")
                    }
                    disabled={disabled}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white/60 disabled:opacity-40"
                  >
                    <X size={13} />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Status */}

            <FilterGroup
              label="Estado"
              options={STATUS_OPTIONS}
              value={value.status}
              onChange={(nextValue) =>
                update("status", nextValue)
              }
              disabled={disabled}
            />

            {/* Plan */}

            <FilterGroup
              label="Plan"
              options={PLAN_OPTIONS}
              value={value.plan}
              onChange={(nextValue) =>
                update("plan", nextValue)
              }
              disabled={disabled}
            />

            {/* Active filters */}

            {hasFilters ? (
              <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />

                  <span className="truncate text-[9px] text-white/35">
                    {activeFilterCount} filtro
                    {activeFilterCount === 1
                      ? " activo"
                      : "s activos"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  disabled={disabled}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white/40 transition hover:border-orange-400/15 hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={11} />
                  Limpiar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </details>

      {/* =========================================================
          DESKTOP
          ========================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] lg:block">

        {/* Header */}

        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-400/10 bg-orange-400/[0.06] text-orange-300">
              <Filter size={13} />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
              Filtrar solicitudes
            </span>

            {hasFilters ? (
              <span className="rounded-full bg-orange-400/[0.08] px-2 py-0.5 text-[8px] font-bold text-orange-300">
                {activeFilterCount}
              </span>
            ) : null}
          </div>

          {hasFilters ? (
            <button
              type="button"
              onClick={reset}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30 transition hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={11} />
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {/* Controls */}

        <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_200px_180px]">
          {/* Search */}

          <div className="relative min-w-0">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              type="search"
              value={value.search}
              onChange={(event) =>
                update(
                  "search",
                  event.target.value,
                )
              }
              disabled={disabled}
              autoComplete="off"
              placeholder="Buscar restaurante, propietario, correo..."
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-orange-400/30 focus:bg-black/30 focus:ring-2 focus:ring-orange-400/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Status */}

          <SelectField
            value={value.status}
            options={STATUS_OPTIONS}
            onChange={(nextValue) =>
              update("status", nextValue)
            }
            disabled={disabled}
            ariaLabel="Filtrar por estado"
          />

          {/* Plan */}

          <SelectField
            value={value.plan}
            options={PLAN_OPTIONS}
            onChange={(nextValue) =>
              update("plan", nextValue)
            }
            disabled={disabled}
            ariaLabel="Filtrar por plan"
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   MOBILE FILTER GROUP
================================================================ */

function FilterGroup({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/25">
          {label}
        </label>

        {value ? (
          <span className="text-[8px] font-medium text-orange-300/70">
            Seleccionado
          </span>
        ) : null}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {options.map((option) => {
          const active =
            value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(option.value)
              }
              disabled={disabled}
              aria-pressed={active}
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[9px] font-semibold transition ${
                active
                  ? "border-orange-400/20 bg-orange-400/[0.09] text-orange-300 shadow-[0_0_0_1px_rgba(251,146,60,0.02)]"
                  : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:border-white/[0.12] hover:text-white/60"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {active ? (
                <Check size={11} />
              ) : null}

              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   DESKTOP SELECT
================================================================ */

function SelectField({
  value,
  options,
  onChange,
  disabled,
  ariaLabel,
}: {
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={disabled}
        aria-label={ariaLabel}
        className="h-11 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#111] px-3 pr-9 text-sm text-white/65 outline-none transition focus:border-orange-400/30 focus:bg-[#141414] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
      />
    </div>
  );
}

/* ================================================================
   SUMMARY
================================================================ */

function getFilterSummary(
  value: RestaurantRequestFilterValues,
  statusLabel?: string,
  planLabel?: string,
) {
  if (value.search.trim()) {
    return `Buscando "${value.search.trim()}"`;
  }

  const parts = [];

  if (value.status && statusLabel) {
    parts.push(statusLabel);
  }

  if (value.plan && planLabel) {
    parts.push(planLabel);
  }

  return parts.length
    ? parts.join(" · ")
    : "Filtros aplicados";
}