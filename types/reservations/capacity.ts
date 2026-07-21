/* ============================================================================
 * CONFIGURACIÓN DE CAPACIDAD
 * ========================================================================== */

export interface CapacitySettings {
  totalCapacity: number;

  maxReservationSize: number;

  minReservationSize: number;

  allowOverbooking: boolean;

  overbookingLimit: number;
}

/* ============================================================================
 * CAPACIDAD ACTUAL
 * ========================================================================== */

export interface CapacityState {
  date: string;

  occupied: number;

  available: number;

  total: number;

  occupancyPercentage: number;

  full: boolean;
}

/* ============================================================================
 * CAPACIDAD POR HORARIO
 * ========================================================================== */

export interface CapacitySlot {
  date: string;

  startTime: string;

  endTime: string;

  occupied: number;

  available: number;

  total: number;

  occupancyPercentage: number;

  full: boolean;
}

/* ============================================================================
 * SOLICITUD DE VALIDACIÓN
 * ========================================================================== */

export interface CapacityRequest {
  restaurantId: string;

  slug: string;

  date: string;

  startTime: string;

  endTime: string;

  guests: number;
}

/* ============================================================================
 * RESPUESTA
 * ========================================================================== */

export interface CapacityResponse {
  success: boolean;

  available: boolean;

  occupied: number;

  availableSeats: number;

  totalCapacity: number;

  occupancyPercentage: number;

  message?: string;
}

/* ============================================================================
 * MOVIMIENTO DE CAPACIDAD
 * ========================================================================== */

export interface CapacityMovement {
  reservationId: string;

  guests: number;

  action: "reserve" | "release" | "update";

  createdAt: string;
}

/* ============================================================================
 * RESUMEN
 * ========================================================================== */

export interface CapacitySummary {
  totalCapacity: number;

  occupiedCapacity: number;

  remainingCapacity: number;

  occupancyPercentage: number;

  reservations: number;
}

/* ============================================================================
 * PROYECCIÓN
 * ========================================================================== */

export interface CapacityForecast {
  hour: string;

  expectedGuests: number;

  expectedReservations: number;

  occupancyPercentage: number;
}

/* ============================================================================
 * SOPORTE FUTURO PARA MESAS
 * ========================================================================== */

export interface TableCapacity {
  enabled: boolean;

  tables: number;

  occupiedTables: number;

  availableTables: number;
}

/* ============================================================================
 * SOPORTE FUTURO PARA ZONAS
 * ========================================================================== */

export interface ZoneCapacity {
  id: string;

  name: string;

  capacity: number;

  occupied: number;

  available: number;
}

/* ============================================================================
 * MÉTRICAS
 * ========================================================================== */

export interface CapacityMetrics {
  averageOccupancy: number;

  peakOccupancy: number;

  busiestHour: string;

  reservationsToday: number;

  guestsToday: number;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type CapacitySlots = CapacitySlot[];

export type CapacityForecasts = CapacityForecast[];

export type ZoneCapacities = ZoneCapacity[];


