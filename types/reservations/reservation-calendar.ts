import type { ReservationStatus } from "./reservation-status";

/* ============================================================================
 * EVENTO DEL CALENDARIO
 * ========================================================================== */

export interface CalendarEvent {
  id: string;

  reservationId: string;

  restaurantId: string;

  title: string;

  subtitle?: string;

  date: string;

  start: string;

  end: string;

  guests: number;

  status: ReservationStatus;

  color?: string;

  typeId?: string;

  checkedIn: boolean;

  editable: boolean;
}

/* ============================================================================
 * DÍA DEL CALENDARIO
 * ========================================================================== */

export interface CalendarDay {
  date: string;

  today: boolean;

  closed: boolean;

  occupancy: number;

  reservations: number;

  events: CalendarEvent[];
}

/* ============================================================================
 * SEMANA
 * ========================================================================== */

export interface CalendarWeek {
  startDate: string;

  endDate: string;

  days: CalendarDay[];
}

/* ============================================================================
 * MES
 * ========================================================================== */

export interface CalendarMonth {
  year: number;

  month: number;

  weeks: CalendarWeek[];
}

/* ============================================================================
 * FILTROS
 * ========================================================================== */

export interface CalendarFilters {
  date?: string;

  status?: ReservationStatus;

  typeId?: string;

  search?: string;
}

/* ============================================================================
 * RANGO
 * ========================================================================== */

export interface CalendarRange {
  start: string;

  end: string;
}

/* ============================================================================
 * RESPUESTA
 * ========================================================================== */

export interface CalendarResponse {
  success: boolean;

  events: CalendarEvent[];

  generatedAt: string;
}

/* ============================================================================
 * ESTADÍSTICAS
 * ========================================================================== */

export interface CalendarStatistics {
  reservations: number;

  guests: number;

  occupancy: number;

  cancelled: number;

  confirmed: number;

  pending: number;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type CalendarEvents = CalendarEvent[];

export type CalendarDays = CalendarDay[];

export type CalendarWeeks = CalendarWeek[];


