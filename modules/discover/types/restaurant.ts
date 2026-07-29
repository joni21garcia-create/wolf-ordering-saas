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
   * Controla si el restaurante aparece en Discover.
   */
  discover_visible: boolean;

  /**
   * Estado manual del restaurante.
   * Puede seguir utilizándose para deshabilitar pedidos
   * aunque el horario indique que está abierto.
   */
  accepting_orders: boolean;

  /**
   * Horarios configurados del restaurante.
   */
  schedule_settings: RestaurantSchedule | null;

  estimated_min_time: number | null;
  estimated_max_time: number | null;

  /**
   * Funcionalidades opcionales.
   */
  rating?: number | null;
  reviews_count?: number | null;
  featured?: boolean;
}

export interface RestaurantGroup {
  title: string;
  restaurants: Restaurant[];
}