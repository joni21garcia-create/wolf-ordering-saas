import { createClient }
from "@supabase/supabase-js";

export async function getCurrentUser(
  accessToken: string
) {
  const supabase =
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
      }
    );

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    data: restaurantUser,
  } =
    await supabase
      .from("restaurant_users")
      .select(`
        id,
        auth_user_id,
        restaurant_id,
        role_id,
        email,
        full_name
      `)
      .eq(
        "auth_user_id",
        user.id
      )
      .single();

  return restaurantUser;
}