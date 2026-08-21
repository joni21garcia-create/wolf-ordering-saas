"use client";

import {
  forwardRef,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

export interface ReservationTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const ReservationTextarea = forwardRef<
  HTMLTextAreaElement,
  ReservationTextareaProps
>(
  (
    {
      label,
      error,
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

        <textarea
          ref={ref}
          rows={4}
          className={clsx(
            "w-full resize-none rounded-xl border px-4 py-3 text-sm text-white outline-none transition",
            "border-zinc-700 bg-zinc-900",
            "placeholder:text-zinc-500",
            "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs font-medium text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ReservationTextarea.displayName =
  "ReservationTextarea";

export default ReservationTextarea;