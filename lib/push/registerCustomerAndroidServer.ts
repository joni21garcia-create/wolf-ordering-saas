/*
==========================================================

Wolf Ordering Push V2

Registro Android Cliente (Servidor)

==========================================================
*/

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RegisterCustomerAndroidServerInput {
  restaurantId: string;
  token: string;
  platform?: "android";
}

interface RegisterCustomerAndroidServerResult {
  success: boolean;
  subscriptionId?: number;
  error?: string;
}

export async function registerCustomerAndroidServer({
  restaurantId,
  token,
  platform = "android",
}: RegisterCustomerAndroidServerInput): Promise<RegisterCustomerAndroidServerResult> {

  if (!restaurantId) {
    return {
      success: false,
      error: "Restaurant ID vacío.",
    };
  }

  if (!token) {
    return {
      success: false,
      error: "Token vacío.",
    };
  }

  try {

    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          restaurant_id: restaurantId,

          fcm_token: token,

          platform,

          active: true,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "fcm_token",
        }
      )
      .select("id")
      .single();

    if (error) {

      console.error(
        "[CUSTOMER ANDROID SERVER]",
        error
      );

      return {
        success: false,
        error: error.message,
      };

    }

    console.log(
      "[CUSTOMER ANDROID SERVER] Dispositivo registrado:",
      data.id
    );

    return {
      success: true,
      subscriptionId: data.id,
    };

  } catch (error: any) {

    console.error(
      "[CUSTOMER ANDROID SERVER]",
      error
    );

    return {
      success: false,
      error: error?.message ?? "Error interno",
    };

  }

}