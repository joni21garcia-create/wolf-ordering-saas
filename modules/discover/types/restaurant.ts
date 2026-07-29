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

  // Preparado para futuras funcionalidades
  rating?: number | null;
  reviews_count?: number | null;
  featured?: boolean;
}

export interface RestaurantGroup {
  title: string;
  restaurants: Restaurant[];
}