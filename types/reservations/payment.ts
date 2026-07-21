/* ============================================================================
 * RESERVATION PAYMENTS
 * ========================================================================== */


export enum ReservationDepositType {

  FIXED = "fixed",

  PERCENTAGE = "percentage",

}



export enum ReservationPaymentMethod {

  CASH = "cash",

  CARD = "card",

  TRANSFER = "transfer",

  ONLINE = "online",

}



export enum ReservationPaymentStatus {

  PENDING = "pending",

  PAID = "paid",

  FAILED = "failed",

  REFUNDED = "refunded",

  CANCELLED = "cancelled",

}



/* ============================================================================
 * PAYMENT INPUT TYPES
 * ========================================================================== */


export interface ReservationRefund {

  id:string;

  reservationId:string;

  paymentId:string;

  amount:number;

  reason:string;

}



export interface ReservationFinancialSummary {

  subtotal:number;

  deposit:number;

  remaining:number;

  commission:number;

  total:number;

  currency:string;

}

