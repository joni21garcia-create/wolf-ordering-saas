"use client";

import { useEffect, useState } from "react";

import {
  getReservationStatistics,
} from "../actions";

interface ReservationStatisticsProps {
  restaurantId: string;
}

export function ReservationStatistics({
  restaurantId,
}: ReservationStatisticsProps) {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {

    load();

  }, [restaurantId]);

  async function load() {

    try {

      setLoading(true);

      const data =
        await getReservationStatistics(
          restaurantId
        );

      setStats(data);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <div className="rounded-lg border bg-white p-6">
        Cargando estadísticas...
      </div>
    );

  }

  if (!stats) {

    return (
      <div className="rounded-lg border bg-white p-6">
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
        md:grid-cols-2
        xl:grid-cols-4
      "
    >

      {cards.map(card => (

        <div
          key={card.title}
          className="
            rounded-lg
            border
            bg-white
            p-5
          "
        >

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {card.title}
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {card.value}
          </h2>

        </div>

      ))}

    </div>

  );

}

