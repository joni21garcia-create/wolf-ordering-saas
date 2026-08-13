"use client";

import type { CustomerOrderTimelineEvent } from "../../types/customerOrder";

interface OrderTimelineProps {
  events: CustomerOrderTimelineEvent[];
}

function formatTime(value: string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function OrderTimeline({
  events,
}: OrderTimelineProps) {
  if (!events.length) {
    return null;
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const time = formatTime(event.timestamp);

        return (
          <div
            key={`${event.status}-${index}`}
            className="relative flex gap-3"
          >
            {/* =====================================================
                LÍNEA — base + relleno animado
                ===================================================== */}
            {!isLast && (
              <span
                className="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px overflow-hidden rounded-full bg-neutral-200"
                aria-hidden="true"
              >
                <span
                  className={`
                    absolute inset-x-0 top-0 w-full origin-top rounded-full
                    transition-transform duration-700 ease-out
                    ${
                      event.completed
                        ? "scale-y-100 bg-orange-300"
                        : "scale-y-0 bg-orange-300"
                    }
                  `}
                />
              </span>
            )}

            {/* =====================================================
                PUNTO
                ===================================================== */}
            <div className="relative z-10 flex h-3 w-3 shrink-0 items-center justify-center">
              {event.current && (
                <span
                  className="
                    absolute h-5 w-5 rounded-full
                    bg-orange-400/20
                    animate-ping
                  "
                  aria-hidden="true"
                />
              )}

              <span
                className={`
                  relative h-2.5 w-2.5 rounded-full border-2
                  transition-all duration-500
                  ease-out
                  ${
                    event.current
                      ? "scale-110 border-orange-500 bg-orange-500 shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
                      : event.completed
                        ? "scale-100 border-orange-500 bg-orange-500"
                        : "scale-100 border-neutral-300 bg-white"
                  }
                `}
                aria-hidden="true"
              />
            </div>

            {/* =====================================================
                CONTENIDO
                ===================================================== */}
            <div
              className={`
                min-w-0 flex-1 pb-5
                transition-all duration-700
                ease-out
                ${
                  event.current
                    ? "translate-x-0 opacity-100"
                    : event.completed
                      ? "translate-x-0 opacity-80"
                      : "translate-x-0 opacity-45"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`
                    text-sm transition-all duration-500
                    ease-out
                    ${
                      event.current
                        ? "font-semibold text-neutral-900"
                        : "font-medium text-neutral-700"
                    }
                  `}
                >
                  {event.label}
                </p>

                {time && (
                  <span
                    className="
                      shrink-0 text-[11px] text-neutral-400
                      transition-opacity duration-500
                    "
                  >
                    {time}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}


    </div>
  );
}

export default OrderTimeline;