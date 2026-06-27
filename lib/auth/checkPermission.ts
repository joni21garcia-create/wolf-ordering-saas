import { createClient }
from "@supabase/supabase-js";

export async function checkPermission(
  authUserId: string,
  permission: string
) {
  const supabase =
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

  const { data: user } =
    await supabase
      .from("restaurant_users")
      .select("role_id")
      .eq(
        "auth_user_id",
        authUserId
      )
      .single();

  if (!user)
    return false;

  const { data } =
    await supabase
      .from("role_modules")
      .select("*")
      .eq(
        "role_id",
        user.role_id
      )
      .eq(
        "module_code",
        permission
      )
      .eq(
        "can_view",
        true
      )
      .single();

  return !!data;
}