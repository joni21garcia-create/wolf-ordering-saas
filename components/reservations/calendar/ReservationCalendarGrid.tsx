"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Plus,
  Users,
} from "lucide-react";

import type {
  ReservationCalendarEvent,
} from "@/types/reservations";

import { updateReservation } from "@/modules/reservations/actions";

interface ReservationCalendarGridProps {
  events: ReservationCalendarEvent[];
  date?: string;
  onSelectReservation?: (
    reservationId: string
  ) => void;
  onCreateReservation?: (
    start: string,
    end: string
  ) => void;
}

/* ============================================================================
 * STATUS
 * ========================================================================== */

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#22c55e",
  pending: "#f59e0b",
  checked_in: "#3b82f6",
  completed: "#6b7280",
  cancelled: "#ef4444",
  no_show: "#a855f7",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  checked_in: "Check-in",
  completed: "Finalizada",
  cancelled: "Cancelada",
  no_show: "No Show",
};

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateToKey(date: Date) {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
}

function parseDateKey(value?: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return null;
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseCalendarDate(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) {
    return new Date();
  }

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
}

function formatTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  const match = value.match(
    /(?:T|\s)(\d{2}):(\d{2})/
  );

  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  return value.slice(0, 5);
}

function formatDateLabel(value: string) {
  const date = parseCalendarDate(value);

  return new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatShortDate(value: string) {
  const date = parseCalendarDate(value);

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getEventDateKey(
  event: ReservationCalendarEvent
) {
  return parseDateKey(event.start) ?? "";
}

function getEventEndTime(
  event: ReservationCalendarEvent
) {
  const runtimeEvent = event as ReservationCalendarEvent & {
    durationMinutes?: number;
    endTime?: string;
  };

  if (event.end) {
    return formatTime(event.end);
  }

  if (runtimeEvent.endTime) {
    return formatTime(runtimeEvent.endTime);
  }

  if (runtimeEvent.durationMinutes) {
    const start = event.start
      ? new Date(event.start)
      : null;

    if (
      start &&
      !Number.isNaN(start.getTime())
    ) {
      const end = new Date(
        start.getTime() +
          runtimeEvent.durationMinutes * 60 * 1000
      );

      return `${pad(end.getHours())}:${pad(
        end.getMinutes()
      )}`;
    }
  }

  return null;
}

function resolveEventEnd(event: ReservationCalendarEvent) {
  const runtimeEvent = event as ReservationCalendarEvent & {
    durationMinutes?: number;
    endTime?: string;
  };

  if (event.end) return event.end;

  if (runtimeEvent.endTime) {
    const start = event.start;
    const datePart = start?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (datePart) return `${datePart}T${runtimeEvent.endTime}`;
  }

  if (runtimeEvent.durationMinutes && event.start) {
    const start = new Date(event.start);
    if (!Number.isNaN(start.getTime())) {
      return new Date(
        start.getTime() + runtimeEvent.durationMinutes * 60 * 1000
      ).toISOString();
    }
  }

  return undefined;
}

function getStatusColor(status?: string) {
  return (
    STATUS_COLORS[status ?? ""] ??
    "#6366f1"
  );
}

function getStatusLabel(status?: string) {
  return (
    STATUS_LABELS[status ?? ""] ??
    status ??
    "Pendiente"
  );
}

/* ============================================================================
 * MOBILE AGENDA
 * ========================================================================== */

interface MobileAgendaProps {
  events: ReservationCalendarEvent[];
  date?: string;
  onSelectReservation?: (
    reservationId: string
  ) => void;
  onCreateReservation?: (
    start: string,
    end: string
  ) => void;
}

function MobileAgenda({
  events,
  onSelectReservation,
  onCreateReservation,
}: MobileAgendaProps) {
  const firstEventDate =
    events.length > 0
      ? parseDateKey(events[0].start)
      : null;

  const initialDate = firstEventDate
    ? parseCalendarDate(firstEventDate)
    : new Date();

  const [selectedDate, setSelectedDate] =
    useState<Date>(initialDate);

  const selectedDateKey =
    dateToKey(selectedDate);

  const dayEvents = useMemo(() => {
    return [...events]
      .filter(
        (event) =>
          getEventDateKey(event) ===
          selectedDateKey
      )
      .sort((a, b) => {
        const aTime = a.start ?? "";
        const bTime = b.start ?? "";

        return aTime.localeCompare(bTime);
      });
  }, [events, selectedDateKey]);

  function goPreviousDay() {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }

  function goNextDay() {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }

  function goToday() {
    setSelectedDate(new Date());
  }

  function handleCreateReservation() {
    if (!onCreateReservation) {
      return;
    }

    const start = new Date(selectedDate);
    start.setHours(12, 0, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 90);

    onCreateReservation(
      start.toISOString(),
      end.toISOString()
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-zinc-800 bg-zinc-900/95 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold capitalize text-white">
                {formatDateLabel(selectedDateKey)}
              </h2>

              <p className="mt-0.5 text-xs text-zinc-500">
                {dayEvents.length === 0
                  ? "Sin reservas"
                  : `${dayEvents.length} ${
                      dayEvents.length === 1
                        ? "reserva"
                        : "reservas"
                    }`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToday}
            className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 transition active:scale-95 hover:bg-zinc-700"
          >
            Hoy
          </button>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* DAY NAVIGATION */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={goPreviousDay}
            aria-label="Día anterior"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 transition active:scale-95 hover:bg-zinc-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5">
            <span className="truncate text-sm font-medium capitalize text-zinc-300">
              {formatShortDate(selectedDateKey)}
            </span>
          </div>

          <button
            type="button"
            onClick={goNextDay}
            aria-label="Día siguiente"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 transition active:scale-95 hover:bg-zinc-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* AGENDA */}
      {/* ------------------------------------------------------------------ */}

      {dayEvents.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
            <CalendarDays className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-white">
            No hay reservas este día
          </h3>

          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-zinc-500">
            No existen reservas programadas para{" "}
            {formatDateLabel(selectedDateKey)}.
          </p>

          {onCreateReservation ? (
            <button
              type="button"
              onClick={handleCreateReservation}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition active:scale-[0.98] hover:bg-orange-400"
            >
              <Plus className="h-4 w-4" />
              Nueva reserva
            </button>
          ) : null}
        </div>
      ) : (
        <MobileAgendaByHour
          events={dayEvents}
          onSelectReservation={onSelectReservation}
        />
      )}
    </div>
  );
}

/* ============================================================================
 * MOBILE HOUR ACCORDION
 * ========================================================================== */

interface MobileAgendaByHourProps {
  events: ReservationCalendarEvent[];
  date?: string;
  onSelectReservation?: (reservationId: string) => void;
}

function MobileAgendaByHour({
  events,
  onSelectReservation,
}: MobileAgendaByHourProps) {
  const groups = useMemo(() => {
    const map = new Map<string, ReservationCalendarEvent[]>();

    for (const event of events) {
      const hour = formatTime(event.start);
      const current = map.get(hour) ?? [];
      current.push(event);
      map.set(hour, current);
    }

    return Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [events]);

  // Todas las horas empiezan cerradas. Solo una puede abrirse a la vez.
  const [openHour, setOpenHour] = useState<string | null>(null);

  return (
    <div className="divide-y divide-zinc-800">
      {groups.map(([hour, hourEvents]) => {
        const isOpen = openHour === hour;

        const statusCounts = hourEvents.reduce(
          (counts, event) => {
            const status = event.status ?? "pending";
            counts[status] = (counts[status] ?? 0) + 1;
            return counts;
          },
          {} as Record<string, number>
        );

        return (
          <section key={hour}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenHour((current) =>
                  current === hour ? null : hour
                )
              }
              className="
                flex w-full items-center gap-3 px-4 py-3.5
                text-left transition
                active:bg-zinc-800/70
                hover:bg-zinc-900
              "
            >
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <span className="text-sm font-bold text-white">
                  {hour}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100">
                    {hourEvents.length}{" "}
                    {hourEvents.length === 1
                      ? "reserva"
                      : "reservas"}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-zinc-600" />

                  <span className="truncate text-xs text-zinc-500">
                    {Object.entries(statusCounts)
                      .map(
                        ([status, count]) =>
                          `${count} ${getStatusLabel(status).toLowerCase()}`
                      )
                      .join(" · ")}
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Toca para {isOpen ? "ocultar" : "ver"} las reservas
                </p>
              </div>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-orange-400" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-2 border-t border-zinc-800/80 bg-zinc-950/60 px-3 py-3">
                  {hourEvents.map((event) => (
                    <MobileAgendaReservation
                      key={event.reservationId}
                      event={event}
                      onSelectReservation={onSelectReservation}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

interface MobileAgendaReservationProps {
  event: ReservationCalendarEvent;
  onSelectReservation?: (reservationId: string) => void;
}

function MobileAgendaReservation({
  event,
  onSelectReservation,
}: MobileAgendaReservationProps) {
  const status = event.status ?? "pending";
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  const tables = event.tableNames?.filter(Boolean) ?? [];
  const tableText =
    tables.length > 0 ? tables.join(", ") : "Sin mesa";

  const guestName =
    event.guestName ?? event.title ?? "Sin nombre";

  const endTime = getEventEndTime(event);

  return (
    <button
      type="button"
      onClick={() =>
        onSelectReservation?.(event.reservationId)
      }
      className="
        group flex w-full gap-3 rounded-xl border
        border-zinc-800 bg-zinc-900 p-3 text-left
        transition active:scale-[0.995]
        active:bg-zinc-800 hover:border-zinc-700
      "
    >
      <div className="flex w-10 shrink-0 flex-col items-center pt-0.5">
        <span className="text-[11px] font-bold text-zinc-300">
          {formatTime(event.start)}
        </span>

        {endTime ? (
          <span className="mt-0.5 text-[10px] text-zinc-600">
            {endTime}
          </span>
        ) : null}

        <span
          className="mt-2 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">
              {guestName}
            </h3>

            {event.typeName ? (
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                {event.typeName}
              </p>
            ) : null}
          </div>

          <span
            className="shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold"
            style={{
              color: statusColor,
              borderColor: `${statusColor}55`,
              backgroundColor: `${statusColor}15`,
            }}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-2 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Users className="h-3 w-3 text-zinc-500" />
            {event.guests ?? 0}{" "}
            {event.guests === 1 ? "persona" : "personas"}
          </span>

          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-zinc-500" />
            <span className="truncate">{tableText}</span>
          </span>
        </div>

        <div className="mt-1.5 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-600">
          {event.tableZone ? (
            <span className="truncate">
              Zona {event.tableZone}
            </span>
          ) : null}

          {event.phone ? (
            <span className="flex min-w-0 items-center gap-1">
              <Phone className="h-3 w-3 shrink-0" />
              <span className="truncate">{event.phone}</span>
            </span>
          ) : null}

          {event.durationMinutes ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.durationMinutes} min
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

/* ============================================================================
 * DESKTOP CALENDAR
 * ========================================================================== */

export function ReservationCalendarGrid({
  events,
  date,
  onSelectReservation,
  onCreateReservation,
}: ReservationCalendarGridProps) {
  const calendarEvents = useMemo<EventInput[]>(
    () =>
      events.map((event) => {
        const color =
          STATUS_COLORS[event.status] ??
          "#6366f1";

        const tableNames =
          event.tableNames?.filter(Boolean) ??
          [];

        return {
          id: event.reservationId,
          title: event.title,
          start: event.start,
          end: resolveEventEnd(event),
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            reservationId:
              event.reservationId,
            status: event.status,
            guests: event.guests,
            guestName:
              event.guestName ??
              event.title,
            phone: event.phone,
            tableNames,
            tableZone: event.tableZone,
            durationMinutes:
              event.durationMinutes,
            typeName: event.typeName,
            customerNotes:
              event.customerNotes,
            checkedIn: event.checkedIn,
          },
        };
      }),
    [events]
  );

  function handleEventClick(
    info: EventClickArg
  ) {
    const reservationId =
      info.event.extendedProps
        ?.reservationId ??
      info.event.id;

    if (!reservationId) {
      return;
    }

    onSelectReservation?.(
      String(reservationId)
    );
  }

  async function handleEventDrop(
    info: EventDropArg
  ) {
    const reservationId =
      info.event.extendedProps
        ?.reservationId ??
      info.event.id;

    if (!reservationId) {
      info.revert();
      return;
    }

    const status =
      String(
        info.event.extendedProps?.status ??
          ""
      );

    const lockedStatuses = new Set([
      "completed",
      "cancelled",
      "no_show",
      "rejected",
      "expired",
    ]);

    if (lockedStatuses.has(status)) {
      info.revert();
      return;
    }

    const start = info.event.start;

    if (!start) {
      info.revert();
      return;
    }

    const end =
      info.event.end ??
      new Date(
        start.getTime() +
          90 * 60 * 1000
      );

    const date =
      `${start.getFullYear()}-${pad(
        start.getMonth() + 1
      )}-${pad(start.getDate())}`;

    const startTime =
      `${pad(start.getHours())}:${pad(
        start.getMinutes()
      )}:00`;

    const endTime =
      `${pad(end.getHours())}:${pad(
        end.getMinutes()
      )}:00`;

    const durationMinutes = Math.max(
      1,
      Math.round(
        (end.getTime() -
          start.getTime()) /
          60000
      )
    );

    try {
      const result =
        await updateReservation(
          String(reservationId),
          {
            datetime: {
              date,
              startTime,
              endTime,
              timezone:
                "America/Guayaquil",
              durationMinutes,
            },
          }
        );

      if (!result?.success) {
        throw new Error(
          "No se pudo actualizar la reserva."
        );
      }
    } catch (error) {
      console.error(
        "Error al mover la reserva:",
        error
      );

      info.revert();

      if (
        typeof window !== "undefined"
      ) {
        window.alert(
          "No se pudo mover la reserva a ese horario. Se restauró su posición anterior."
        );
      }
    }
  }

  function handleDateSelect(
    selection: DateSelectArg
  ) {
    onCreateReservation?.(
      selection.start.toISOString(),
      selection.end.toISOString()
    );
  }

  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    if (!date) return;
    calendarRef.current?.getApi().gotoDate(date);
  }, [date]);

  return (
    <div className="w-full">
      {/* ================================================================== */}
      {/* MOBILE */}
      {/* ================================================================== */}

      <div className="block md:hidden">
        <MobileAgenda
          events={events}
          onSelectReservation={
            onSelectReservation
          }
          onCreateReservation={
            onCreateReservation
          }
        />
      </div>

      {/* ================================================================== */}
      {/* DESKTOP */}
      {/* ================================================================== */}

      <div className="hidden md:block">
        <div className="reservation-calendar overflow-hidden rounded-xl bg-white p-2 sm:p-3 md:p-4">
          <style jsx global>{`
            .reservation-calendar .fc {
              --fc-border-color: #e4e4e7;
              --fc-page-bg-color: #ffffff;
              --fc-neutral-bg-color: #fafafa;
              --fc-today-bg-color: #fff7ed;
              --fc-list-event-hover-bg-color: #fafafa;
              color: #18181b;
              font-family: inherit;
            }
            .reservation-calendar .fc-toolbar {
              gap: 12px;
              flex-wrap: wrap;
              padding: 4px 2px 14px;
              border-bottom: 1px solid #e4e4e7;
            }
            .reservation-calendar .fc-toolbar-title {
              font-size: 1rem;
              font-weight: 800;
              color: #18181b;
              text-transform: capitalize;
            }
            .reservation-calendar .fc-button {
              border: 1px solid #d4d4d8 !important;
              background: #ffffff !important;
              color: #27272a !important;
              box-shadow: none !important;
              border-radius: 10px !important;
              font-weight: 700;
            }
            .reservation-calendar .fc-button:hover,
            .reservation-calendar .fc-button:focus {
              background: #f4f4f5 !important;
              color: #18181b !important;
            }
            .reservation-calendar .fc-button-primary:not(:disabled).fc-button-active {
              background: #18181b !important;
              border-color: #18181b !important;
              color: #ffffff !important;
            }
            .reservation-calendar .fc-col-header-cell {
              background: #fafafa;
              padding: 5px 0;
            }
            .reservation-calendar .fc-timegrid-axis {
              background: #fafafa;
            }
            .reservation-calendar .fc-timegrid-slot-label {
              color: #52525b;
              font-size: 11px;
              font-weight: 700;
              padding-right: 8px;
            }
            .reservation-calendar .fc-timegrid-slot {
              height: 34px;
            }
            .reservation-calendar .fc-timegrid-now-indicator-line {
              border-color: #f97316;
              border-width: 2px;
            }
            .reservation-calendar .fc-timegrid-now-indicator-arrow {
              border-top-color: #f97316;
              border-bottom-color: #f97316;
            }
            .reservation-calendar .fc-event {
              border-radius: 8px;
              border-width: 1px;
              box-shadow: 0 2px 5px rgba(24,24,27,.08);
              cursor: pointer;
            }
            .reservation-calendar .fc-scrollgrid {
              border-radius: 12px;
              overflow: hidden;
            }
            @media (max-width: 767px) {
              .reservation-calendar .fc-toolbar {
                padding-bottom: 10px;
              }
              .reservation-calendar .fc-toolbar-title {
                font-size: .9rem;
              }
            }
          `}</style>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"
            initialDate={date}
            height="auto"
            locale={esLocale}
            selectable={Boolean(
              onCreateReservation
            )}
            selectMirror={true}
            nowIndicator={true}
            editable={true}
            eventResizableFromStart={false}
            eventDurationEditable={false}
            dayMaxEvents={4}
            slotMinTime="07:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            allDaySlot={false}
            expandRows={true}
            eventDisplay="block"
            slotEventOverlap={false}
            eventMinHeight={28}
            events={calendarEvents}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            select={handleDateSelect}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            dayHeaderContent={(arg) => {
              const dayName = new Intl.DateTimeFormat("es-EC", {
                weekday: "short",
              }).format(arg.date).replace(".", "");
              const dayNumber = new Intl.DateTimeFormat("es-EC", {
                day: "numeric",
              }).format(arg.date);
              return (
                <div className="flex flex-col items-center py-1 leading-tight">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    {dayName}
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-zinc-900">
                    {dayNumber}
                  </span>
                </div>
              );
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventContent={(arg) => {
              const props =
                arg.event.extendedProps as {
                  status?: string;
                  guests?: number;
                  guestName?: string;
                  phone?: string;
                  tableNames?: string[];
                  tableZone?: string;
                  durationMinutes?: number;
                  typeName?: string;
                  checkedIn?: boolean;
                };

              const status =
                props.status ?? "pending";

              const statusLabel =
                STATUS_LABELS[status] ??
                status;

              const tables =
                props.tableNames?.filter(
                  Boolean
                ) ?? [];

              const guestName =
                props.guestName ??
                arg.event.title;

              const isMonthView =
                arg.view.type ===
                "dayGridMonth";

              const isDayView =
                arg.view.type ===
                "timeGridDay";

              const tableText =
                tables.length > 0
                  ? tables.join(", ")
                  : "Sin mesa";

              const timeText =
                arg.timeText || "";

              if (isMonthView) {
                return (
                  <div
                    title={[
                      guestName,
                      props.guests
                        ? `${props.guests} personas`
                        : null,
                      tableText,
                      props.phone ?? null,
                      statusLabel,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    className="flex min-w-0 items-center gap-1 overflow-hidden rounded px-1 py-0.5 text-[10px] leading-tight text-white"
                  >
                    <span className="shrink-0 font-semibold">
                      {timeText}
                    </span>

                    <span className="min-w-0 truncate font-medium">
                      {guestName}
                    </span>

                    {props.guests ? (
                      <span className="shrink-0 opacity-90">
                        · {props.guests}
                      </span>
                    ) : null}
                  </div>
                );
              }

              return (
                <div
                  title={[
                    guestName,
                    props.guests
                      ? `${props.guests} personas`
                      : null,
                    tableText,
                    props.tableZone
                      ? `Zona ${props.tableZone}`
                      : null,
                    props.phone ?? null,
                    props.typeName ?? null,
                    statusLabel,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  className="flex h-full min-w-0 flex-col overflow-hidden rounded-md px-1.5 py-1 text-white shadow-sm"
                >
                  <div className="flex min-w-0 items-center justify-between gap-1 text-[10px] font-semibold leading-tight">
                    <span className="shrink-0">
                      {timeText}
                    </span>

                    <span className="shrink-0 rounded bg-black/15 px-1 py-0.5 text-[9px] font-medium">
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-0.5 min-w-0 truncate text-[11px] font-bold leading-tight sm:text-xs">
                    {guestName}
                  </div>

                  <div className="mt-0.5 flex min-w-0 flex-wrap gap-x-2 gap-y-0.5 text-[9px] leading-tight text-white/90 sm:text-[10px]">
                    {props.guests ? (
                      <span className="shrink-0">
                        👥 {props.guests}
                      </span>
                    ) : null}

                    {tables.length > 0 ? (
                      <span className="min-w-0 truncate">
                        🪑 {tableText}
                      </span>
                    ) : null}

                    {isDayView &&
                    props.durationMinutes ? (
                      <span className="shrink-0">
                        ⏱{" "}
                        {props.durationMinutes}{" "}
                        min
                      </span>
                    ) : null}
                  </div>

                  {isDayView &&
                  props.phone ? (
                    <div className="mt-0.5 truncate text-[9px] text-white/75">
                      📞 {props.phone}
                    </div>
                  ) : null}
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}