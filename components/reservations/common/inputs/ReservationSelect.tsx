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
        <label className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}

      <select
        ref={ref}
        className={clsx(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition",
          "border-zinc-200",
          "focus:border-orange-500 focus:ring-4 focus:ring-orange-100",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

ReservationSelect.displayName = "ReservationSelect";

export default ReservationSelect;


