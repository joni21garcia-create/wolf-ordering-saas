import type {
  Reservation,
  ReservationSettings,
} from "@/types/reservations";

/* ============================================================================
 * UUID
 * ========================================================================== */

export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/* ============================================================================
 * Email
 * ========================================================================== */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================================
 * Teléfono
 * ========================================================================== */

export function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{6,20}$/.test(phone);
}

/* ============================================================================
 * Hora HH:mm
 * ========================================================================== */

export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

/* ============================================================================
 * Fecha ISO
 * ========================================================================== */

export function isValidDate(date: string): boolean {
  return !Number.isNaN(Date.parse(date));
}

/* ============================================================================
 * Cantidad de personas
 * ========================================================================== */

export function isValidGuests(
  guests: number,
  settings: ReservationSettings
): boolean {
  return (
    guests >= settings.general.minGuestsPerReservation &&
    guests <= settings.general.maxGuestsPerReservation
  );
}

/* ============================================================================
 * Horario correcto
 * ========================================================================== */

export function isValidTimeRange(
  start: string,
  end: string
): boolean {
  return start < end;
}

/* ============================================================================
 * Reserva válida
 * ========================================================================== */

export function isReservationValid(
  reservation: Reservation
): boolean {
  return (
    reservation.capacity.guests > 0 &&
    isValidDate(reservation.datetime.date) &&
    isValidTime(reservation.datetime.startTime) &&
    isValidTime(reservation.datetime.endTime)
  );
}

/* ============================================================================
 * Texto vacío
 * ========================================================================== */

export function isBlank(
  value?: string | null
): boolean {
  return !value || value.trim().length === 0;
}

/* ============================================================================
 * Texto con longitud
 * ========================================================================== */

export function hasLength(
  value: string,
  min: number,
  max: number
): boolean {
  return (
    value.length >= min &&
    value.length <= max
  );
}

/* ============================================================================
 * Número positivo
 * ========================================================================== */

export function isPositive(
  value: number
): boolean {
  return value > 0;
}

/* ============================================================================
 * Número entero positivo
 * ========================================================================== */

export function isPositiveInteger(
  value: number
): boolean {
  return Number.isInteger(value) && value > 0;
}


