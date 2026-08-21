"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ReservationStatus,
} from "@/types/reservations";

import {
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

export interface ReservationFilterValues {
  search?: string;
  date?: string;
  status?: ReservationStatus;
  minGuests?: number;
}

interface ReservationFiltersProps {
  onChange: (
    filters: ReservationFilterValues
  ) => void;
  initialFilters?: ReservationFilterValues;
}

export function ReservationFilters({
  onChange,
  initialFilters,
}: ReservationFiltersProps) {
  const [search, setSearch] =
    useState(
      initialFilters?.search ?? ""
    );

  const [date, setDate] =
    useState(
      initialFilters?.date ?? ""
    );

  const [status, setStatus] =
    useState<
      ReservationStatus | ""
    >(
      initialFilters?.status ?? ""
    );

  const [minGuests, setMinGuests] =
    useState(
      initialFilters?.minGuests
        ? String(initialFilters.minGuests)
        : ""
    );

  const filters = useMemo(
    () => ({
      search:
        search.trim() || undefined,

      date:
        date || undefined,

      status:
        status || undefined,

      minGuests:
        minGuests &&
        Number(minGuests) > 0
          ? Number(minGuests)
          : undefined,
    }),
    [
      search,
      date,
      status,
      minGuests,
    ]
  );

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  function clearFilters() {
    setSearch("");
    setDate("");
    setStatus("");
    setMinGuests("");
  }

  const hasFilters =
    Boolean(
      search ||
      date ||
      status ||
      minGuests
    );

  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-4
        shadow-sm
        sm:p-5
      "
    >
      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(170px,1fr)_minmax(120px,0.7fr)_auto]
          xl:items-end
        "
      >
        <div>
          <label
            htmlFor="reservation-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Buscar
          </label>

          <input
            id="reservation-search"
            type="search"
            className="
              w-full
              rounded-xl
              border
              px-3
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-gray-400
              focus:ring-2
              focus:ring-gray-200
            "
            placeholder="Nombre, teléfono o email"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <div>
          <label
            htmlFor="reservation-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>

          <input
            id="reservation-date"
            type="date"
            className="
              w-full
              rounded-xl
              border
              px-3
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-gray-400
              focus:ring-2
              focus:ring-gray-200
            "
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
          />
        </div>

        <div>
          <label
            htmlFor="reservation-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Estado
          </label>

          <select
            id="reservation-status"
            className="
              w-full
              rounded-xl
              border
              bg-white
              px-3
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-gray-400
              focus:ring-2
              focus:ring-gray-200
            "
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | ReservationStatus
                  | ""
              )
            }
          >
            <option value="">
              Todos los estados
            </option>

            {Object.values(
              ReservationStatus
            ).map((value) => (
              <option
                key={value}
                value={value}
              >
                {
                  RESERVATION_STATUS_LABELS[
                    value
                  ]
                }
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="reservation-guests"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Personas mínimas
          </label>

          <input
            id="reservation-guests"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            className="
              w-full
              rounded-xl
              border
              px-3
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-gray-400
              focus:ring-2
              focus:ring-gray-200
            "
            placeholder="Ej. 4"
            value={minGuests}
            onChange={(event) =>
              setMinGuests(
                event.target.value
              )
            }
          />
        </div>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="
            rounded-xl
            border
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}