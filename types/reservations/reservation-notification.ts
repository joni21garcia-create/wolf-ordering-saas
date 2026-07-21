/* ============================================================================
 * CANALES DE NOTIFICACIÓN
 * ========================================================================== */

export enum ReservationNotificationChannel {
  EMAIL = "email",

  WHATSAPP = "whatsapp",

  PUSH = "push",

  SMS = "sms",
}

/* ============================================================================
 * EVENTOS
 * ========================================================================== */

export enum ReservationNotificationEvent {
  CREATED = "created",

  CONFIRMED = "confirmed",

  REJECTED = "rejected",

  CANCELLED = "cancelled",

  RESCHEDULED = "rescheduled",

  REMINDER = "reminder",

  CHECK_IN = "check_in",

  FINISHED = "finished",

  NO_SHOW = "no_show",
}

/* ============================================================================
 * ESTADO
 * ========================================================================== */

export enum ReservationNotificationStatus {
  PENDING = "pending",

  SENDING = "sending",

  SENT = "sent",

  FAILED = "failed",

  CANCELLED = "cancelled",
}

/* ============================================================================
 * CONFIGURACIÓN
 * ========================================================================== */

export interface ReservationNotificationSettings {
  email: boolean;

  whatsapp: boolean;

  push: boolean;

  sms: boolean;

  reminder24h: boolean;

  reminder2h: boolean;

  reminder30m: boolean;
}

/* ============================================================================
 * NOTIFICACIÓN
 * ========================================================================== */

export interface ReservationNotification {
  id: string;

  reservationId: string;

  restaurantId: string;

  event: ReservationNotificationEvent;

  channel: ReservationNotificationChannel;

  status: ReservationNotificationStatus;

  recipient: string;

  subject?: string;

  message: string;

  scheduledAt?: string;

  sentAt?: string;

  createdAt: string;
}

/* ============================================================================
 * RECORDATORIO
 * ========================================================================== */

export interface ReservationReminder {
  id: string;

  reservationId: string;

  sendAt: string;

  channel: ReservationNotificationChannel;

  sent: boolean;
}

/* ============================================================================
 * PLANTILLA
 * ========================================================================== */

export interface ReservationNotificationTemplate {
  id: string;

  name: string;

  event: ReservationNotificationEvent;

  channel: ReservationNotificationChannel;

  subject?: string;

  content: string;

  enabled: boolean;
}

/* ============================================================================
 * RESPUESTA
 * ========================================================================== */

export interface NotificationResponse {
  success: boolean;

  notificationId?: string;

  message: string;
}

/* ============================================================================
 * HELPERS
 * ========================================================================== */

export type ReservationNotifications = ReservationNotification[];

export type ReservationTemplates = ReservationNotificationTemplate[];

export type ReservationReminders = ReservationReminder[];


