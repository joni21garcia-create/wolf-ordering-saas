/* ============================================================================
 * MÉTODOS DE PAGO
 * ========================================================================== */

export enum ReservationPaymentMethod {
  CASH = "cash",
  CARD = "card",
  TRANSFER = "transfer",
  ONLINE = "online",
  WALLET = "wallet",
  OTHER = "other",
}

/* ============================================================================
 * ESTADOS DEL PAGO
 * ========================================================================== */

export enum ReservationPaymentStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

/* ============================================================================
 * TIPOS DE ANTICIPO
 * ========================================================================== */

export enum ReservationDepositType {
  NONE = "none",
  FIXED = "fixed",
  PER_PERSON = "per_person",
  PERCENTAGE = "percentage",
}

/* ============================================================================
 * CONFIGURACIÓN DEL ANTICIPO
 * ========================================================================== */

export interface ReservationDepositConfig {
  enabled: boolean;

  type: ReservationDepositType;

  value: number;

  refundable: boolean;

  refundHoursLimit: number;
}

/* ============================================================================
 * PAGO
 * ========================================================================== */

export interface ReservationPayment {
  id: string;

  reservationId: string;

  amount: number;

  currency: string;

  status: ReservationPaymentStatus;

  method: ReservationPaymentMethod;

  transactionId?: string;

  provider?: string;

  paidAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================================
 * ANTICIPO
 * ========================================================================== */

export interface ReservationDeposit {
  required: boolean;

  amount: number;

  paid: number;

  pending: number;

  paidAt?: string;

  paymentId?: string;
}

/* ============================================================================
 * REEMBOLSO
 * ========================================================================== */

export interface ReservationRefund {
  id: string;

  reservationId: string;

  paymentId: string;

  amount: number;

  reason: string;

  createdAt: string;
}

/* ============================================================================
 * COMISIÓN DEL SAAS
 * ========================================================================== */

export interface ReservationCommission {
  enabled: boolean;

  percentage: number;

  amount: number;

  charged: boolean;

  chargedAt?: string;
}

/* ============================================================================
 * RESUMEN FINANCIERO
 * ========================================================================== */

export interface ReservationFinancialSummary {
  subtotal: number;

  deposit: number;

  remaining: number;

  commission: number;

  total: number;

  currency: string;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type Payments = ReservationPayment[];

export type Refunds = ReservationRefund[];


