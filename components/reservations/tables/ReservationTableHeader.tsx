"use client";

import { CalendarDays } from "lucide-react";

export function ReservationTableHeader() {
  const columns = [
    {
      label: "Cliente",
      className: "text-left",
    },
    {
      label: "Fecha",
      className: "text-left",
    },
    {
      label: "Horario",
      className: "text-left",
    },
    {
      label: "Personas",
      className: "text-center",
    },
    {
      label: "Mesa",
      className: "text-center",
    },
    {
      label: "Tipo",
      className: "text-center",
    },
    {
      label: "Notas",
      className: "text-left",
    },
    {
      label: "Estado",
      className: "text-center",
    },
    {
      label: "Acciones",
      className: "text-center",
    },
  ];

  return (
    <thead className="border-b border-zinc-200 bg-zinc-50/90">
      <tr>
        {columns.map((column, index) => (
          <th
            key={column.label}
            scope="col"
            className={`
              whitespace-nowrap
              px-4
              py-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-zinc-500
              ${column.className}
            `}
          >
            {index === 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-orange-500" />
                {column.label}
              </span>
            ) : (
              column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}