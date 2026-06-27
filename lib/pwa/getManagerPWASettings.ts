import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getManagerPWASettings() {
  const { data, error } = await supabase
    .from("manager_pwa_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}