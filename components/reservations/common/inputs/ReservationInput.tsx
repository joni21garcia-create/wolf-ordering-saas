"use client";

import {
  forwardRef,
  InputHTMLAttributes,
} from "react";
import clsx from "clsx";

export interface ReservationInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const ReservationInput = forwardRef<
  HTMLInputElement,
  ReservationInputProps
>(
  (
    {
      label,
      error,
      hint,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-zinc-200">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={clsx(
            "w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition",
            "border-zinc-700 bg-zinc-900",
            "placeholder:text-zinc-500",
            "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p className="text-xs text-zinc-400">
            {hint}
          </p>
        )}

        {error && (
          <p className="text-xs font-medium text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ReservationInput.displayName =
  "ReservationInput";

export default ReservationInput;