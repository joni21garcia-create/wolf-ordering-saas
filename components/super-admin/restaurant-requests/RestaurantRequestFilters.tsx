"use client";

import { Filter, RotateCcw, Search } from "lucide-react";

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

export default function RestaurantRequestFilters({
  value,
  onChange,
  onReset,
  disabled = false,
}: RestaurantRequestFiltersProps) {
  const hasFilters =
    Boolean(value.search.trim()) ||
    Boolean(value.status) ||
    Boolean(value.plan);

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

  return (
    <section
      aria-label="Filtros de solicitudes"
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
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
            onClick={reset}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/35 transition hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={12} />
            Limpiar
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_180px]">
        <label className="relative block min-w-0">
          <span className="sr-only">
            Buscar solicitudes
          </span>

          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            value={value.search}
            onChange={(event) =>
              update("search", event.target.value)
            }
            disabled={disabled}
            placeholder="Buscar restaurante, propietario, correo..."
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-orange-400/30 focus:ring-2 focus:ring-orange-400/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="sr-only">
            Filtrar por estado
          </span>

          <select
            value={value.status}
            onChange={(event) =>
              update("status", event.target.value)
            }
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#111] px-3 text-sm text-white/65 outline-none transition focus:border-orange-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">
            Filtrar por plan
          </span>

          <select
            value={value.plan}
            onChange={(event) =>
              update("plan", event.target.value)
            }
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#111] px-3 text-sm text-white/65 outline-none transition focus:border-orange-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PLAN_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}