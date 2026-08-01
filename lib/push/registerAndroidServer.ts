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

  if (!token) {
    console.error("[ANDROID SERVER] Token vacío.");
    return false;
  }

  const { error } = await supabase
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
    );

  if (error) {
    console.error("[ANDROID SERVER]", error);
    return false;
  }

  console.log("[ANDROID SERVER] Dispositivo registrado.");

  return true;
}