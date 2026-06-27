export interface RestaurantPWASettings {
  id?: string;

  restaurant_id: string;

  app_name: string;

  short_name: string;

  description: string;

  theme_color: string;

  background_color: string;

  display: string;

  orientation: string;

  app_logo: string | null;

  created_at?: string;

  updated_at?: string;
}