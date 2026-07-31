import { createClient } from "@supabase/supabase-js";

import {
  CUSTOMER_MESSAGES,
  CustomerOrderStatus,
} from "@/lib/push/customerMessages";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BuildCustomerNotificationParams {
  orderId: string;
  status: CustomerOrderStatus;
}

export interface CustomerNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  url: string;
  pushSubscriptionId: number | null;
}

export async function buildCustomerNotification({
  orderId,
  status,
}: BuildCustomerNotificationParams): Promise<CustomerNotificationPayload | null> {

  const {
    data: order,
    error,
  } = await supabase

    .from("orders")

    .select(`
      tracking_code,
      push_subscription_id,

      restaurant:restaurants(
        name,
        logo_url
      )
    `)

    .eq("id", orderId)

    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!order) {
    return null;
  }

if (!order.restaurant) {
  return null;
}

const restaurant = Array.isArray(order.restaurant)
  ? order.restaurant[0]
  : order.restaurant;

if (!restaurant) {
  return null;
}

return {

  title: `🍕 ${restaurant.name}`,

    body:
      CUSTOMER_MESSAGES[status].body,

icon:
  restaurant.logo_url ?? undefined,

image:
  restaurant.logo_url ?? undefined,

    url:
      `/tracking/${order.tracking_code}`,

    pushSubscriptionId:
      order.push_subscription_id,

  };

}