"use client";

interface ReservationTableToolbarProps {
  total: number;
  /**
   * Kept for backwards compatibility with existing callers.
   * New Reservation should be triggered from the page header only.
   */
  onCreate?: () => void;
}

export function ReservationTableToolbar({
  total,
}: ReservationTableToolbarProps) {
  return (
    <div
      className="
        flex items-center justify-between gap-3
        rounded-t-2xl border border-b-0
        border-zinc-200 bg-white px-4 py-3
        sm:px-5
      "
    >
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-zinc-900 sm:text-base">
          Todas las reservas
        </h2>

        <p className="mt-0.5 text-xs text-zinc-500">
          {total} {total === 1 ? "reserva" : "reservas"} registradas
        </p>
      </div>

      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-600">
        General
      </span>
    </div>
  );
}