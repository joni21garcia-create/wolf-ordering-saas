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

export async function registerAndroidServer({

  restaurantId,

  userId,

  token,

  platform = "android",

}: RegisterAndroidServerInput): Promise<boolean> {

  if (!restaurantId) {

    console.error(
      "[ANDROID SERVER] Restaurant ID vacío."
    );

    return false;

  }

  if (!userId) {

    console.error(
      "[ANDROID SERVER] User ID vacío."
    );

    return false;

  }

  if (!token) {

    console.error(
      "[ANDROID SERVER] Token vacío."
    );

    return false;

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
      .select();

    console.log("[ANDROID SERVER] DATA:");
    console.log(data);

    console.log("[ANDROID SERVER] ERROR:");
    console.log(error);

    if (error) {

      console.error(
        "[ANDROID SERVER] Error al registrar:",
        error
      );

      return false;

    }

    const { data: verify, error: verifyError } = await supabase
      .from("push_subscriptions")
      .select("id, platform, fcm_token, restaurant_id")
      .eq("fcm_token", token);

    console.log("[ANDROID SERVER] VERIFY:");
    console.log(verify);

    console.log("[ANDROID SERVER] VERIFY ERROR:");
    console.log(verifyError);

    console.log(
      "[ANDROID SERVER] Dispositivo registrado."
    );

    return true;

  } catch (error) {

    console.error(
      "[ANDROID SERVER] EXCEPTION:",
      error
    );

    return false;

  }

}