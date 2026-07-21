import { z } from "zod";

/* ============================================================================
 * Rango de tiempo
 * ========================================================================== */

export const timeRangeSchema = z.object({
  start: z.string().min(1),

  end: z.string().min(1),
});

/* ============================================================================
 * Horario disponible
 * ========================================================================== */

export const availabilitySlotSchema = z.object({
  date: z.string(),

  startTime: z.string(),

  endTime: z.string(),

  available: z.boolean(),

  remainingCapacity: z.number().int().min(0),

  occupiedCapacity: z.number().int().min(0),

  totalCapacity: z.number().int().positive(),

  label: z.string(),

  reason: z.string().optional(),
});

/* ============================================================================
 * Consulta de disponibilidad
 * ========================================================================== */

export const availabilityQuerySchema = z.object({
  restaurantId: z.string().uuid(),

  date: z.string(),

  guests: z.number().int().positive(),

  reservationTypeId: z.string().uuid().optional(),
});

/* ============================================================================
 * Resultado
 * ========================================================================== */

export const availabilityResultSchema = z.object({
  date: z.string(),

  slots: z.array(availabilitySlotSchema),
});

/* ============================================================================
 * Bloqueo
 * ========================================================================== */

export const blockedSlotSchema = z.object({
  date: z.string(),

  startTime: z.string(),

  endTime: z.string(),

  reason: z.string().optional(),
});

/* ============================================================================
 * Tipos
 * ========================================================================== */

export type TimeRangeInput =
  z.infer<typeof timeRangeSchema>;

export type AvailabilitySlotInput =
  z.infer<typeof availabilitySlotSchema>;

export type AvailabilityQueryInput =
  z.infer<typeof availabilityQuerySchema>;

export type AvailabilityResultInput =
  z.infer<typeof availabilityResultSchema>;

export type BlockedSlotInput =
  z.infer<typeof blockedSlotSchema>;

