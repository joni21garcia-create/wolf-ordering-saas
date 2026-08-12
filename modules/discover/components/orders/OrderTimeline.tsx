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
            {/* Línea vertical */}
            {!isLast && (
              <span
                className={`
                  absolute
                  left-[5px]
                  top-3
                  h-[calc(100%-4px)]
                  w-px
                  ${
                    event.completed
                      ? "bg-orange-300"
                      : "bg-neutral-200"
                  }
                `}
                aria-hidden="true"
              />
            )}

            {/* Punto */}
            <div className="relative z-10 flex h-3 w-3 shrink-0 items-center justify-center">
              <span
                className={`
                  h-2.5
                  w-2.5
                  rounded-full
                  border-2
                  ${
                    event.current
                      ? "border-orange-500 bg-orange-500"
                      : event.completed
                        ? "border-orange-500 bg-orange-500"
                        : "border-neutral-300 bg-white"
                  }
                `}
                aria-hidden="true"
              />
            </div>

            {/* Contenido */}
            <div
              className={`
                min-w-0
                flex-1
                pb-5
                ${
                  event.current
                    ? "opacity-100"
                    : event.completed
                      ? "opacity-80"
                      : "opacity-45"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`
                    text-sm
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
                  <span className="shrink-0 text-[11px] text-neutral-400">
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