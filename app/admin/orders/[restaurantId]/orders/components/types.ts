export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
}

export interface Product {
  id: string;
  name: string;
  image_url?: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;

  products?: Product | null;
}

export interface Order {
  id: string;

  restaurant_id: string;

  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "completed"
    | "cancelled";

  total: number;

  subtotal: number;

  delivery_fee: number;

  wolf_amount: number;

  restaurant_amount: number;

  customer_name: string;

  customer_phone: string | null;

  customer_email?: string;

  delivery_address: string | null;

  payment_method: string;

  payment_status:
    | "pending"
    | "paid"
    | "refunded";

  order_type: string;

  tracking_code: string;

  notes: string | null;

  estimated_minutes: number | null;

  payment_confirmed: boolean;

  created_at: string;

  accepted_at?: string | null;

  preparing_at?: string | null;

  ready_at?: string | null;

  completed_at?: string | null;

  order_items?: OrderItem[];
}

export interface OrdersBoardType {
  pending: Order[];

  accepted: Order[];

  preparing: Order[];

  ready: Order[];

  delivery: Order[];

  completed: Order[];
}

export interface DashboardMetrics {
  pending: number;

  preparing: number;

  ready: number;

  sales: number;

  wolf: number;

  restaurant: number;
}