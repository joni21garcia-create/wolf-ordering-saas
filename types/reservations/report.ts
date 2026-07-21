/* ============================================================================
 * PERÍODOS
 * ========================================================================== */

export enum ReservationReportPeriod {
  TODAY = "today",

  WEEK = "week",

  MONTH = "month",

  YEAR = "year",

  CUSTOM = "custom",
}

/* ============================================================================
 * SOLICITUD
 * ========================================================================== */

export interface ReservationReportRequest {
  restaurantId: string;

  period: ReservationReportPeriod;

  from?: string;

  to?: string;
}

/* ============================================================================
 * RESERVAS POR DÍA
 * ========================================================================== */

export interface ReservationsByDay {
  date: string;

  reservations: number;

  guests: number;

  occupancy: number;
}

/* ============================================================================
 * HORAS PICO
 * ========================================================================== */

export interface PeakHourReport {
  hour: string;

  reservations: number;

  guests: number;

  occupancy: number;
}

/* ============================================================================
 * TIPOS DE RESERVA
 * ========================================================================== */

export interface ReservationTypeReport {
  typeId: string;

  name: string;

  reservations: number;

  guests: number;
}

/* ============================================================================
 * SERVICIOS ADICIONALES
 * ========================================================================== */

export interface ReservationServiceReport {
  serviceId: string;

  name: string;

  quantity: number;

  revenue: number;
}

/* ============================================================================
 * ANTICIPOS
 * ========================================================================== */

export interface ReservationDepositReport {
  collected: number;

  pending: number;

  refunded: number;
}

/* ============================================================================
 * CANCELACIONES
 * ========================================================================== */

export interface ReservationCancellationReport {
  cancelled: number;

  noShow: number;

  rejection: number;

  cancellationRate: number;
}

/* ============================================================================
 * INGRESOS
 * ========================================================================== */

export interface ReservationRevenueReport {
  subtotal: number;

  deposits: number;

  services: number;

  commission: number;

  total: number;

  currency: string;
}

/* ============================================================================
 * OCUPACIÓN
 * ========================================================================== */

export interface ReservationOccupancyReport {
  average: number;

  maximum: number;

  minimum: number;

  busiestDay: string;

  busiestHour: string;
}

/* ============================================================================
 * REPORTE GENERAL
 * ========================================================================== */

export interface ReservationReport {
  generatedAt: string;

  period: ReservationReportPeriod;

  reservations: number;

  guests: number;

  occupancy: ReservationOccupancyReport;

  revenue: ReservationRevenueReport;

  deposits: ReservationDepositReport;

  cancellations: ReservationCancellationReport;

  byDay: ReservationsByDay[];

  peakHours: PeakHourReport[];

  types: ReservationTypeReport[];

  services: ReservationServiceReport[];
}

/* ============================================================================
 * EXPORTACIÓN
 * ========================================================================== */

export interface ReservationExportReport {
  format: "pdf" | "excel" | "csv";

  includeCharts: boolean;

  includeGuests: boolean;

  includeRevenue: boolean;

  includeServices: boolean;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type ReservationReports = ReservationReport[];

export type ReservationDailyReports = ReservationsByDay[];

export type ReservationPeakHours = PeakHourReport[];

export type ReservationServiceReports = ReservationServiceReport[];


