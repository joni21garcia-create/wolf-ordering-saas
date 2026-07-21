/* ============================================================================
 * CONFIGURACIÓN GENERAL
 * ========================================================================== */

export const RESERVATION_DEFAULT_DURATION = 90;

export const RESERVATION_DEFAULT_CLEANING_TIME = 15;

export const RESERVATION_DEFAULT_INTERVAL = 15;

export const RESERVATION_MAX_GUESTS = 100;

export const RESERVATION_MIN_GUESTS = 1;

/* ============================================================================
 * ANTICIPACIÓN
 * ========================================================================== */

export const RESERVATION_MIN_ADVANCE_HOURS = 2;

export const RESERVATION_MAX_ADVANCE_DAYS = 90;

/* ============================================================================
 * CANCELACIÓN
 * ========================================================================== */

export const RESERVATION_DEFAULT_CANCELLATION_HOURS = 6;

export const RESERVATION_DEFAULT_RESCHEDULE_HOURS = 6;

/* ============================================================================
 * CAPACIDAD
 * ========================================================================== */

export const RESERVATION_DEFAULT_CAPACITY = 100;

export const RESERVATION_MIN_CAPACITY = 1;

/* ============================================================================
 * PAGOS
 * ========================================================================== */

export const RESERVATION_DEFAULT_COMMISSION = 5;

export const RESERVATION_DEFAULT_CURRENCY = "USD";

/* ============================================================================
 * RECORDATORIOS
 * ========================================================================== */

export const RESERVATION_REMINDER_24H = 24;

export const RESERVATION_REMINDER_2H = 2;

export const RESERVATION_REMINDER_30M = 30;

/* ============================================================================
 * CALENDARIO
 * ========================================================================== */

export const RESERVATION_WEEK_DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const RESERVATION_MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

/* ============================================================================
 * UI
 * ========================================================================== */

export const RESERVATION_PAGE_SIZE = 20;

export const RESERVATION_MAX_NOTES = 500;

export const RESERVATION_MAX_INTERNAL_NOTES = 1000;


