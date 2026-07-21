import type { Reservation } from "@/types/reservations";

/* ============================================================================
 * Capacidad ocupada
 * ========================================================================== */

export function getOccupiedCapacity(
  reservations: Reservation[]
): number {
  return reservations.reduce(
    (total, reservation) => total + reservation.capacity.guests,
    0
  );
}

/* ============================================================================
 * Capacidad disponible
 * ========================================================================== */

export function getAvailableCapacity(
  totalCapacity: number,
  reservations: Reservation[]
): number {
  return Math.max(
    totalCapacity - getOccupiedCapacity(reservations),
    0
  );
}

/* ============================================================================
 * Porcentaje de ocupación
 * ========================================================================== */

export function getOccupancyPercentage(
  totalCapacity: number,
  reservations: Reservation[]
): number {
  if (totalCapacity <= 0) return 0;

  return Number(
    (
      (getOccupiedCapacity(reservations) / totalCapacity) *
      100
    ).toFixed(2)
  );
}

/* ============================================================================
 * ¿Hay capacidad?
 * ========================================================================== */

export function hasCapacity(
  totalCapacity: number,
  reservations: Reservation[],
  guests: number
): boolean {
  return (
    getAvailableCapacity(
      totalCapacity,
      reservations
    ) >= guests
  );
}

/* ============================================================================
 * ¿Está lleno?
 * ========================================================================== */

export function isCapacityFull(
  totalCapacity: number,
  reservations: Reservation[]
): boolean {
  return (
    getOccupiedCapacity(reservations) >= totalCapacity
  );
}

/* ============================================================================
 * ¿Supera el límite?
 * ========================================================================== */

export function exceedsCapacity(
  totalCapacity: number,
  reservations: Reservation[],
  guests: number
): boolean {
  return (
    getOccupiedCapacity(reservations) + guests >
    totalCapacity
  );
}

/* ============================================================================
 * Espacios restantes
 * ========================================================================== */

export function remainingSeats(
  totalCapacity: number,
  reservations: Reservation[]
): number {
  return getAvailableCapacity(
    totalCapacity,
    reservations
  );
}

/* ============================================================================
 * Reserva más grande
 * ========================================================================== */

export function largestReservation(
  reservations: Reservation[]
): number {
  if (reservations.length === 0) return 0;

  return Math.max(
    ...reservations.map((reservation) => reservation.capacity.guests)
  );
}

/* ============================================================================
 * Promedio de personas por reserva
 * ========================================================================== */

export function averageGuests(
  reservations: Reservation[]
): number {
  if (reservations.length === 0) return 0;

  return Number(
    (
      getOccupiedCapacity(reservations) /
      reservations.length
    ).toFixed(2)
  );
}

/* ============================================================================
 * Resumen
 * ========================================================================== */

export function capacitySummary(
  totalCapacity: number,
  reservations: Reservation[]
) {
  const occupied = getOccupiedCapacity(reservations);

  const available = getAvailableCapacity(
    totalCapacity,
    reservations
  );

  return {
    total: totalCapacity,

    occupied,

    available,

    percentage: getOccupancyPercentage(
      totalCapacity,
      reservations
    ),

    full: occupied >= totalCapacity,
  };
}


