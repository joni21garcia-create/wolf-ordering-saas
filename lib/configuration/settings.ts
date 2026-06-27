export interface PlatformSettings {
  commission_percent: number;

  default_delivery_fee: number;

  tax_percent: number;

  currency: string;
}

export interface RestaurantSettings {
  restaurant_pays_commission: boolean;

  delivery_fee: number;

  minimum_order: number;

  free_delivery_from: number;

  pickup_enabled: boolean;

  delivery_enabled: boolean;

  latitude?: number;

  longitude?: number;

  delivery_radius_km: number;

  accepts_cash: boolean;

  accepts_card: boolean;

  accepts_transfer: boolean;
}