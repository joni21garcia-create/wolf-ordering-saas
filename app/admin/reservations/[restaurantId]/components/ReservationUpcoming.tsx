"use client";

import { useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Users,
  Utensils,
} from "lucide-react";

import type {
  Reservation,
} from "@/types/reservations";

import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

import ReservationUpcomingEmpty from "./empty/ReservationUpcomingEmpty";
import { WolfSheet } from "@/lib/wolf-ui";
import {
  ReservationSheetContent,
} from "@/components/reservations/tables/ReservationTable";

/* ============================================================================
 * TYPES
 * ========================================================================== */

interface ReservationUpcomingProps {
  reservations: Reservation[];
  onSelectReservation?: (
    reservationId: string
  ) => void;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function formatTime(
  reservation: Reservation
) {
  const value =
    reservation.datetime.startTime;

  if (!value) {
    return "-";
  }

  return value.slice(0, 5);
}

function formatEndTime(
  reservation: Reservation
) {
  const value =
    reservation.datetime.endTime;

  if (!value) {
    return "-";
  }

  return value.slice(0, 5);
}

function formatDate(
  reservation: Reservation
) {
  const value =
    reservation.datetime.date;

  if (!value) {
    return "-";
  }

  const [year, month, day] =
    value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }
  ).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function formatFullDate(
  reservation: Reservation
) {
  const value =
    reservation.datetime.date;

  if (!value) {
    return "-";
  }

  const [year, month, day] =
    value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  ).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function isOperationalReservation(
  reservation: Reservation
) {
  return [
    "pending",
    "confirmed",
  ].includes(
    String(reservation.status)
  );
}

function getNowKey(
  timezone: string
) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone || "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  ) as Record<string, string>;

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function isUpcomingReservation(
  reservation: Reservation
) {
  if (!isOperationalReservation(reservation)) {
    return false;
  }

  const timezone =
    reservation.datetime.timezone ||
    "America/Guayaquil";

  const startKey =
    `${reservation.datetime.date}T${reservation.datetime.startTime.slice(0, 5)}`;

  return startKey >= getNowKey(timezone);
}

/* ============================================================================
 * COMPONENT
 * ========================================================================== */

