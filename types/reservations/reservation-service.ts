/**
 * ============================================================================
 * WOLF ORDERING
 * Reservation Service Types
 * ============================================================================
 */

/**
 * Servicio adicional configurable por restaurante.
 */
export interface ReservationService {
  id: string;

  restaurantId: string;

  name: string;

  slug: string;

  description?: string;

  image?: string | null;

  icon?: string | null;

  color?: string | null;

  active: boolean;

  /**
   * Precio del servicio.
   */
  price: number;

  /**
   * Cantidad máxima disponible por día.
   * null = ilimitado
   */
  maxQuantityPerDay: number | null;

  /**
   * Máximo por reserva.
   */
  maxQuantityPerReservation: number;

  /**
   * ¿Es obligatorio?
   */
  required: boolean;

  /**
   * Visible para el cliente.
   */
  visible: boolean;

  /**
   * Puede elegirse varias veces.
   */
  allowMultiple: boolean;

  /**
   * Orden de visualización.
   */
  sortOrder: number;

  /**
   * Disponible únicamente para ciertos tipos de reserva.
   */
  reservationTypeIds?: string[];

  createdAt: string;

  updatedAt: string;
}

/**
 * Servicio agregado dentro de una reserva.
 */
export interface ReservationSelectedService {
  serviceId: string;

  name: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  notes?: string;
}

/**
 * DTO creación.
 */
export interface CreateReservationServiceDto {
  name: string;

  description?: string;

  image?: string;

  icon?: string;

  color?: string;

  price: number;

  maxQuantityPerDay?: number | null;

  maxQuantityPerReservation?: number;

  required?: boolean;

  visible?: boolean;

  allowMultiple?: boolean;

  reservationTypeIds?: string[];
}

/**
 * DTO actualización.
 */
export type UpdateReservationServiceDto =
  Partial<CreateReservationServiceDto>;

/**
 * Opción para selector.
 */
export interface ReservationServiceOption {
  id: string;

  name: string;

  price: number;

  icon?: string;

  color?: string;
}

/**
 * Servicio por defecto.
 */
export const DEFAULT_RESERVATION_SERVICE: Omit<
  ReservationService,
  "id" | "restaurantId" | "createdAt" | "updatedAt"
> = {
  name: "",

  slug: "",

  description: "",

  image: null,

  icon: "Package",

  color: "#3B82F6",

  active: true,

  price: 0,

  maxQuantityPerDay: null,

  maxQuantityPerReservation: 1,

  required: false,

  visible: true,

  allowMultiple: false,

  sortOrder: 1,

  reservationTypeIds: [],
};

/**
 * Servicios sugeridos.
 */
export const DEFAULT_RESERVATION_SERVICES = [
  {
    name: "Decoración",
    icon: "Sparkles",
    color: "#EC4899",
    price: 20,
  },
  {
    name: "Pastel",
    icon: "Cake",
    color: "#F97316",
    price: 35,
  },
  {
    name: "Botella de vino",
    icon: "Wine",
    color: "#7C3AED",
    price: 40,
  },
  {
    name: "Champagne",
    icon: "GlassWater",
    color: "#F59E0B",
    price: 70,
  },
  {
    name: "Sala privada",
    icon: "DoorClosed",
    color: "#2563EB",
    price: 120,
  },
  {
    name: "Proyector",
    icon: "Monitor",
    color: "#14B8A6",
    price: 30,
  },
  {
    name: "Música en vivo",
    icon: "Music4",
    color: "#22C55E",
    price: 150,
  },
  {
    name: "Mariachi",
    icon: "Music2",
    color: "#DC2626",
    price: 250,
  },
] as const;


