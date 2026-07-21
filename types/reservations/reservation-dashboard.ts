import type { ReservationStatus } from "./reservation-status";

/* ============================================================================
 * TARJETA KPI
 * ========================================================================== */

export interface DashboardCard {
  id: string;

  title: string;

  value: number | string;

  subtitle?: string;

  icon?: string;

  color?: string;

  trend?: number;

  trendLabel?: string;
}

/* ============================================================================
 * RESUMEN DEL DÍA
 * ========================================================================== */

export interface DashboardTodaySummary {
  date: string;

  reservations: number;

  guests: number;

  occupiedSeats: number;

  availableSeats: number;

  occupancyPercentage: number;

  pending: number;

  confirmed: number;

  cancelled: number;

  checkedIn: number;

  finished: number;

  noShow: number;
}

/* ============================================================================
 * PRÓXIMA RESERVA
 * ========================================================================== */

export interface DashboardNextReservation {
  reservationId: string;

  guestName: string;

  time: string;

  guests: number;

  phone?: string;

  status: ReservationStatus;
}

/* ============================================================================
 * ALERTA
 * ========================================================================== */

export interface DashboardAlert {
  id: string;

  title: string;

  description: string;

  severity: "info" | "warning" | "error" | "success";

  createdAt: string;
}

/* ============================================================================
 * OCUPACIÓN POR HORA
 * ========================================================================== */

export interface DashboardOccupancyHour {
  hour: string;

  reservations: number;

  guests: number;

  occupancyPercentage: number;
}

/* ============================================================================
 * RESERVAS POR ESTADO
 * ========================================================================== */

export interface DashboardStatusChart {
  status: ReservationStatus;

  total: number;
}

/* ============================================================================
 * MÉTRICAS GENERALES
 * ========================================================================== */

export interface DashboardMetrics {
  totalReservations: number;

  totalGuests: number;

  occupancyPercentage: number;

  averageGuestsPerReservation: number;

  averageReservationDuration: number;

  cancellationRate: number;

  noShowRate: number;
}

/* ============================================================================
 * DASHBOARD COMPLETO
 * ========================================================================== */

export interface ReservationDashboard {
  today: DashboardTodaySummary;

  cards: DashboardCard[];

  nextReservations: DashboardNextReservation[];

  alerts: DashboardAlert[];

  occupancy: DashboardOccupancyHour[];

  statusChart: DashboardStatusChart[];

  metrics: DashboardMetrics;

  generatedAt: string;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type DashboardCards = DashboardCard[];

export type DashboardAlerts = DashboardAlert[];

export type DashboardOccupancy = DashboardOccupancyHour[];

export type DashboardNextReservations = DashboardNextReservation[];


