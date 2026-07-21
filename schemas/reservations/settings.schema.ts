import { z } from "zod";

/* ============================================================================
 * Horario semanal
 * ========================================================================== */

export const workingHourSchema = z.object({
  day: z
    .number()
    .int()
    .min(0)
    .max(6),

  enabled: z.boolean(),

  open: z.string(),

  close: z.string(),
});

/* ============================================================================
 * Bloqueos
 * ========================================================================== */

export const blockedSlotSchema = z.object({
  date: z.string(),

  startTime: z.string(),

  endTime: z.string(),

  reason: z
    .string()
    .max(250)
    .optional(),
});

/* ============================================================================
 * Fechas especiales
 * ========================================================================== */

export const specialDateSchema = z.object({
  date: z.string(),

  enabled: z.boolean(),

  open: z.string(),

  close: z.string(),

  description: z
    .string()
    .max(250)
    .optional(),
});

/* ============================================================================
 * Configuración general
 * ========================================================================== */

export const reservationGeneralSettingsSchema = z.object({
  enabled: z.boolean(),

  autoConfirm: z.boolean(),

  allowCancellation: z.boolean(),

  cancellationHours: z
    .number()
    .int()
    .min(0),

  allowReschedule: z.boolean(),

  rescheduleHours: z
    .number()
    .int()
    .min(0),

  minGuestsPerReservation: z
    .number()
    .int()
    .positive(),

  maxGuestsPerReservation: z
    .number()
    .int()
    .positive(),
});

/* ============================================================================
 * Capacidad
 * ========================================================================== */

export const reservationCapacitySchema = z.object({
  maxCapacity: z
    .number()
    .int()
    .positive(),

  capacityPerSlot: z
    .number()
    .int()
    .positive()
    .optional(),

  reservationDuration: z
    .number()
    .int()
    .positive(),

  cleaningTime: z
    .number()
    .int()
    .min(0),
});

/* ============================================================================
 * Anticipación
 * ========================================================================== */

export const reservationAdvanceSchema = z.object({
  minimumHours: z
    .number()
    .int()
    .min(0),

  maximumDays: z
    .number()
    .int()
    .positive(),
});

/* ============================================================================
 * Configuración completa
 * ========================================================================== */

export const reservationSettingsSchema = z.object({
  restaurantId: z.string().uuid(),

  general: reservationGeneralSettingsSchema,

  capacity: reservationCapacitySchema,

  advance: reservationAdvanceSchema,

  workingHours: z.array(workingHourSchema),

  blockedSlots: z.array(blockedSlotSchema),

  specialDates: z.array(specialDateSchema),
});

/* ============================================================================
 * Tipos
 * ========================================================================== */

export type WorkingHourInput =
  z.infer<typeof workingHourSchema>;

export type BlockedSlotInput =
  z.infer<typeof blockedSlotSchema>;

export type SpecialDateInput =
  z.infer<typeof specialDateSchema>;

export type ReservationGeneralSettingsInput =
  z.infer<typeof reservationGeneralSettingsSchema>;

export type ReservationCapacityInput =
  z.infer<typeof reservationCapacitySchema>;

export type ReservationAdvanceInput =
  z.infer<typeof reservationAdvanceSchema>;

export type ReservationSettingsInput =
  z.infer<typeof reservationSettingsSchema>;


