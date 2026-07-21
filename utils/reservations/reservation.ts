import type {
  Reservation,
  ReservationStatus,
} from "@/types/reservations";

import {
  RESERVATION_FINAL_STATUSES,
} from "@/constants/reservations";

/* ============================================================================
 * Código de confirmación
 * ========================================================================== */

export function generateConfirmationCode(
  length = 8
): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return result;
}

/* ============================================================================
 * Buscar por ID
 * ========================================================================== */

export function findReservation(
  reservations: Reservation[],
  id: string
): Reservation | undefined {
  return reservations.find(
    (reservation) => reservation.id === id
  );
}

/* ============================================================================
 * Filtrar por estado
 * ========================================================================== */

export function filterReservationsByStatus(
  reservations: Reservation[],
  status: ReservationStatus
): Reservation[] {
  return reservations.filter(
    (reservation) => reservation.status === status
  );
}

/* ============================================================================
 * Filtrar por fecha
 * ========================================================================== */

export function filterReservationsByDate(
  reservations: Reservation[],
  date: string
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      reservation.datetime.date === date
  );
}

/* ============================================================================
 * Total de invitados
 * ========================================================================== */

export function totalGuests(
  reservations: Reservation[]
): number {
  return reservations.reduce(
    (total, reservation) =>
      total + reservation.capacity.guests,
    0
  );
}

/* ============================================================================
 * Reserva finalizada
 * ========================================================================== */

export function isFinalReservation(
  status: ReservationStatus
): boolean {
  return RESERVATION_FINAL_STATUSES.includes(
    status
  );
}

/* ============================================================================
 * Ordenar por hora
 * ========================================================================== */

export function sortReservationsByTime(
  reservations: Reservation[]
): Reservation[] {
  return [...reservations].sort((a, b) =>
    a.datetime.startTime.localeCompare(
      b.datetime.startTime
    )
  );
}

/* ============================================================================
 * Próxima reserva
 * ========================================================================== */

export function nextReservation(
  reservations: Reservation[]
): Reservation | null {
  if (reservations.length === 0) {
    return null;
  }

  return sortReservationsByTime(reservations)[0];
}

/* ============================================================================
 * Resumen
 * ========================================================================== */

export function reservationSummary(
  reservations: Reservation[]
) {
  return {
    total: reservations.length,

    guests: totalGuests(reservations),
  };
}


