/* ============================================================================
 * PERMISOS DEL MÓDULO DE RESERVAS
 * ========================================================================== */

export const RESERVATION_PERMISSIONS = {
  /* ==========================================================
   * Dashboard
   * ======================================================== */

  VIEW_DASHBOARD: "reservations.dashboard.view",

  /* ==========================================================
   * Reservas
   * ======================================================== */

  VIEW_RESERVATIONS: "reservations.view",

  CREATE_RESERVATION: "reservations.create",

  UPDATE_RESERVATION: "reservations.update",

  DELETE_RESERVATION: "reservations.delete",

  /* ==========================================================
   * Estados
   * ======================================================== */

  CONFIRM_RESERVATION: "reservations.confirm",

  REJECT_RESERVATION: "reservations.reject",

  CANCEL_RESERVATION: "reservations.cancel",

  RESCHEDULE_RESERVATION: "reservations.reschedule",

  CHECKIN_RESERVATION: "reservations.checkin",

  FINISH_RESERVATION: "reservations.finish",

  MARK_NO_SHOW: "reservations.no_show",

  /* ==========================================================
   * Calendario
   * ======================================================== */

  VIEW_CALENDAR: "reservations.calendar.view",

  MANAGE_CALENDAR: "reservations.calendar.manage",

  /* ==========================================================
   * Capacidad
   * ======================================================== */

  VIEW_CAPACITY: "reservations.capacity.view",

  MANAGE_CAPACITY: "reservations.capacity.manage",

  /* ==========================================================
   * Tipos de reserva
   * ======================================================== */

  VIEW_TYPES: "reservations.types.view",

  MANAGE_TYPES: "reservations.types.manage",

  /* ==========================================================
   * Servicios
   * ======================================================== */

  VIEW_SERVICES: "reservations.services.view",

  MANAGE_SERVICES: "reservations.services.manage",

  /* ==========================================================
   * Pagos
   * ======================================================== */

  VIEW_PAYMENTS: "reservations.payments.view",

  MANAGE_PAYMENTS: "reservations.payments.manage",

  REFUND_PAYMENT: "reservations.payments.refund",

  /* ==========================================================
   * Reportes
   * ======================================================== */

  VIEW_REPORTS: "reservations.reports.view",

  EXPORT_REPORTS: "reservations.reports.export",

  /* ==========================================================
   * Configuración
   * ======================================================== */

  VIEW_SETTINGS: "reservations.settings.view",

  MANAGE_SETTINGS: "reservations.settings.manage",

  /* ==========================================================
   * Notificaciones
   * ======================================================== */

  SEND_NOTIFICATIONS: "reservations.notifications.send",
} as const;

/* ============================================================================
 * TYPES
 * ========================================================================== */

export type ReservationPermission =
  (typeof RESERVATION_PERMISSIONS)[keyof typeof RESERVATION_PERMISSIONS];


