import { createClient } from "@supabase/supabase-js";

export async function getCurrentUser(token: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  const { data: restaurantUser } = await supabase
    .from("restaurant_users")
    .select(`
      auth_user_id,
      restaurant_id,
      role_id,
      email
    `)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!restaurantUser) {
    return null;
  }

  return {
    ...restaurantUser,
    email: user.email,
  };
}


