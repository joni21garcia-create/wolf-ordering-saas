import { z } from "zod";

import {
  ReservationStatus,
} from "@/types/reservations";

/* ============================================================================
 * Invitado
 * ========================================================================== */

export const reservationGuestSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "El nombre es obligatorio")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  phone: z
    .string()
    .trim()
    .min(6)
    .max(25),

  email: z
    .string()
    .email()
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .max(500)
    .optional(),
});

/* ============================================================================
 * Fecha
 * ========================================================================== */

export const reservationDateSchema = z.object({
  date: z.string(),

  startTime: z.string(),

  endTime: z.string(),
});

/* ============================================================================
 * Reserva
 * ========================================================================== */

export const reservationSchema = z.object({
  restaurantId: z.string().uuid(),

  guest: reservationGuestSchema,

  schedule: reservationDateSchema,

  guests: z
    .number()
    .int()
    .min(1)
    .max(100),

  reservationTypeId: z
    .string()
    .uuid()
    .optional(),

  serviceIds: z
    .array(z.string().uuid())
    .default([]),

  status: z.nativeEnum(ReservationStatus),

  internalNotes: z
    .string()
    .max(1000)
    .optional(),
});

/* ============================================================================
 * Crear
 * ========================================================================== */

export const createReservationSchema =
  reservationSchema.omit({
    status: true,
  });

/* ============================================================================
 * Actualizar
 * ========================================================================== */

export const updateReservationSchema =
  reservationSchema.partial();

/* ============================================================================
 * Tipos
 * ========================================================================== */

export type ReservationInput =
  z.infer<typeof reservationSchema>;

export type CreateReservationInput =
  z.infer<typeof createReservationSchema>;

export type UpdateReservationInput =
  z.infer<typeof updateReservationSchema>;


