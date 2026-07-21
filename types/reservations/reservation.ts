/**
 * ============================================================================
 * WOLF ORDERING
 * Reservation Types
 * ============================================================================
 */

import { ReservationStatus } from "./reservation-status";

/* ============================================================================
 * CLIENTE
 * ========================================================================== */

export interface ReservationGuest {
  firstName: string;
  lastName?: string;

  fullName: string;

  phone: string;

  email?: string;

  document?: string;

  notes?: string;
}

/* ============================================================================
 * FECHA Y HORARIO
 * ========================================================================== */

export interface ReservationDateTime {
  date: string;

  startTime: string;

  endTime: string;

  timezone: string;

  durationMinutes: number;
}

/* ============================================================================
 * CAPACIDAD
 * ========================================================================== */

export interface ReservationCapacity {
  guests: number;

  adults: number;

  children: number;

  babies: number;

  occupiesCapacity: number;
}

/* ============================================================================
 * PREPARADO PARA FUTURAS MESAS
 * ========================================================================== */

export interface ReservationTable {
  id: string;

  name: string;

  zone?: string;

  capacity: number;
}

export interface ReservationAssignment {
  automatic: boolean;

  tables: ReservationTable[];

  totalCapacity: number;

  assignedAt?: string;
}

/* ============================================================================
 * SERVICIOS ADICIONALES
 * ========================================================================== */

export interface ReservationServiceItem {
  id: string;

  serviceId: string;

  name: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  notes?: string;
}

/* ============================================================================
 * ANTICIPO
 * ========================================================================== */

export interface ReservationDeposit {
  enabled: boolean;

  paid: boolean;

  paymentId?: string;

  amount: number;

  currency: string;

  percentage?: number;

  paidAt?: string;

  expiresAt?: string;
}

/* ============================================================================
 * COMISIÓN DEL SAAS
 * ========================================================================== */

export interface ReservationCommission {
  enabled: boolean;

  percentage: number;

  amount: number;

  currency: string;

  calculatedAt?: string;
}

/* ============================================================================
 * PAGO
 * ========================================================================== */

export interface ReservationPayment {
  subtotal: number;

  servicesTotal: number;

  depositTotal: number;

  total: number;

  currency: string;
}

/* ============================================================================
 * CHECK IN
 * ========================================================================== */

export interface ReservationCheckIn {
  checked: boolean;

  checkedAt?: string;

  checkedBy?: string;

  notes?: string;
}

/* ============================================================================
 * CANCELACIÓN
 * ========================================================================== */

export interface ReservationCancellation {
  cancelled: boolean;

  cancelledBy?: string;

  cancelledAt?: string;

  reason?: string;
}

/* ============================================================================
 * HISTORIAL
 * ========================================================================== */

export interface ReservationHistoryItem {
  id: string;

  status: ReservationStatus;

  description: string;

  createdAt: string;

  createdBy?: string;
}

/* ============================================================================
 * AUDITORÍA
 * ========================================================================== */

export interface ReservationAudit {
  createdAt: string;

  updatedAt: string;

  createdBy?: string;

  updatedBy?: string;
}

/* ============================================================================
 * RESERVA
 * ========================================================================== */

export interface Reservation {
  id: string;

  restaurantId: string;

  slug: string;

  confirmationCode: string;

  status: ReservationStatus;

  guest: ReservationGuest;

  datetime: ReservationDateTime;

  capacity: ReservationCapacity;

  assignment?: ReservationAssignment;

  typeId?: string;

  typeName?: string;

  services: ReservationServiceItem[];

  payment: ReservationPayment;

  deposit: ReservationDeposit;

  commission: ReservationCommission;

  checkIn: ReservationCheckIn;

  cancellation?: ReservationCancellation;

  history: ReservationHistoryItem[];

  internalNotes?: string;

  customerNotes?: string;

  audit: ReservationAudit;
}
/* ============================================================================
 * CREATE DTO
 * ========================================================================== */

export interface CreateReservationDto {
  restaurantId: string;

  slug: string;

  guest: ReservationGuest;

  datetime: ReservationDateTime;

  capacity: ReservationCapacity;

  typeId?: string;

  services?: ReservationServiceItem[];

  customerNotes?: string;
}

/* ============================================================================
 * UPDATE DTO
 * ========================================================================== */

export interface UpdateReservationDto {
  status?: ReservationStatus;

  datetime?: ReservationDateTime;

  capacity?: ReservationCapacity;

  typeId?: string;

  services?: ReservationServiceItem[];

  customerNotes?: string;

  internalNotes?: string;

  assignment?: ReservationAssignment;

  deposit?: ReservationDeposit;

  payment?: ReservationPayment;
}

/* ============================================================================
 * CAMBIO DE ESTADO
 * ========================================================================== */

export interface ReservationStatusUpdate {
  reservationId: string;

  status: ReservationStatus;

  reason?: string;

  updatedBy?: string;

  createdAt: string;
}

/* ============================================================================
 * ACCIONES DE ESTADO
 * ========================================================================== */

export interface ReservationActionDto {

  reservationId: string;

  reason?: string;

  updatedBy?: string;

}

/* ============================================================================
 * REAGENDAR
 * ========================================================================== */

export interface ReservationReschedule {
  reservationId: string;

  oldDate: string;

