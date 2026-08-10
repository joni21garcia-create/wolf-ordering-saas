declare const Deno: any;

// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

function json(
  body: Record<string, any>,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json(
      {
        error: "Método no permitido.",
      },
      405
    );
  }

  try {
    /*
    |--------------------------------------------------------------------------
    | ENV
    |--------------------------------------------------------------------------
    */

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (!supabaseUrl) {
      return json(
        {
          source: "env",
          error:
            "SUPABASE_URL missing",
        },
        500
      );
    }

    if (!serviceRoleKey) {
      return json(
        {
          source: "env",
          error:
            "SUPABASE_SERVICE_ROLE_KEY missing",
        },
        500
      );
    }

    /*
    |--------------------------------------------------------------------------
    | AUTH DEL USUARIO QUE ESTÁ EJECUTANDO LA FUNCIÓN
    |--------------------------------------------------------------------------
    */

    const authHeader =
      req.headers.get(
        "Authorization"
      );

    if (!authHeader) {
      return json(
        {
          error:
            "No autorizado. Falta el token.",
        },
        401
      );
    }

    const token =
      authHeader.replace(
        /^Bearer\s+/i,
        ""
      );

    if (!token) {
      return json(
        {
          error:
            "No autorizado.",
        },
        401
      );
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        serviceRoleKey
      );

    /*
    |--------------------------------------------------------------------------
    | OBTENER USUARIO AUTENTICADO
    |--------------------------------------------------------------------------
    */

    const {
      data: authUserData,
      error: authUserError,
    } =
      await supabaseAdmin.auth.getUser(
        token
      );

    if (
      authUserError ||
      !authUserData.user
    ) {
      return json(
        {
          error:
            "Sesión inválida o expirada.",
        },
        401
      );
    }

    const creatorAuthUserId =
      authUserData.user.id;

    /*
    |--------------------------------------------------------------------------
    | BUSCAR PERFIL DEL CREADOR
    |--------------------------------------------------------------------------
    */

    const {
      data: creator,
      error: creatorError,
    } = await supabaseAdmin
      .from("restaurant_users")
      .select(`
        auth_user_id,
        restaurant_id,
        role_id,
        active
      `)
      .eq(
        "auth_user_id",
        creatorAuthUserId
      )
      .maybeSingle();

    if (
      creatorError ||
      !creator
    ) {
      return json(
        {
          error:
            "El usuario autenticado no tiene un perfil de restaurante válido.",
        },
        403
      );
    }

    if (creator.active === false) {
      return json(
        {
          error:
            "El usuario está desactivado.",
        },
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | OBTENER ROL DEL CREADOR
    |--------------------------------------------------------------------------
    */

    const {
      data: creatorRole,
      error: creatorRoleError,
    } = await supabaseAdmin
      .from("restaurant_roles")
      .select(`
        id,
        code,
        name
      `)
      .eq(
        "id",
        creator.role_id
      )
      .maybeSingle();

    if (
      creatorRoleError ||
      !creatorRole
    ) {
      return json(
        {
          error:
            "No fue posible determinar el rol del usuario.",
        },
        403
      );
    }

    const isSuperAdmin =
      creatorRole.code ===
      "super-user";

    /*
    |--------------------------------------------------------------------------
    | BODY
    |--------------------------------------------------------------------------
    */

    const body =
      await req.json();

    const {
      email,
      password,
      full_name,
      phone,
      restaurant_id,
      role_id,
    } = body;

    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES BÁSICAS
    |--------------------------------------------------------------------------
    */

    if (
      !email ||
      !password ||
      !full_name ||
      !restaurant_id ||
      !role_id
    ) {
      return json(
        {
          error:
            "Faltan datos obligatorios.",
        },
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | REGLA DE RESTAURANTE
    |--------------------------------------------------------------------------
    |
    | Super Admin:
    |   puede crear para cualquier restaurante.
    |
    | Usuario restaurante:
    |   solamente para su propio restaurante.
    |
    */

    if (
      !isSuperAdmin &&
      creator.restaurant_id !==
        restaurant_id
    ) {
      return json(
        {
          error:
            "No puedes crear usuarios para otro restaurante.",
        },
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDAR RESTAURANTE
    |--------------------------------------------------------------------------
    */

    const {
      data: restaurant,
      error: restaurantError,
    } = await supabaseAdmin
      .from("restaurants")
      .select("id")
      .eq(
        "id",
        restaurant_id
      )
      .maybeSingle();

    if (
      restaurantError ||
      !restaurant
    ) {
      return json(
        {
          error:
            "El restaurante seleccionado no existe.",
        },
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDAR ROL
    |--------------------------------------------------------------------------
    |
    | El role_id debe existir y pertenecer
    | al restaurante seleccionado.
    |
    */

    const {
      data: targetRole,
      error: targetRoleError,
    } = await supabaseAdmin
      .from("restaurant_roles")
      .select(`
        id,
        restaurant_id,
        code,
        name
      `)
      .eq(
        "id",
        role_id
      )
      .maybeSingle();

    if (
      targetRoleError ||
      !targetRole
    ) {
      return json(
        {
          error:
            "El rol seleccionado no existe.",
        },
        400
      );
    }

    if (
      targetRole.restaurant_id !==
      restaurant_id
    ) {
      return json(
        {
          error:
            "El rol seleccionado no pertenece al restaurante.",
        },
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PROTEGER ROLES ADMINISTRATIVOS
    |--------------------------------------------------------------------------
    |
    | Solamente Super Admin puede crear:
    |   - super-user
    |   - owner
    |   - manager
    |
    | Los usuarios normales del restaurante
    | no pueden crear esos roles.
    |
    */

    const protectedRoles = [
      "super-user",
      "owner",
      "manager",
    ];

    if (
      !isSuperAdmin &&
      protectedRoles.includes(
        targetRole.code
      )
    ) {
      return json(
        {
          error:
            "No tienes permiso para crear este tipo de usuario.",
        },
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR USUARIO EN SUPABASE AUTH
    |--------------------------------------------------------------------------
    */

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password,
          email_confirm: true,
        }
      );

    if (authError) {
      return json(
        {
          source:
            "auth.createUser",
          error:
            authError.message,
        },
        400
      );
    }

    const authUserId =
      authData.user.id;

    /*
    |--------------------------------------------------------------------------
    | CREAR restaurant_users
    |--------------------------------------------------------------------------
    */

    const {
      data: insertData,
      error: insertError,
    } = await supabaseAdmin
      .from("restaurant_users")
      .insert({
        auth_user_id:
          authUserId,

        restaurant_id,

        role_id,

        full_name,

        phone,

        email,

        active: true,
      })
      .select();

    /*
    |--------------------------------------------------------------------------
    | ROLLBACK
    |--------------------------------------------------------------------------
    |
    | Si Auth se creó pero restaurant_users
    | falla, eliminamos el usuario Auth.
    |
    */

    if (insertError) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(
          authUserId
        );
      } catch (cleanupError) {
        console.error(
          "ERROR CLEANUP AUTH USER:",
          cleanupError
        );
      }

      return json(
        {
          source:
            "restaurant_users.insert",

          error:
            insertError.message,

          details:
            insertError.details,

          hint:
            insertError.hint,
        },
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ÉXITO
    |--------------------------------------------------------------------------
    */

    return json(
      {
        success: true,

        auth_user_id:
          authUserId,

        restaurant_user:
          insertData,
      },
      200
    );

  } catch (err: any) {
    console.error(
      "CREATE RESTAURANT USER ERROR:",
      err
    );

    return json(
      {
        source: "catch",

        error:
          err?.message ||
          String(err),
      },
      500
    );
  }
});