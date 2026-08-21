"use client";

import { useEffect, useState } from "react";

import {
  getReservationStatistics,
} from "../actions";

interface ReservationStatisticsProps {
  restaurantId: string;
}

interface Statistics {
  total: number;
  pending: number;
  confirmed: number;
  checkedIn: number;
  finished: number;
  cancelled: number;
  noShow: number;
  occupancyPercentage: number;
}

export function ReservationStatistics({
  restaurantId,
}: ReservationStatisticsProps) {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<Statistics | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    load();
  }, [restaurantId]);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getReservationStatistics(
          restaurantId
        );

      setStats(data);
    } catch (error) {
      console.error(
        "LOAD RESERVATION STATISTICS ERROR",
        error
      );

      setError(
        "No se pudieron cargar las estadísticas."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        Cargando estadísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <p className="font-medium text-red-600">
          {error}
        </p>

        <button
          onClick={load}
          className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        Sin información
      </div>
    );
  }

  const cards = [
    {
      title: "Reservas",
      value: stats.total,
    },
    {
      title: "Pendientes",
      value: stats.pending,
    },
    {
      title: "Confirmadas",
      value: stats.confirmed,
    },
    {
      title: "Check-in",
      value: stats.checkedIn,
    },
    {
      title: "Finalizadas",
      value: stats.finished,
    },
    {
      title: "Canceladas",
      value: stats.cancelled,
    },
    {
      title: "No Show",
      value: stats.noShow,
    },
    {
      title: "Ocupación",
      value: `${stats.occupancyPercentage}%`,
    },
  ];

  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            rounded-2xl
            border
            bg-white
            p-5
            shadow-sm
            transition
            hover:shadow-md
          "
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}