export default function ReservationUpcoming({
  reservations,
  onSelectReservation,
}: ReservationUpcomingProps) {
  const [expandedId, setExpandedId] =
    useState<string | null>(null);
    const [selectedReservation, setSelectedReservation] =
  useState<Reservation | null>(null);

  const upcoming =
    [...reservations]
      .filter(isUpcomingReservation)
      .sort(
        (a, b) =>
          `${a.datetime.date}T${a.datetime.startTime}`
            .localeCompare(
              `${b.datetime.date}T${b.datetime.startTime}`
            )
      )
      .slice(0, 8);

  /* ------------------------------------------------------------------------ */
  /* EMPTY */
  /* ------------------------------------------------------------------------ */

  if (!upcoming.length) {
    return (
      <ReservationUpcomingEmpty />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------------ */

  return (
    <aside
      className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        shadow-xl
      "
    >
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <div
        className="
          border-b
          border-zinc-800
          bg-zinc-900
          p-4
          sm:p-5
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-orange-500/10
                text-orange-400
              "
            >
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-base
                  font-semibold
                  text-white
                  sm:text-lg
                "
              >
                Próximas reservas
              </h2>

              <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
                Agenda próxima
              </p>
            </div>
          </div>

          <span
            className="
              flex
              h-8
              min-w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-zinc-700
              bg-zinc-800
              px-2
              text-xs
              font-semibold
              text-zinc-300
            "
          >
            {upcoming.length}
          </span>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RESERVATIONS */}
      {/* ================================================================== */}

      <div className="divide-y divide-zinc-800">
        {upcoming.map(
          (reservation, index) => {
            const reservationId =
              reservation.id;

            const status =
              String(
                reservation.status
              );

            const statusColor =
              RESERVATION_STATUS_COLORS[
                status as keyof typeof RESERVATION_STATUS_COLORS
              ] ??
              "border-zinc-700 bg-zinc-800 text-zinc-300";

            const statusLabel =
              RESERVATION_STATUS_LABELS[
                status as keyof typeof RESERVATION_STATUS_LABELS
              ] ??
              status;

            const isExpanded =
              expandedId ===
              reservationId;

            const tableNames =
              reservation.assignment?.tables
                ?.map(
                  (table) =>
                    table.name
                )
                .filter(Boolean) ??
              [];

            const tableText =
              tableNames.length
                ? tableNames.join(", ")
                : "Sin mesa";

            const tableZone =
              reservation.assignment?.tables
                ?.map(
                  (table) =>
                    table.zone
                )
                .filter(
                  (
                    zone
                  ): zone is string =>
                    Boolean(zone)
                )
                .join(", ");

            const guests =
              reservation.capacity
                .guests;

            return (
              <div
                key={reservationId}
                className="
                  bg-zinc-950
                  transition-colors
                  hover:bg-zinc-900/70
                "
              >
                {/* ====================================================== */}
                {/* COMPACT ROW */}
                {/* ====================================================== */}

                <button
                  type="button"
                  aria-expanded={
                    isExpanded
                  }
                  onClick={() =>
                    setExpandedId(
                      isExpanded
                        ? null
                        : reservationId
                    )
                  }
                  className="
                    flex
                    min-h-[76px]
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    transition
                    active:bg-zinc-800
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-orange-500
                    sm:px-5
                  "
                >
                  {/* -------------------------------------------------- */}
                  {/* NUMBER */}
                  {/* -------------------------------------------------- */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-zinc-800
                      text-xs
                      font-bold
                      text-zinc-400
                    "
                  >
                    {index + 1}
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* MAIN */}
                  {/* -------------------------------------------------- */}

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="
                          min-w-0
                          flex-1
                          truncate
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {
                          reservation
                            .guest
                            .fullName
                        }
                      </span>

                      <span
                        className={`
                          hidden
                          shrink-0
                          rounded-full
                          border
                          px-2
                          py-1
                          text-[10px]
                          font-semibold
                          sm:inline-flex
                          ${statusColor}
                        `}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div
                      className="
                        mt-1.5
                        flex
                        min-w-0
                        items-center
                        gap-3
                        text-xs
                        text-zinc-500
                      "
                    >
                      <span className="flex shrink-0 items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />

                        <span>
                          {formatTime(
                            reservation
                          )}
                        </span>
                      </span>

                      <span className="flex min-w-0 items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />

                        <span className="truncate">
                          {guests}{" "}
                          {guests === 1
                            ? "persona"
                            : "personas"}
                        </span>
                      </span>

                      <span className="hidden truncate md:block">
                        {formatDate(
                          reservation
                        )}
                      </span>
                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* STATUS MOBILE */}
                  {/* -------------------------------------------------- */}

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      border
                      px-2
                      py-1
                      text-[10px]
                      font-semibold
                      sm:hidden
                      ${statusColor}
                    `}
                  >
                    {statusLabel}
                  </span>

                  {/* -------------------------------------------------- */}
                  {/* CHEVRON */}
                  {/* -------------------------------------------------- */}

                  <ChevronDown
                    className={`
                      h-5
                      w-5
                      shrink-0
                      text-zinc-500
                      transition-transform
                      duration-200
                      ${
                        isExpanded
                          ? "rotate-180 text-orange-400"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ====================================================== */}
                {/* EXPANDED CONTENT */}
                {/* ====================================================== */}

                <div
                  className={`
                    grid
                    transition-[grid-template-rows]
                    duration-200
                    ease-out
                    ${
                      isExpanded
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="
                        border-t
                        border-zinc-800
                        bg-zinc-900/70
                        px-4
                        pb-4
                        pt-3
                        sm:px-5
                      "
                    >
                      {/* ------------------------------------------------ */}
                      {/* DATE */}
                      {/* ------------------------------------------------ */}

                      <div
                        className="
                          mb-3
                          flex
                          items-center
                          gap-2
                          text-xs
                          text-zinc-400
                        "
                      >
                        <CalendarDays className="h-4 w-4 text-orange-400" />

                        <span className="capitalize">
                          {formatFullDate(
                            reservation
                          )}
                        </span>
                      </div>

                      {/* ------------------------------------------------ */}
                      {/* DETAIL GRID */}
                      {/* ------------------------------------------------ */}

                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-2
                          sm:grid-cols-2
                        "
                      >
                        {/* TIME */}
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            p-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-500/10
                              text-blue-400
                            "
                          >
                            <Clock className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                              Horario
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-zinc-200">
                              {formatTime(
                                reservation
                              )}{" "}
                              –{" "}
                              {formatEndTime(
                                reservation
                              )}
                            </p>
                          </div>
                        </div>

                        {/* GUESTS */}
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            p-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-emerald-500/10
                              text-emerald-400
                            "
                          >
                            <Users className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                              Personas
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-zinc-200">
                              {guests}{" "}
                              {guests === 1
                                ? "persona"
                                : "personas"}
                            </p>
                          </div>
                        </div>

                        {/* TABLE */}
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            p-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-orange-500/10
                              text-orange-400
                            "
                          >
                            <MapPin className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                              Mesa
                            </p>

                            <p className="mt-0.5 truncate text-sm font-medium text-zinc-200">
                              {tableText}
                            </p>

                            {tableZone ? (
                              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                                Zona {tableZone}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        {/* PHONE */}
                        {reservation.guest.phone ? (
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              border
                              border-zinc-800
                              bg-zinc-950
                              p-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-violet-500/10
                                text-violet-400
                              "
                            >
                              <Phone className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                                Teléfono
                              </p>

                              <p className="mt-0.5 truncate text-sm font-medium text-zinc-200">
                                {
                                  reservation
                                    .guest
                                    .phone
                                }
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* ------------------------------------------------ */}
                      {/* TYPE */}
                      {/* ------------------------------------------------ */}

                      {reservation.typeName ? (
                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            px-3
                            py-2.5
                            text-xs
                            text-zinc-400
                          "
                        >
                          <Utensils className="h-4 w-4 shrink-0 text-zinc-500" />

                          <span className="text-zinc-500">
                            Tipo:
                          </span>

                          <span className="truncate font-medium text-zinc-300">
                            {
                              reservation.typeName
                            }
                          </span>
                        </div>
                      ) : null}

                      {/* ------------------------------------------------ */}
                      {/* ACTION */}
                      {/* ------------------------------------------------ */}

<button
  type="button"
  onClick={() =>
    setSelectedReservation(reservation)
  }
                        className="
                          mt-3
                          flex
                          min-h-11
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-orange-500
                          px-4
                          text-sm
                          font-semibold
                          text-white
                          shadow-lg
                          shadow-orange-500/10
                          transition
                          active:scale-[0.98]
                          hover:bg-orange-400
                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-orange-400
                          focus-visible:ring-offset-2
                          focus-visible:ring-offset-zinc-900
                        "
                      >
                        Ver reserva
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      <WolfSheet
        open={Boolean(selectedReservation)}
        onClose={() =>
          setSelectedReservation(null)
        }
        title="Reserva"
        subtitle={
          selectedReservation
            ? `${formatTime(
                selectedReservation
              )} · ${
                selectedReservation.guest
                  .fullName ||
                "Sin nombre"
              }`
            : undefined
        }
        ariaLabel="Detalle de reserva"
        tone="dark"
        maxWidth={520}
      >
        {selectedReservation ? (
          <ReservationSheetContent
            reservation={
              selectedReservation
            }
            onClose={() =>
              setSelectedReservation(null)
            }
          />
        ) : null}
      </WolfSheet>
    </aside>
  );
}