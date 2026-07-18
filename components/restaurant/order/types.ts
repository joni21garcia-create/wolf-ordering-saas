export interface DeliverySettings {
  delivery_enabled: boolean;
  pickup_enabled: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image_url?: string | null;
  deliverySettings?: DeliverySettings;
}

export interface Product {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  image_url?: string |null;
}

export interface CartItem extends Product {
  display_price: number;
  quantity: number;
}

export interface CustomerData {
  name?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export type OrderType =
  | "delivery"
  | "pickup"
  | null;

export interface CommissionConfig {
  commission_type: "fixed" | "percentage";
  commission_value: number;
}