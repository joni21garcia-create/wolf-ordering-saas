/*
==========================================================

Wolf Ordering Push V2

Registro Android (Servidor)

==========================================================
*/

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RegisterAndroidServerInput {
  restaurantId: string;
  userId: string;
  token: string;
  platform?: "android";
}

interface RegisterAndroidServerResult {
  success: boolean;
  subscriptionId?: number;
}

export async function registerAndroidServer({
  restaurantId,
  userId,
  token,
  platform = "android",
}: RegisterAndroidServerInput): Promise<RegisterAndroidServerResult> {

  if (!restaurantId) {

    console.error(
      "[ANDROID SERVER] Restaurant ID vacío."
    );

    return {
      success: false,
    };

  }

  if (!userId) {

    console.error(
      "[ANDROID SERVER] User ID vacío."
    );

    return {
      success: false,
    };

  }

  if (!token) {

    console.error(
      "[ANDROID SERVER] Token vacío."
    );

    return {
      success: false,
    };

  }

  try {

    console.log("================================");
    console.log("[ANDROID SERVER] Iniciando registro");
    console.log("[ANDROID SERVER] Restaurant:", restaurantId);
    console.log("[ANDROID SERVER] User:", userId);
    console.log("[ANDROID SERVER] Platform:", platform);
    console.log("[ANDROID SERVER] Token:", token);
    console.log("================================");

    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          restaurant_id: restaurantId,
          user_id: userId,
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

    console.log("[ANDROID SERVER] DATA");
    console.log(data);

    console.log("[ANDROID SERVER] ERROR");
    console.log(error);

    if (error) {

      console.error(
        "[ANDROID SERVER] Error al registrar:",
        error
      );

      return {
        success: false,
      };

    }

    const { data: verify, error: verifyError } = await supabase
      .from("push_subscriptions")
      .select("id, platform, fcm_token, restaurant_id")
      .eq("id", data.id)
      .maybeSingle();

    console.log("[ANDROID SERVER] VERIFY:");
    console.log(verify);

    console.log("[ANDROID SERVER] VERIFY ERROR:");
    console.log(verifyError);

    console.log(
      "[ANDROID SERVER] Dispositivo registrado."
    );

    return {
      success: true,
      subscriptionId: data.id,
    };

  } catch (error) {

    console.error(
      "[ANDROID SERVER] EXCEPTION:",
      error
    );

    return {
      success: false,
    };

  }

}