/* ============================================================================
 * CONFIGURACIÓN DE COMISIÓN
 * ========================================================================== */

export interface ReservationCommissionSettings {
  enabled: boolean;

  percentage: number;

  minimumAmount: number;

  maximumAmount?: number;

  editable: boolean;

  currency: string;
}

/* ============================================================================
 * COMISIÓN GENERADA
 * ========================================================================== */

export interface ReservationCommission {
  id: string;

  reservationId: string;

  restaurantId: string;

  subtotal: number;

  percentage: number;

  amount: number;

  currency: string;

  calculatedAt: string;
}

/* ============================================================================
 * ESTADO DE LIQUIDACIÓN
 * ========================================================================== */

export enum CommissionSettlementStatus {
  PENDING = "pending",

  PROCESSING = "processing",

  PAID = "paid",

  CANCELLED = "cancelled",
}

/* ============================================================================
 * LIQUIDACIÓN
 * ========================================================================== */

export interface CommissionSettlement {
  id: string;

  restaurantId: string;

  from: string;

  to: string;

  reservations: number;

  subtotal: number;

  totalCommission: number;

  currency: string;

  status: CommissionSettlementStatus;

  generatedAt: string;

  paidAt?: string;
}

/* ============================================================================
 * RESUMEN
 * ========================================================================== */

export interface CommissionSummary {
  totalReservations: number;

  totalSales: number;

  totalCommission: number;

  pendingCommission: number;

  paidCommission: number;

  currency: string;
}

/* ============================================================================
 * HISTORIAL
 * ========================================================================== */

export interface CommissionHistoryItem {
  reservationId: string;

  confirmationCode: string;

  guestName: string;

  reservationDate: string;

  subtotal: number;

  percentage: number;

  commission: number;

  currency: string;
}

/* ============================================================================
 * FILTROS
 * ========================================================================== */

export interface CommissionFilters {
  from?: string;

  to?: string;

  status?: CommissionSettlementStatus;

  restaurantId?: string;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type CommissionHistory = CommissionHistoryItem[];

export type CommissionSettlements = CommissionSettlement[];


