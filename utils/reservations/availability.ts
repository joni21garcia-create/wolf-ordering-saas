import type {
  Reservation,
  ReservationBlockedSlot,
  ReservationSpecialDate,
  ReservationWorkingHour,
} from "@/types/reservations";

import {
  addMinutes,
  diffMinutes,
  toDate,
} from "./dates";

import {
  hasCapacity,
} from "./capacity";

/* ============================================================================
 * Convierte HH:mm a minutos
 * ========================================================================== */

export function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

/* ============================================================================
 * Convierte minutos a HH:mm
 * ========================================================================== */

export function minutesToTime(minutes: number): string {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const minute = (minutes % 60)
    .toString()
    .padStart(2, "0");

  return `${hour}:${minute}`;
}

/* ============================================================================
 * Genera horarios
 * ========================================================================== */

export function generateTimeSlots(
  open: string,
  close: string,
  duration: number,
  interval: number
): string[] {
  const slots: string[] = [];

  let current = timeToMinutes(open);

  const end = timeToMinutes(close);

  while (current + duration <= end) {
    slots.push(minutesToTime(current));

    current += interval;
  }

  return slots;
}

/* ============================================================================
 * Busca horario del día
 * ========================================================================== */

export function getWorkingHour(
  date: Date,
  workingHours: ReservationWorkingHour[]
) {
  return workingHours.find(
    (item) => item.day === date.getDay() && item.enabled
  );
}

/* ============================================================================
 * ¿Horario bloqueado?
 * ========================================================================== */

export function isBlockedSlot(
  date: string,
  time: string,
  blockedSlots: ReservationBlockedSlot[]
): boolean {
  return blockedSlots.some((slot) => {
    if (slot.date !== date) return false;

    const current = timeToMinutes(time);

    return (
      current >= timeToMinutes(slot.startTime) &&
      current < timeToMinutes(slot.endTime)
    );
  });
}

/* ============================================================================
 * Fecha especial
 * ========================================================================== */

export function getSpecialDate(
  date: string,
  specialDates: ReservationSpecialDate[]
) {
  return specialDates.find(
    (item) => item.date === date
  );
}

/* ============================================================================
 * Reservas del horario
 * ========================================================================== */

export function reservationsAtTime(
  reservations: Reservation[],
  time: string
): Reservation[] {
  return reservations.filter((reservation) => {
    return reservation.datetime.startTime === time;
  });
}

/* ============================================================================
 * Capacidad del horario
 * ========================================================================== */

export function slotHasCapacity(
  reservations: Reservation[],
  capacity: number,
  guests: number
): boolean {
  return hasCapacity(
    capacity,
    reservations,
    guests
  );
}

/* ============================================================================
 * Duración de una reserva
 * ========================================================================== */

export function reservationEndsAt(
  startTime: string,
  duration: number
): string {
  const date = new Date();

  const [hour, minute] = startTime
    .split(":")
    .map(Number);

  date.setHours(hour, minute, 0, 0);

  return addMinutes(date, duration)
    .toTimeString()
    .substring(0, 5);
}

/* ============================================================================
 * ¿Se solapan?
 * ========================================================================== */

export function overlaps(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return (
    timeToMinutes(startA) < timeToMinutes(endB) &&
    timeToMinutes(endA) > timeToMinutes(startB)
  );
}

/* ============================================================================
 * Duración
 * ========================================================================== */

export function reservationDuration(
  start: string,
  end: string
): number {
  const today = new Date();

  const startDate = new Date(today);

  const endDate = new Date(today);

  const [sh, sm] = start.split(":").map(Number);

  const [eh, em] = end.split(":").map(Number);

  startDate.setHours(sh, sm);

  endDate.setHours(eh, em);

  return diffMinutes(startDate, endDate);
}

