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


  return !!permissionFound;
}


