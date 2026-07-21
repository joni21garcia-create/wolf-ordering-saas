/* ============================================================================
 * EVENTOS DE RESERVAS
 * ========================================================================== */

export const RESERVATION_EVENTS = {
  CREATED: "reservation.created",

  UPDATED: "reservation.updated",

  CONFIRMED: "reservation.confirmed",

  REJECTED: "reservation.rejected",

  CANCELLED: "reservation.cancelled",

  RESCHEDULED: "reservation.rescheduled",

  CHECK_IN: "reservation.check_in",

  FINISHED: "reservation.finished",

  NO_SHOW: "reservation.no_show",

  EXPIRED: "reservation.expired",
} as const;

/* ============================================================================
 * EVENTOS DE DISPONIBILIDAD
 * ========================================================================== */

export const AVAILABILITY_EVENTS = {
  SLOT_CREATED: "availability.slot.created",

  SLOT_UPDATED: "availability.slot.updated",

  SLOT_BLOCKED: "availability.slot.blocked",

  SLOT_UNBLOCKED: "availability.slot.unblocked",

  CAPACITY_FULL: "availability.capacity.full",
} as const;

/* ============================================================================
 * EVENTOS DE PAGO
 * ========================================================================== */

export const PAYMENT_EVENTS = {
  DEPOSIT_REQUIRED: "payment.deposit.required",

  DEPOSIT_PAID: "payment.deposit.paid",

  PAYMENT_COMPLETED: "payment.completed",

  PAYMENT_FAILED: "payment.failed",

  REFUND_CREATED: "payment.refund.created",

  COMMISSION_GENERATED: "payment.commission.generated",
} as const;

/* ============================================================================
 * EVENTOS DE NOTIFICACIÓN
 * ========================================================================== */

export const NOTIFICATION_EVENTS = {
  EMAIL_SENT: "notification.email.sent",

  WHATSAPP_SENT: "notification.whatsapp.sent",

  PUSH_SENT: "notification.push.sent",

  SMS_SENT: "notification.sms.sent",

  REMINDER_SENT: "notification.reminder.sent",
} as const;

/* ============================================================================
 * EVENTOS DEL DASHBOARD
 * ========================================================================== */

export const DASHBOARD_EVENTS = {
  DAILY_SUMMARY: "dashboard.daily.summary",

  OCCUPANCY_UPDATED: "dashboard.occupancy.updated",

  REPORT_GENERATED: "dashboard.report.generated",
} as const;

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type ReservationEvent =
  (typeof RESERVATION_EVENTS)[keyof typeof RESERVATION_EVENTS];

export type AvailabilityEvent =
  (typeof AVAILABILITY_EVENTS)[keyof typeof AVAILABILITY_EVENTS];

export type PaymentEvent =
  (typeof PAYMENT_EVENTS)[keyof typeof PAYMENT_EVENTS];

export type NotificationEvent =
  (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];

export type DashboardEvent =
  (typeof DASHBOARD_EVENTS)[keyof typeof DASHBOARD_EVENTS];


