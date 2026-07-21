import { z } from "zod";

import {
  ReservationDepositType,
  ReservationPaymentMethod,
  ReservationPaymentStatus,
} from "@/types/reservations";

/* ============================================================================
 * Anticipo
 * ========================================================================== */

export const reservationDepositSchema = z.object({
  enabled: z.boolean(),

  type: z.nativeEnum(ReservationDepositType),

  value: z
    .number()
    .min(0),

  refundable: z.boolean(),

  refundHoursLimit: z
    .number()
    .int()
    .min(0),
});

/* ============================================================================
 * Pago
 * ========================================================================== */

export const reservationPaymentSchema = z.object({
  reservationId: z.string().uuid(),

  amount: z
    .number()
    .positive(),

  currency: z
    .string()
    .min(3)
    .max(10),

  method: z.nativeEnum(
    ReservationPaymentMethod
  ),

  status: z.nativeEnum(
    ReservationPaymentStatus
  ),

  provider: z
    .string()
    .optional(),

  transactionId: z
    .string()
    .optional(),
});

/* ============================================================================
 * Reembolso
 * ========================================================================== */

export const reservationRefundSchema = z.object({
  reservationId: z.string().uuid(),

  paymentId: z.string().uuid(),

  amount: z
    .number()
    .positive(),

  reason: z
    .string()
    .min(5)
    .max(500),
});

/* ============================================================================
 * Comisión
 * ========================================================================== */

export const reservationCommissionSchema = z.object({
  enabled: z.boolean(),

  percentage: z
    .number()
    .min(0)
    .max(100),

  minimumAmount: z
    .number()
    .min(0),

  maximumAmount: z
    .number()
    .min(0)
    .optional(),

  editable: z.boolean(),

  currency: z
    .string()
    .min(3)
    .max(10),
});

/* ============================================================================
 * Resumen financiero
 * ========================================================================== */

export const reservationFinancialSummarySchema = z.object({
  subtotal: z.number(),

  deposit: z.number(),

  remaining: z.number(),

  commission: z.number(),

  total: z.number(),

  currency: z
    .string()
    .min(3)
    .max(10),
});

/* ============================================================================
 * Tipos
 * ========================================================================== */

export type ReservationDepositInput =
  z.infer<typeof reservationDepositSchema>;

export type ReservationPaymentInput =
  z.infer<typeof reservationPaymentSchema>;

export type ReservationRefundInput =
  z.infer<typeof reservationRefundSchema>;

export type ReservationCommissionInput =
  z.infer<typeof reservationCommissionSchema>;

export type ReservationFinancialSummaryInput =
  z.infer<typeof reservationFinancialSummarySchema>;


