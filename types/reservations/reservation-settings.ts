/* ============================================================================
 * HORARIO DE ATENCIÓN
 * ========================================================================== */

export interface ReservationWorkingHour {
  day: number; // 0 = Domingo, 6 = Sábado

  enabled: boolean;

  open: string;

  close: string;
}

/* ============================================================================
 * HORARIOS BLOQUEADOS
 * ========================================================================== */

export interface ReservationBlockedSlot {
  id: string;

  date: string;

  startTime: string;

  endTime: string;

  reason?: string;
}

/* ============================================================================
 * FECHAS ESPECIALES
 * ========================================================================== */

export interface ReservationSpecialDate {
  id: string;

  date: string;

  open: string;

  close: string;

  enabled: boolean;

  description?: string;
}

/* ============================================================================
 * CONFIGURACIÓN DE CAPACIDAD
 * ========================================================================== */

export interface ReservationCapacitySettings {
  maxCapacity: number;

  capacityPerSlot?: number;

  reservationDuration: number;

  cleaningTime: number;
}

/* ============================================================================
 * CONFIGURACIÓN DE ANTICIPACIÓN
 * ========================================================================== */

export interface ReservationAdvanceSettings {
  minimumHours: number;

  maximumDays: number;
}

/* ============================================================================
 * CONFIGURACIÓN GENERAL
 * ========================================================================== */

export interface ReservationGeneralSettings {
  enabled: boolean;

  autoConfirm: boolean;

  allowCancellation: boolean;

  cancellationHours: number;

  allowReschedule: boolean;

  rescheduleHours: number;

  maxGuestsPerReservation: number;

  minGuestsPerReservation: number;
}

/* ============================================================================
 * CONFIGURACIÓN COMPLETA
 * ========================================================================== */

export interface ReservationSettings {
  restaurantId: string;

  general: ReservationGeneralSettings;

  capacity: ReservationCapacitySettings;

  advance: ReservationAdvanceSettings;

  workingHours: ReservationWorkingHour[];

  blockedSlots: ReservationBlockedSlot[];

  specialDates: ReservationSpecialDate[];

  createdAt: string;

  updatedAt: string;
}


