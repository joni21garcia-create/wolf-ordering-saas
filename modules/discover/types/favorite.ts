/**
 * Restaurante guardado como favorito
 * por el cliente en Discover.
 *
 * Este es el modelo que consumirá la UI.
 * No representa directamente la tabla `favorites`.
 */
export interface Favorite {
  id: string;
  restaurant_id: string;

  name: string;
  slug: string;

  logo_url: string | null;
  banner_url: string | null;

  category: string | null;

  active: boolean;
  accepting_orders: boolean;

  created_at: string;
}