  oldStartTime: string;

  oldEndTime: string;

  newDate: string;

  newStartTime: string;

  newEndTime: string;

  reason?: string;
}

/* ============================================================================
 * FILTROS
 * ========================================================================== */

export interface ReservationFilters {
  date?: string;

  status?: ReservationStatus;

  search?: string;

  typeId?: string;

  minGuests?: number;

  maxGuests?: number;

  page?: number;

  limit?: number;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}

/* ============================================================================
 * DISPONIBILIDAD
 * ========================================================================== */

export interface ReservationAvailability {
  date: string;

  startTime: string;

  endTime: string;

  remainingCapacity: number;

  occupiedCapacity: number;

  totalCapacity: number;

  available: boolean;

  reason?: string;
}

/* ============================================================================
 * CALENDARIO
 * ========================================================================== */

export interface ReservationCalendarEvent {
  id: string;

  title: string;

  start: string;

  end: string;

  status: ReservationStatus;

  guests: number;

  color?: string;

  reservationId: string;
}

/* ============================================================================
 * RESUMEN DEL DASHBOARD
 * ========================================================================== */

export interface ReservationDashboardSummary {
  total: number;

  pending: number;

  confirmed: number;

  rejected: number;

  cancelled: number;

  checkedIn: number;

  finished: number;

  noShow: number;

  occupancyPercentage: number;

  occupiedSeats: number;

  availableSeats: number;
}

/* ============================================================================
 * ESTADÍSTICAS
 * ========================================================================== */

export interface ReservationStatistics {
  today: ReservationDashboardSummary;

  week: ReservationDashboardSummary;

  month: ReservationDashboardSummary;

  year: ReservationDashboardSummary;
}

/* ============================================================================
 * HORAS PICO
 * ========================================================================== */

export interface ReservationPeakHour {
  hour: string;

  reservations: number;

  guests: number;

  occupancy: number;
}

/* ============================================================================
 * MOTOR DE REGLAS
 * ========================================================================== */

export interface ReservationRecommendation {
  title: string;

  description: string;

  severity: "low" | "medium" | "high";

  createdAt: string;
}

/* ============================================================================
 * EXPORTACIÓN
 * ========================================================================== */

export interface ReservationExportOptions {
  includeGuest: boolean;

  includePhone: boolean;

  includeEmail: boolean;

  includeServices: boolean;

  includePayments: boolean;

  includeHistory: boolean;
}

/* ============================================================================
 * BÚSQUEDA
 * ========================================================================== */

export interface ReservationSearchResult {
  id: string;

  confirmationCode: string;

  guestName: string;

  phone: string;

  date: string;

  time: string;

  status: ReservationStatus;
}

/* ============================================================================
 * PAGINACIÓN
 * ========================================================================== */

export interface ReservationPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

/* ============================================================================
 * RESPUESTA
 * ========================================================================== */

export interface ReservationListResponse {
  data: Reservation[];

  pagination: ReservationPagination;
}

/* ============================================================================
 * CONFIGURACIÓN GLOBAL
 * ========================================================================== */

export interface ReservationDefaults {
  commissionPercentage: number;

  currency: string;

  timezone: string;
}

/* ============================================================================
 * CONSTANTES
 * ========================================================================== */

export const DEFAULT_RESERVATION_SETTINGS: ReservationDefaults = {
  commissionPercentage: 5,
  currency: "USD",
  timezone: "America/Guayaquil",
};

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type ReservationId = Reservation["id"];

export type ReservationGuestInfo = Reservation["guest"];

export type ReservationPaymentInfo = Reservation["payment"];

export type ReservationDepositInfo = Reservation["deposit"];

export type ReservationServiceList = ReservationServiceItem[];

export type ReservationHistory = ReservationHistoryItem[];

export type ReservationTimeline = ReservationHistoryItem[];

/* ============================================================================
 * TYPE GUARDS
 * ========================================================================== */

export function isReservationCancelled(
  reservation: Reservation
): boolean {
  return reservation.status === ReservationStatus.CANCELLED;
}

export function isReservationConfirmed(
  reservation: Reservation
): boolean {
  return reservation.status === ReservationStatus.CONFIRMED;
}

export function isReservationPending(
  reservation: Reservation
): boolean {
  return reservation.status === ReservationStatus.PENDING;
}

export function isReservationFinished(
  reservation: Reservation
): boolean {
  return reservation.status === ReservationStatus.COMPLETED;
}

export function reservationGuests(
  reservation: Reservation
): number {
  return reservation.capacity.occupiesCapacity;
}
/* ============================================================================
 * TYPE GUARDS ESTADOS
 * ========================================================================== */


export function isReservationCheckedIn(
 reservation: Reservation
): boolean {

 return (
  reservation.status ===
  ReservationStatus.CHECKED_IN
 );

}



export function isReservationNoShow(
 reservation: Reservation
): boolean {

 return (
  reservation.status ===
  ReservationStatus.NO_SHOW
 );

}



export function isReservationFinal(
 reservation: Reservation
): boolean {

 return [

  ReservationStatus.COMPLETED,

  ReservationStatus.CANCELLED,

  ReservationStatus.REJECTED,

  ReservationStatus.NO_SHOW,

  ReservationStatus.EXPIRED

 ].includes(
  reservation.status
 );

}

