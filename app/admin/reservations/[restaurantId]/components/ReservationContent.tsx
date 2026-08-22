"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  List,
} from "lucide-react";

import type {
  Reservation,
  ReservationCalendarEvent,
} from "@/types/reservations";

import { ReservationCalendar } from "@/components/reservations/calendar";
import { ReservationTable } from "@/components/reservations/tables";

import ReservationUpcoming from "./ReservationUpcoming";
import ReservationAgenda from "./agenda/ReservationAgenda";

import WolfSheet from "@/lib/wolf-ui/components/WolfSheet";

interface ReservationContentProps {
  reservations?: Reservation[];
  events?: ReservationCalendarEvent[];
  calendarDate?: string;
  onSelectReservation?: (reservationId: string) => void;
}

type MobileSheet =
  | "upcoming"
  | "agenda"
  | "all"
  | null;

export default function ReservationContent({
  reservations = [],
  events = [],
  calendarDate,
  onSelectReservation,
}: ReservationContentProps) {
  const router = useRouter();

  const [mobileSheet, setMobileSheet] =
    useState<MobileSheet>(null);

  // Mantiene la pantalla sincronizada sin que el usuario tenga que pulsar F5.
  useEffect(() => {
    let active = true;

    const refresh = () => {
      if (
        !active ||
        document.visibilityState !== "visible"
      ) {
        return;
      }

      router.refresh();
    };

    const interval = window.setInterval(
      refresh,
      5000
    );

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [router]);

  // El calendario necesita un `end` real para poder pintar la altura del bloque.
  // Si el mapper original no lo envía, lo reconstruimos desde la reserva.
  const calendarEvents = events.map((event) => {
    const reservation = reservations.find(
      (item) =>
        item.id === event.reservationId
    );

    if (!reservation || event.end) {
      return event;
    }

    const date =
      reservation.datetime.date;

    const endTime =
      reservation.datetime.endTime;

    if (!date || !endTime) {
      return event;
    }

    const startMatch =
      event.start.match(
        /^\d{4}-\d{2}-\d{2}/
      );

    const eventDate =
      startMatch?.[0] ?? date;

    const hasTimezone =
      /[+-]\d{2}:?\d{2}$/.test(
        event.start
      );

    return {
      ...event,
      end: hasTimezone
        ? `${eventDate}T${endTime}${event.start.slice(-6)}`
        : `${eventDate}T${endTime}`,
    };
  });

  const agendaReservations =
    useMemo(
      () =>
        reservations.map(
          (reservation) => {
            const tables =
              reservation.assignment?.tables
                ?.map(
                  (table) =>
                    table.name
                )
                .filter(Boolean) ?? [];

            return {
              id: reservation.id,
              customer:
                reservation.guest.fullName ||
                "Sin nombre",
              table:
                tables.length > 0
                  ? tables.join(", ")
                  : "Sin asignar",
              guests:
                reservation.capacity.guests ??
                0,
              time:
                reservation.datetime.startTime,
              date:
                reservation.datetime.date,
              timezone:
                reservation.datetime.timezone ||
                "America/Guayaquil",
              status:
                reservation.status,
            };
          }
        ),
      [reservations]
    );

  const closeMobileSheet = () => {
    setMobileSheet(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ============================================================
          CALENDARIO
          ============================================================ */}
      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

        <ReservationCalendar
          events={calendarEvents}
          date={
            calendarDate ??
            new Date()
              .toISOString()
              .slice(0, 10)
          }
          onSelectReservation={
            onSelectReservation
          }
        />

        {/* PRÓXIMAS RESERVAS - ESCRITORIO */}
        <div className="hidden xl:block">
          <ReservationUpcoming
            reservations={
              reservations
            }
            onSelectReservation={
              onSelectReservation
            }
          />
        </div>
      </section>

      {/* ============================================================
          MENÚ DE RESERVAS - MÓVIL / TABLET
          ============================================================ */}
      <section className="xl:hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">

        <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-950 dark:text-white">
            Reservas
          </h2>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Selecciona qué quieres consultar.
          </p>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">

          {/* PRÓXIMAS */}
          <button
            type="button"
            onClick={() =>
              setMobileSheet("upcoming")
            }
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition active:bg-zinc-50 dark:active:bg-zinc-900"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <CalendarDays className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-zinc-950 dark:text-white">
                Próximas reservas
              </span>

              <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                Consulta las próximas reservas.
              </span>
            </span>

            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
          </button>

          {/* AGENDA */}
          <button
            type="button"
            onClick={() =>
              setMobileSheet("agenda")
            }
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition active:bg-zinc-50 dark:active:bg-zinc-900"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Clock3 className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-zinc-950 dark:text-white">
                Agenda del día
              </span>

              <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                Consulta la agenda de reservas.
              </span>
            </span>

            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
          </button>

          {/* TODAS */}
          <button
            type="button"
            onClick={() =>
              setMobileSheet("all")
            }
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition active:bg-zinc-50 dark:active:bg-zinc-900"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-300">
              <List className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-zinc-950 dark:text-white">
                Todas las reservas
              </span>

              <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                Buscar y gestionar todas las reservas.
              </span>
            </span>

            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
          </button>

        </div>
      </section>

      {/* ============================================================
          AGENDA - ESCRITORIO
          ============================================================ */}
      <div className="hidden xl:block">
        <ReservationAgenda
          reservations={
            agendaReservations
          }
        />
      </div>

      {/* ============================================================
          TABLA - ESCRITORIO
          ============================================================ */}
      <div className="hidden xl:block">
        <ReservationTable
          reservations={
            reservations
          }
        />
      </div>

      {/* ============================================================
          SHEET - PRÓXIMAS RESERVAS
          ============================================================ */}
      <WolfSheet
        open={
          mobileSheet ===
          "upcoming"
        }
        onClose={
          closeMobileSheet
        }
        title="Próximas reservas"
        subtitle="Reservas próximas"
        tone="dark"
        maxWidth={560}
      >
        <div className="p-3 sm:p-4">
          <ReservationUpcoming
            reservations={
              reservations
            }
            onSelectReservation={
              onSelectReservation
            }
          />
        </div>
      </WolfSheet>

      {/* ============================================================
          SHEET - AGENDA
          ============================================================ */}
      <WolfSheet
        open={
          mobileSheet ===
          "agenda"
        }
        onClose={
          closeMobileSheet
        }
        title="Agenda del día"
        subtitle="Reservas programadas"
        tone="light"
        maxWidth={720}
      >
        <div className="p-3 sm:p-4">
          <ReservationAgenda
            reservations={
              agendaReservations
            }
          />
        </div>
      </WolfSheet>

      {/* ============================================================
          SHEET - TODAS LAS RESERVAS
          ============================================================ */}
      <WolfSheet
        open={
          mobileSheet ===
          "all"
        }
        onClose={
          closeMobileSheet
        }
        title="Todas las reservas"
        subtitle={`${reservations.length} reservas`}
        tone="light"
        maxWidth={1100}
      >
        <div className="p-3 sm:p-4">
          <ReservationTable
            reservations={
              reservations
            }
          />
        </div>
      </WolfSheet>

    </div>
  );
}