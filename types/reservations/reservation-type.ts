/**
 * ============================================================================
 * WOLF ORDERING
 * Reservation Type
 * ============================================================================
 */

import { ReservationStatus } from "./reservation-status";

/**
 * Tipo de reserva configurable por restaurante.
 */
export interface ReservationType {
  id: string;

  restaurantId: string;

  name: string;

  slug: string;

  description?: string;

  color: string;

  icon?: string;

  active: boolean;

  /**
   * Orden para mostrar en el wizard.
   */
  sortOrder: number;

  /**
   * Duración personalizada en minutos.
   * Si es null se usa la duración general del restaurante.
   */
  durationMinutes?: number | null;

  /**
   * Cantidad mínima de personas.
   */
  minGuests?: number;

  /**
   * Cantidad máxima de personas.
   */
  maxGuests?: number;

  /**
   * Requiere aprobación manual.
   */
  requiresApproval: boolean;

  /**
   * Permite seleccionar servicios adicionales.
   */
  allowExtraServices: boolean;

  /**
   * Requiere anticipo.
   */
  requiresDeposit: boolean;

  /**
   * Anticipo fijo.
   */
  fixedDeposit?: number | null;

  /**
   * Anticipo por persona.
   */
  depositPerGuest?: number | null;

  /**
   * Anticipo porcentual.
   */
  depositPercentage?: number | null;

  /**
   * Estados permitidos para este tipo.
   */
  allowedStatuses?: ReservationStatus[];

  /**
   * Nota interna.
   */
  internalNotes?: string;

  createdAt: string;

  updatedAt: string;
}

/**
 * Datos mínimos para crear un tipo.
 */
export interface CreateReservationTypeDto {
  name: string;

  description?: string;

  color: string;

  icon?: string;

  durationMinutes?: number;

  minGuests?: number;

  maxGuests?: number;

  requiresApproval?: boolean;

  allowExtraServices?: boolean;

  requiresDeposit?: boolean;

  fixedDeposit?: number;

  depositPerGuest?: number;

  depositPercentage?: number;
}

/**
 * Actualización parcial.
 */
export type UpdateReservationTypeDto =
  Partial<CreateReservationTypeDto>;

/**
 * Para mostrar en selectores.
 */
export interface ReservationTypeOption {
  id: string;

  name: string;

  color: string;

  icon?: string;
}

/**
 * Tipo por defecto del sistema.
 */
export const DEFAULT_RESERVATION_TYPE: Omit<
  ReservationType,
  "id" | "restaurantId" | "createdAt" | "updatedAt"
> = {
  name: "Reserva",

  slug: "reserva",

  description: "",

  color: "#3B82F6",

  icon: "Calendar",

  active: true,

  sortOrder: 1,

  durationMinutes: null,

  minGuests: 1,

  maxGuests: 20,

  requiresApproval: true,

  allowExtraServices: true,

  requiresDeposit: false,

  fixedDeposit: null,

  depositPerGuest: null,

  depositPercentage: null,

  allowedStatuses: [
    ReservationStatus.PENDING,
    ReservationStatus.CONFIRMED,
    ReservationStatus.CHECKED_IN,
    ReservationStatus.COMPLETED,
    ReservationStatus.CANCELLED,
    ReservationStatus.REJECTED,
    ReservationStatus.NO_SHOW,
    ReservationStatus.EXPIRED,
  ],

  internalNotes: "",
};

/**
 * Tipos sugeridos.
 */
export const DEFAULT_RESERVATION_TYPES = [
  {
    name: "Reserva",
    color: "#3B82F6",
    icon: "Calendar",
  },
  {
    name: "Cumpleaños",
    color: "#EC4899",
    icon: "Cake",
  },
  {
    name: "Cena Romántica",
    color: "#EF4444",
    icon: "Heart",
  },
  {
    name: "Evento Empresarial",
    color: "#6366F1",
    icon: "Briefcase",
  },
  {
    name: "Reunión Familiar",
    color: "#22C55E",
    icon: "Users",
  },
  {
    name: "Aniversario",
    color: "#F59E0B",
    icon: "Gift",
  },
  {
    name: "VIP",
    color: "#8B5CF6",
    icon: "Crown",
  },
] as const;

