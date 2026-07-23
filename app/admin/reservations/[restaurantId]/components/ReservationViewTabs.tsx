"use client";

import { CalendarDays, Table2, Clock3 } from "lucide-react";

export type ReservationView =
    | "calendar"
    | "list"
    | "timeline";

interface Props {
    value: ReservationView;
    onChange: (view: ReservationView) => void;
}

const tabs = [
    {
        value: "calendar",
        label: "Calendario",
        icon: CalendarDays,
    },
    {
        value: "list",
        label: "Lista",
        icon: Table2,
    },
    {
        value: "timeline",
        label: "Timeline",
        icon: Clock3,
    },
] satisfies {
    value: ReservationView;
    label: string;
    icon: any;
}[];

export default function ReservationViewTabs({
    value,
    onChange,
}: Props) {
    return (
        <div className="flex gap-3">

            {tabs.map((tab) => {

                const Icon = tab.icon;

                const active = value === tab.value;

                return (

                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={`
                            flex items-center gap-2 rounded-xl px-5 py-3
                            transition-all duration-300
                            ${
                                active
                                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                    : "border border-white/10 bg-zinc-900/50 text-zinc-400 hover:border-amber-500/40 hover:text-white"
                            }
                        `}
                    >
                        <Icon size={18} />

                        {tab.label}

                    </button>

                );

            })}

        </div>
    );
}