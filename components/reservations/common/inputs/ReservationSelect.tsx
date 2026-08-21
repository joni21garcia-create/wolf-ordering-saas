"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";

export interface ReservationSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const ReservationSelect = forwardRef<
  HTMLSelectElement,
  ReservationSelectProps
>(({ label, error, className, children, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-[0.08em] text-zinc-700">
          {label}
        </label>
      )}

      <select
        ref={ref}
        className={clsx(
          "w-full rounded-xl border px-4 py-3.5 text-[15px] font-medium",
          "bg-white text-zinc-950 border-zinc-300 shadow-sm outline-none transition",
          "hover:border-zinc-400",
          "focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
});

ReservationSelect.displayName = "ReservationSelect";

export default ReservationSelect;