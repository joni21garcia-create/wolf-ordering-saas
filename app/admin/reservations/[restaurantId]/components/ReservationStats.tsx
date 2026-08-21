"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock3,
  CircleCheckBig,
  UtensilsCrossed,
} from "lucide-react";

import { getReservationStatistics } from "@/modules/reservations/actions";

interface ReservationStatsProps {
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

export default function ReservationStats({
  restaurantId,
}: ReservationStatsProps) {
  const [stats, setStats] =
    useState<Statistics | null>(null);

  useEffect(() => {
    async function load() {
      const data =
        await getReservationStatistics(
          restaurantId
        );

      setStats(data);
    }

    load();
  }, [restaurantId]);

  if (!stats) {
    return (
      <section className="w-full">
        <div className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-400">
          Cargando estadísticas...
        </div>
      </section>
    );
  }

  const items = [
    {
      title: "Reservas",
      value: stats.total,
      description: "Total registradas",
      icon: CalendarCheck,
      color: "text-blue-400",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      description: "Esperando confirmación",
      icon: Clock3,
      color: "text-yellow-400",
    },
    {
      title: "Confirmadas",
      value: stats.confirmed,
      description: "Reservas confirmadas",
      icon: CircleCheckBig,
      color: "text-emerald-400",
    },
    {
      title: "Ocupación",
      value: `${stats.occupancyPercentage}%`,
      description: `${stats.checkedIn} en check-in`,
      icon: UtensilsCrossed,
      color: "text-orange-400",
    },
  ];

  return (
    <section className="w-full">
      {/* Mobile: compact horizontal summary */}
      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          md:hidden
        "
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex min-w-[118px] shrink-0 items-center gap-2.5
                rounded-xl border border-white/10
                bg-zinc-900/65 px-3 py-2.5
                backdrop-blur
              "
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${item.color}`}
              />

              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-zinc-500">
                  {item.title}
                </p>

                <p className="text-lg font-bold leading-5 text-white">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: compact indicators */}
      <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex items-center gap-3
                rounded-2xl border border-white/10
                bg-zinc-900/60 px-4 py-3.5
                backdrop-blur
              "
            >
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl bg-white/5
                "
              >
                <Icon
                  className={`h-5 w-5 ${item.color}`}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs text-zinc-500">
                  {item.title}
                </p>

                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold leading-none text-white">
                    {item.value}
                  </p>

                  <p className="hidden truncate text-xs text-zinc-500 lg:block">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}