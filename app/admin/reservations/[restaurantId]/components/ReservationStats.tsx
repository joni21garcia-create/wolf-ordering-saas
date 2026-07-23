"use client";

import {
    CalendarCheck,
    Clock3,
    CircleCheckBig,
    UtensilsCrossed,
} from "lucide-react";

const stats = [
    {
        title: "Reservas Hoy",
        value: 18,
        description: "+12% respecto ayer",
        icon: CalendarCheck,
        color: "text-blue-400",
    },
    {
        title: "Pendientes",
        value: 6,
        description: "Esperando confirmación",
        icon: Clock3,
        color: "text-yellow-400",
    },
    {
        title: "Confirmadas",
        value: 10,
        description: "56% del total",
        icon: CircleCheckBig,
        color: "text-emerald-400",
    },
    {
        title: "Ocupación",
        value: "82%",
        description: "34 de 42 mesas",
        icon: UtensilsCrossed,
        color: "text-orange-400",
    },
];

export default function ReservationStats() {
    return (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => {

                const Icon = item.icon;

                return (

                    <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-zinc-400">
                                    {item.title}
                                </p>

                                <h2 className="mt-2 text-4xl font-bold text-white">
                                    {item.value}
                                </h2>

                            </div>

                            <Icon
                                className={`h-10 w-10 ${item.color}`}
                            />

                        </div>

                        <p className="mt-5 text-sm text-zinc-500">
                            {item.description}
                        </p>

                    </div>

                );

            })}

        </section>
    );
}