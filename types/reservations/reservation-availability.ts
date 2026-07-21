import type { ReservationAvailability } from "./reservation";

/* ============================================================================
 * SLOT DISPONIBLE
 * ========================================================================== */

export interface AvailableSlot {
  date: string;

  startTime: string;

  endTime: string;

  available: boolean;

  reason?: string;

  remainingCapacity: number;

  occupiedCapacity: number;

  totalCapacity: number;

  occupancyPercentage: number;
}

/* ============================================================================
 * DÍA DISPONIBLE
 * ========================================================================== */

export interface AvailableDay {
  date: string;

  enabled: boolean;

  closed: boolean;

  holiday: boolean;

  specialDate: boolean;

  slots: AvailableSlot[];
}

/* ============================================================================
 * RANGO
 * ========================================================================== */

export interface AvailabilityRange {
  from: string;

  to: string;

  days: AvailableDay[];
}

/* ============================================================================
 * CONSULTA
 * ========================================================================== */

export interface AvailabilityRequest {
  restaurantId: string;

  slug: string;

  guests: number;

  date: string;

  typeId?: string;
}

/* ============================================================================
 * RESPUESTA
 * ========================================================================== */

export interface AvailabilityResponse {
  success: boolean;

  availability: ReservationAvailability[];

  generatedAt: string;
}

/* ============================================================================
 * VALIDACIÓN
 * ========================================================================== */

export interface AvailabilityValidation {
  available: boolean;

  message?: string;

  remainingCapacity: number;

  occupiedCapacity: number;
}

/* ============================================================================
 * BLOQUEO
 * ========================================================================== */

export interface AvailabilityBlock {
  id: string;

  restaurantId: string;

  date: string;

  startTime?: string;

  endTime?: string;

  reason: string;

  createdAt: string;
}

/* ============================================================================
 * CIERRE TEMPORAL
 * ========================================================================== */

export interface TemporaryClosure {
  id: string;

  restaurantId: string;

  from: string;

  to: string;

  reason: string;

  enabled: boolean;
}

/* ============================================================================
 * FECHA ESPECIAL
 * ========================================================================== */

export interface SpecialDate {
  id: string;

  restaurantId: string;

  date: string;

  title: string;

  open: boolean;

  startTime?: string;

  endTime?: string;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type SlotList = AvailableSlot[];

export type DayAvailability = AvailableDay[];

export type AvailabilityMap = Record<string, AvailableSlot[]>;


