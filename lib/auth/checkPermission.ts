import { createClient } from "@supabase/supabase-js";

export async function checkPermission(
  authUserId: string,
  permission: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /*
  |--------------------------------------------------------------------------
  | Buscar usuario
  |--------------------------------------------------------------------------
  */

  const { data: user, error: userError } = await supabase
    .from("restaurant_users")
    .select("role_id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  console.log("CHECK USER:", user);
  console.log("USER ERROR:", userError);

  if (!user) {
    return false;
  }

  /*
  |--------------------------------------------------------------------------
  | Buscar TODOS los permisos del rol
  |--------------------------------------------------------------------------
  */

  const { data: modules, error: modulesError } = await supabase
    .from("role_modules")
    .select("*")
    .eq("role_id", user.role_id);

  console.log("ALL MODULES:", modules);
  console.log("MODULES ERROR:", modulesError);

  /*
  |--------------------------------------------------------------------------
  | Buscar el permiso solicitado
  |--------------------------------------------------------------------------
  */

  const permissionFound = modules?.find(
    (m) =>
      m.module_code === permission &&
      m.can_view === true
  );

  console.log("SEARCHING:", permission);
  console.log("FOUND:", permissionFound);

  return !!permissionFound;
}