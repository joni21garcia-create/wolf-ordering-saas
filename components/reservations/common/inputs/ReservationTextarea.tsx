"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export interface ReservationTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const ReservationTextarea = forwardRef<
  HTMLTextAreaElement,
  ReservationTextareaProps
>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        rows={4}
        className={clsx(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition resize-none",
          "border-zinc-200",
          "focus:border-orange-500 focus:ring-4 focus:ring-orange-100",
          error && "border-red-500",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

ReservationTextarea.displayName = "ReservationTextarea";

export default ReservationTextarea;


