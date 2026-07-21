"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface ReservationInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const ReservationInput = forwardRef<HTMLInputElement, ReservationInputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={clsx(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition",
            "border-zinc-200",
            "focus:border-orange-500 focus:ring-4 focus:ring-orange-100",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p className="text-xs text-zinc-500">
            {hint}
          </p>
        )}

        {error && (
          <p className="text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ReservationInput.displayName = "ReservationInput";

export default ReservationInput;


