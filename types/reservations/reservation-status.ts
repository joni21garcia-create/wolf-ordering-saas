/**
 * ============================================================================
 * WOLF ORDERING
 * Reservation Status Types
 * ============================================================================
 */

export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  CHECKED_IN = "checked_in",
  COMPLETED = "completed",
  NO_SHOW = "no_show",
  EXPIRED = "expired",
}

export type ReservationStatusValue = `${ReservationStatus}`;

export const RESERVATION_STATUS_VALUES: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.REJECTED,
  ReservationStatus.CANCELLED,
  ReservationStatus.CHECKED_IN,
  ReservationStatus.COMPLETED,
  ReservationStatus.NO_SHOW,
  ReservationStatus.EXPIRED,
];

export const FINAL_RESERVATION_STATUSES: ReservationStatus[] = [
  ReservationStatus.COMPLETED,
  ReservationStatus.CANCELLED,
  ReservationStatus.NO_SHOW,
  ReservationStatus.EXPIRED,
];

export const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CHECKED_IN,
];

export const CUSTOMER_RESERVATION_STATUSES: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CANCELLED,
  ReservationStatus.REJECTED,
];

export const ADMIN_RESERVATION_STATUSES: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.REJECTED,
  ReservationStatus.CANCELLED,
  ReservationStatus.CHECKED_IN,
  ReservationStatus.COMPLETED,
  ReservationStatus.NO_SHOW,
  ReservationStatus.EXPIRED,
];

export const ReservationStatusLabel: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "Pendiente",
  [ReservationStatus.CONFIRMED]: "Confirmada",
  [ReservationStatus.REJECTED]: "Rechazada",
  [ReservationStatus.CANCELLED]: "Cancelada",
  [ReservationStatus.CHECKED_IN]: "Check-in",
  [ReservationStatus.COMPLETED]: "Finalizada",
  [ReservationStatus.NO_SHOW]: "No asistió",
  [ReservationStatus.EXPIRED]: "Expirada",
};

export const ReservationStatusDescription: Record<
  ReservationStatus,
  string
> = {
  [ReservationStatus.PENDING]:
    "La reserva fue creada y espera aprobación del restaurante.",

  [ReservationStatus.CONFIRMED]:
    "La reserva fue aceptada y está lista para recibir al cliente.",

  [ReservationStatus.REJECTED]:
    "La reserva fue rechazada por el restaurante.",

  [ReservationStatus.CANCELLED]:
    "La reserva fue cancelada.",

  [ReservationStatus.CHECKED_IN]:
    "El cliente ya llegó al restaurante.",

  [ReservationStatus.COMPLETED]:
    "La reserva finalizó correctamente.",

  [ReservationStatus.NO_SHOW]:
    "El cliente no asistió a la reserva.",

  [ReservationStatus.EXPIRED]:
    "La reserva expiró automáticamente.",
};

export const ReservationStatusColor: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "warning",
  [ReservationStatus.CONFIRMED]: "success",
  [ReservationStatus.REJECTED]: "danger",
  [ReservationStatus.CANCELLED]: "secondary",
  [ReservationStatus.CHECKED_IN]: "info",
  [ReservationStatus.COMPLETED]: "primary",
  [ReservationStatus.NO_SHOW]: "dark",
  [ReservationStatus.EXPIRED]: "muted",
};

export const ReservationStatusIcon: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "Clock3",
  [ReservationStatus.CONFIRMED]: "BadgeCheck",
  [ReservationStatus.REJECTED]: "CircleX",
  [ReservationStatus.CANCELLED]: "Ban",
  [ReservationStatus.CHECKED_IN]: "MapPinCheck",
  [ReservationStatus.COMPLETED]: "PartyPopper",
  [ReservationStatus.NO_SHOW]: "UserX",
  [ReservationStatus.EXPIRED]: "TimerOff",
};

export const ReservationStatusOrder: Record<ReservationStatus, number> = {
  [ReservationStatus.PENDING]: 1,
  [ReservationStatus.CONFIRMED]: 2,
  [ReservationStatus.CHECKED_IN]: 3,
  [ReservationStatus.COMPLETED]: 4,
  [ReservationStatus.REJECTED]: 5,
  [ReservationStatus.CANCELLED]: 6,
  [ReservationStatus.NO_SHOW]: 7,
  [ReservationStatus.EXPIRED]: 8,
};

export function isFinalReservationStatus(
  status: ReservationStatus,
): boolean {
  return FINAL_RESERVATION_STATUSES.includes(status);
}

export function isActiveReservationStatus(
  status: ReservationStatus,
): boolean {
  return ACTIVE_RESERVATION_STATUSES.includes(status);
}

export function canEditReservation(
  status: ReservationStatus,
): boolean {
  return !FINAL_RESERVATION_STATUSES.includes(status);
}

export function canCheckInReservation(
  status: ReservationStatus,
): boolean {
  return status === ReservationStatus.CONFIRMED;
}

export function canCompleteReservation(
  status: ReservationStatus,
): boolean {
  return status === ReservationStatus.CHECKED_IN;
}

export function canCancelReservation(
  status: ReservationStatus,
): boolean {
  return (
    status === ReservationStatus.PENDING ||
    status === ReservationStatus.CONFIRMED
  );
}

export function canRejectReservation(
  status: ReservationStatus,
): boolean {
  return status === ReservationStatus.PENDING;
}


