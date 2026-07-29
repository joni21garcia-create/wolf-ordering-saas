export interface Restaurant {
  id: string;
  slug: string;
  name: string;

  logo_url: string | null;
  banner_url: string | null;

  category: string | null;

  address: string | null;

  accepting_orders: boolean;

  estimated_min_time: number | null;
  estimated_max_time: number | null;

  latitude: number | null;
  longitude: number | null;
}

export interface RestaurantGroup {
  title: string;
  restaurants: Restaurant[];
}