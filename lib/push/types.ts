/*
==========================================================

Wolf Ordering Push V2

Tipos centrales del sistema

==========================================================
*/

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;

  image?: string;
}

export interface PushSubscriptionDevice {

  id: number;

  restaurant_id?: string | null;

  user_id?: string | null;

  endpoint?: string | null;

  subscription?: PushSubscription | null;

  fcm_token?: string | null;

  platform?: "web" | "pwa" | "android" | null;

  user_agent?: string | null;

  active?: boolean;

}

export interface PushEngineResult {

  web: boolean;

  android: boolean;

}

export interface RegisterWebInput {

  restaurantId: string;

  userId?: string;

}

export interface RegisterAndroidInput {

  token: string;

  restaurantId?: string;

  userId?: string;

  platform?: "android";

}

export interface RestaurantPushInput {
  restaurantId: string;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  image?: string;
}

export interface CustomerPushInput {
  orderId: string;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  image?: string;
}

export interface DriverPushInput {
  title: string;
  body: string;
  data?: Record<string, string>;
}