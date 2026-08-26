import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CreatorProfile = {
  auth_user_id: string | null;
  restaurant_id: string;
  role_id: string | null;
  active: boolean | null;
};

type CreatorRole = {
  id: string;
  code: string | null;
  name: string | null;
};

type TargetRole = {
  id: string;
  restaurant_id: string;
  code: string | null;
  name: string | null;
};

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let createdAuthUserId: string | null = null;

  try {
    // 1. Authenticate the caller through the existing Next/Supabase session.
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("[CREATE USER][AUTH]", authError);
      return json(
        { error: "Sesión inválida o expirada." },
        401,
      );
    }

    const creatorAuthUserId = authUser.id;

    // 2. Load every restaurant profile for the caller.
    //    A Super Admin may have more than one restaurant_users row.
    const { data: creatorProfiles, error: profilesError } =
      await supabaseAdmin
        .from("restaurant_users")
        .select("auth_user_id, restaurant_id, role_id, active")
        .eq("auth_user_id", creatorAuthUserId);

    if (profilesError) {
      console.error("[CREATE USER][PROFILES]", profilesError);
      return json(
        {
          source: "restaurant_users.profiles",
          error: profilesError.message,
        },
        500,
      );
    }

    if (!creatorProfiles || creatorProfiles.length === 0) {
      return json(
        {
          error:
            "El usuario autenticado no tiene perfiles de restaurante válidos.",
        },
        403,
      );
    }

    const activeProfiles = (creatorProfiles as CreatorProfile[]).filter(
      (profile) => profile.active !== false,
    );

    if (activeProfiles.length === 0) {
      return json(
        {
          error: "El usuario está desactivado en todos sus restaurantes.",
        },
        403,
      );
    }

    const creatorRoleIds = Array.from(
      new Set(
        activeProfiles
          .map((profile) => profile.role_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    if (creatorRoleIds.length === 0) {
      return json(
        { error: "El usuario no tiene un rol válido." },
        403,
      );
    }

    // 3. Resolve the caller roles.
    const { data: creatorRoles, error: creatorRolesError } =
      await supabaseAdmin
        .from("restaurant_roles")
        .select("id, code, name")
        .in("id", creatorRoleIds);

    if (creatorRolesError) {
      console.error("[CREATE USER][ROLES]", creatorRolesError);
      return json(
        {
          source: "restaurant_roles.creator",
          error: creatorRolesError.message,
        },
        500,
      );
    }

    const roles = (creatorRoles || []) as CreatorRole[];

    const isSuperAdmin = roles.some(
      (role) =>
        String(role.code || "").trim().toLowerCase() === "super-user",
    );

    const roleById = new Map(
      roles.map((role) => [role.id, String(role.code || "").trim().toLowerCase()])
    );

    // 4. Read and validate the request body.
    const body = await request.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const fullName = String(body?.full_name || "").trim();
    const phone = String(body?.phone || "").trim();
    const restaurantId = String(body?.restaurant_id || "").trim();
    const roleId = String(body?.role_id || "").trim();

    if (
      !email ||
      !password ||
      !fullName ||
      !restaurantId ||
      !roleId
    ) {
      return json(
        { error: "Faltan datos obligatorios." },
        400,
      );
    }

    if (password.length < 6) {
      return json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        400,
      );
    }

    // 5. Resolve the creator's role inside the target restaurant.
    const creatorRestaurantProfile = activeProfiles.find(
      (profile) => profile.restaurant_id === restaurantId,
    );

    if (!isSuperAdmin && !creatorRestaurantProfile) {
      return json(
        { error: "No puedes crear usuarios para otro restaurante." },
        403,
      );
    }

    const creatorCode = isSuperAdmin
      ? "super-user"
      : roleById.get(creatorRestaurantProfile?.role_id || "") || "";

    if (!["super-user", "owner", "manager"].includes(creatorCode)) {
      return json(
        { error: "Tu rol no tiene permiso para crear usuarios." },
        403,
      );
    }

    // 6. Validate the target restaurant.
    const { data: restaurant, error: restaurantError } =
      await supabaseAdmin
        .from("restaurants")
        .select("id")
        .eq("id", restaurantId)
        .maybeSingle();

    if (restaurantError) {
      console.error("[CREATE USER][RESTAURANT]", restaurantError);
      return json(
        {
          source: "restaurants.lookup",
          error: restaurantError.message,
        },
        500,
      );
    }

    if (!restaurant) {
      return json(
        { error: "El restaurante seleccionado no existe." },
        400,
      );
    }

    // 7. Validate the target role and ownership by restaurant.
    const { data: targetRoleData, error: targetRoleError } =
      await supabaseAdmin
        .from("restaurant_roles")
        .select("id, restaurant_id, code, name")
        .eq("id", roleId)
        .maybeSingle();

    if (targetRoleError) {
      console.error("[CREATE USER][TARGET ROLE]", targetRoleError);
      return json(
        {
          source: "restaurant_roles.target",
          error: targetRoleError.message,
        },
        500,
      );
    }

    if (!targetRoleData) {
      return json(
        { error: "El rol seleccionado no existe." },
        400,
      );
    }

    const targetRole = targetRoleData as TargetRole;

    if (targetRole.restaurant_id !== restaurantId) {
      return json(
        { error: "El rol seleccionado no pertenece al restaurante." },
        400,
      );
    }

    // Role hierarchy:
    // Super Admin -> any restaurant role.
    // Owner      -> Manager + operational roles.
    // Manager    -> operational roles only.
    // Other roles -> cannot create users.
    const normalizedTargetRoleCode = String(targetRole.code || "")
      .trim()
      .toLowerCase();

    const targetIsProtected = ["super-user", "owner", "manager"].includes(
      normalizedTargetRoleCode,
    );

    const canCreateTargetRole =
      creatorCode === "super-user" ||
      (creatorCode === "owner" &&
        normalizedTargetRoleCode !== "super-user" &&
        normalizedTargetRoleCode !== "owner") ||
      (creatorCode === "manager" && !targetIsProtected);

    if (!canCreateTargetRole) {
      return json(
        {
          error:
            creatorCode === "owner"
              ? "Owner puede crear Managers y usuarios operativos, pero no otro Owner ni Super Admin."
              : creatorCode === "manager"
                ? "Manager puede crear únicamente usuarios operativos."
                : "No tienes permiso para crear este tipo de usuario.",
        },
        403,
      );
    }

    // 8. Prevent duplicate restaurant membership.
    const { data: existingRestaurantUser, error: duplicateError } =
      await supabaseAdmin
        .from("restaurant_users")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("email", email)
        .maybeSingle();

    if (duplicateError) {
      console.error("[CREATE USER][DUPLICATE]", duplicateError);
      return json(
        {
          source: "restaurant_users.lookup",
          error: duplicateError.message,
        },
        500,
      );
    }

    if (existingRestaurantUser) {
      return json(
        { error: "Ese correo ya existe en este restaurante." },
        409,
      );
    }

    // 9. Create the Auth account.
    const { data: authCreated, error: authCreateError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authCreateError || !authCreated.user) {
      console.error("[CREATE USER][AUTH CREATE]", authCreateError);
      return json(
        {
          source: "auth.createUser",
          error:
            authCreateError?.message ||
            "No fue posible crear el usuario.",
        },
        400,
      );
    }

    createdAuthUserId = authCreated.user.id;

    // 10. Create the restaurant membership.
    const { data: restaurantUser, error: membershipError } =
      await supabaseAdmin
        .from("restaurant_users")
        .insert({
          auth_user_id: createdAuthUserId,
          restaurant_id: restaurantId,
          role_id: roleId,
          full_name: fullName,
          phone: phone || null,
          email,
          active: true,
        })
        .select()
        .single();

    // 11. Full rollback if membership creation fails.
    if (membershipError) {
      console.error(
        "[CREATE USER][MEMBERSHIP INSERT]",
        membershipError,
      );

      if (createdAuthUserId) {
        const { error: cleanupError } =
          await supabaseAdmin.auth.admin.deleteUser(
            createdAuthUserId,
          );

        if (cleanupError && cleanupError.status !== 404) {
          console.error(
            "[CREATE USER][ROLLBACK AUTH]",
            cleanupError,
          );
        }
      }

      return json(
        {
          source: "restaurant_users.insert",
          error: membershipError.message,
        },
        400,
      );
    }

    return json(
      {
        success: true,
        auth_user_id: createdAuthUserId,
        restaurant_user: restaurantUser,
      },
      200,
    );
  } catch (error) {
    console.error("[CREATE USER][FATAL]", error);

    // Last-resort rollback for an Auth user created before an unexpected error.
    if (createdAuthUserId) {
      try {
        const { error: cleanupError } =
          await supabaseAdmin.auth.admin.deleteUser(
            createdAuthUserId,
          );

        if (cleanupError && cleanupError.status !== 404) {
          console.error(
            "[CREATE USER][FATAL ROLLBACK]",
            cleanupError,
          );
        }
      } catch (cleanupError) {
        console.error(
          "[CREATE USER][FATAL ROLLBACK EXCEPTION]",
          cleanupError,
        );
      }
    }

    return json(
      {
        source: "catch",
        error:
          error instanceof Error
            ? error.message
            : "Error inesperado creando el usuario.",
      },
      500,
    );
  }
}