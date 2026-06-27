export interface RestaurantPWASettings {
  id?: string;

  restaurant_id: string;

  app_name: string;

  short_name: string;

  description: string;

  logo_url: string | null;

  theme_color: string;

  background_color: string;

  display: string;

  orientation: string;

  enable_pwa: boolean;

  created_at?: string;

  updated_at?: string;
}