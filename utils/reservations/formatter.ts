import type { ReservationStatus } from "@/types/reservations";

import {
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations";

/* ============================================================================
 * FECHAS
 * ========================================================================== */

export function formatDate(
  date: Date | string,
  locale = "es-EC"
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function formatLongDate(
  date: Date | string,
  locale = "es-EC"
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/* ============================================================================
 * HORAS
 * ========================================================================== */

export function formatTime(
  date: Date | string,
  locale = "es-EC"
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateTime(
  date: Date | string,
  locale = "es-EC"
): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
}

/* ============================================================================
 * PERSONAS
 * ========================================================================== */

export function formatGuests(
  guests: number
): string {
  return `${guests} ${
    guests === 1 ? "persona" : "personas"
  }`;
}

/* ============================================================================
 * DURACIÓN
 * ========================================================================== */

export function formatDuration(
  minutes: number
): string {
  const hours = Math.floor(minutes / 60);

  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${mins} min`;
}

/* ============================================================================
 * PORCENTAJE
 * ========================================================================== */

export function formatPercentage(
  value: number,
  decimals = 0
): string {
  return `${value.toFixed(decimals)}%`;
}

/* ============================================================================
 * CAPACIDAD
 * ========================================================================== */

export function formatCapacity(
  occupied: number,
  total: number
): string {
  return `${occupied} / ${total}`;
}

/* ============================================================================
 * ESTADO
 * ========================================================================== */

export function formatReservationStatus(
  status: ReservationStatus
): string {
  return RESERVATION_STATUS_LABELS[status];
}

/* ============================================================================
 * TELÉFONO
 * ========================================================================== */

export function formatPhone(
  phone: string
): string {
  return phone.trim();
}

/* ============================================================================
 * CÓDIGO
 * ========================================================================== */

export function formatConfirmationCode(
  code: string
): string {
  return code.toUpperCase();
}


