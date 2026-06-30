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


export interface ManagerPWASettings {
  app_name: string;
  short_name: string;
  description: string;
  theme_color?: string;
  background_color?: string;
  app_logo?: string | null;
  display: string;
  orientation: string;
}

export interface UploadResult {
  url?: string;
  path?: string;
  success: boolean;
  error?: string;
  logo?: {
    url: string;
    path: string;
  };
}