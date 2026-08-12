/**
 * Estados que puede mostrar el historial de pedidos de Discover.
 *
 * Estos valores son internos de la UI. El servicio customerOrders.ts
 * se encarga de convertir los estados reales de Supabase.
 */
export type CustomerOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "on_the_way"
  | "delivered"
  | "cancelled";

/**
 * Producto mostrado dentro del detalle de un pedido.
 */
export interface CustomerOrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

/**
 * Evento de la línea de tiempo.
 */
export interface CustomerOrderTimelineEvent {
  status: CustomerOrderStatus;
  label: string;
  timestamp: string | null;
  completed: boolean;
  current: boolean;
}

/**
 * Restaurante asociado al pedido.
 */
export interface CustomerOrderRestaurant {
  id: string;
  name: string;
  logo_url: string | null;
}

/**
 * Modelo limpio que consume toda la UI de Pedidos.
 *
 * No representa directamente la tabla orders de Supabase.
 * customerOrders.ts transforma los datos reales a este modelo.
 */
export interface CustomerOrder {
  id: string;

  /**
   * Código visible del pedido.
   * En la fuente real corresponde al tracking_code.
   */
  order_number: string;

  restaurant: CustomerOrderRestaurant;

  /**
   * Fecha y hora de creación del pedido.
   */
  created_at: string;

  /**
   * Estado actual normalizado para la UI.
   */
  status: CustomerOrderStatus;

  /**
   * Productos y cantidades.
   */
  items: CustomerOrderItem[];

  /**
   * Total final del pedido.
   */
  total: number;

  /**
   * Estados preparados para renderizar la línea de tiempo.
   */
  timeline: CustomerOrderTimelineEvent[];
}