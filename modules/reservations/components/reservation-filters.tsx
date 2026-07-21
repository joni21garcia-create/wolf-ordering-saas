"use client";

import { useState } from "react";

import {
  ReservationStatus,
} from "@/types/reservations";

import {
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

interface ReservationFiltersProps {
  onChange: (filters: {
    search?: string;
    date?: string;
    status?: ReservationStatus;
    minGuests?: number;
  }) => void;
}

export function ReservationFilters({
  onChange,
}: ReservationFiltersProps) {
  const [filters, setFilters] =
    useState({
      search: "",
      date: "",
      status: "",
      minGuests: "",
    });

  function update(
    key: string,
    value: any
  ) {
    const next = {
      ...filters,
      [key]: value,
    };

    setFilters(next);

    onChange({
      search:
        next.search || undefined,

      date:
        next.date || undefined,

      status:
        next.status
          ? (next.status as ReservationStatus)
          : undefined,

      minGuests:
        next.minGuests
          ? Number(next.minGuests)
          : undefined,
    });
  }

  return (
    <div
      className="
        rounded-lg
        border
        bg-white
        p-5
      "
    >
      <div
        className="
          grid
          gap-4
          md:grid-cols-4
        "
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Buscar
          </label>

          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Nombre o teléfono"
            value={filters.search}
            onChange={(e) =>
              update(
                "search",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Fecha
          </label>

          <input
            type="date"
            className="w-full rounded border px-3 py-2"
            value={filters.date}
            onChange={(e) =>
              update(
                "date",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Estado
          </label>

          <select
            className="w-full rounded border px-3 py-2"
            value={filters.status}
            onChange={(e) =>
              update(
                "status",
                e.target.value
              )
            }
          >
            <option value="">
              Todos
            </option>

            {Object.values(
              ReservationStatus
            ).map((status) => (
              <option
                key={status}
                value={status}
              >
                {
                  RESERVATION_STATUS_LABELS[
                    status
                  ]
                }
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Personas
          </label>

          <input
            type="number"
            min={1}
            className="w-full rounded border px-3 py-2"
            value={filters.minGuests}
            onChange={(e) =>
              update(
                "minGuests",
                e.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

