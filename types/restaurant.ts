export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  whatsapp: string | null;
  address: string | null;
  active: boolean;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Product {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price: number;
  available: boolean;
  featured: boolean;
}

export interface RestaurantService {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  icon: string;
}

export interface RestaurantGallery {
  id: string;
  restaurant_id: string;
  image_url: string;
}