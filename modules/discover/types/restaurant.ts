import type { RestaurantSchedule } from "@/lib/schedule";

export interface Restaurant {
  id: string;

  slug: string;

  name: string;

  category: string | null;

  logo_url: string | null;

  banner_url: string | null;

  address: string | null;

  latitude: number | null;

  longitude: number | null;

  /**
   * Controla si el restaurante aparece
   * en Discover.
   */
  discover_visible: boolean;

  /**
   * Estado manual.
   *
   * Si es false, el restaurante aparece
   * como cerrado aunque el horario indique
   * que está abierto.
   */
  accepting_orders: boolean;

  /**
   * Horarios configurados.
   */
  schedule_settings: RestaurantSchedule | null;

  /**
   * Tiempo de preparación.
   */
  estimated_min_time: number | null;

  estimated_max_time: number | null;

  /**
   * Distintivo mostrado en Discover.
   *
   * Valores:
   * - none
   * - wolf
   * - featured
   * - discover
   * - premium
   * - popular
   * - new
   * - promoted
   */
  featured_type: string | null;

  /**
   * Orden de aparición
   * entre los destacados.
   */
  featured_order: number | null;

  /**
   * Funcionalidades opcionales.
   */
  rating?: number | null;

  reviews_count?: number | null;
}

export interface RestaurantGroup {
  title: string;

  restaurants: Restaurant[];
}