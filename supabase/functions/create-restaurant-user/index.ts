declare const Deno: any;

/**
 * Wolf Ordering - create-restaurant-user
 *
 * This version intentionally uses fetch() only.
 * It does NOT import supabase-js, esm.sh, JSR, Node compatibility layers,
 * or Deno std/node modules.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function diag(step: string, details?: Record<string, unknown>) {
  console.log(
    `[CREATE USER][${step}]`,
    JSON.stringify({
      at: new Date().toISOString(),
      ...(details || {}),
    }),
  );
}

type CreatorProfile = {
  auth_user_id: string;
  restaurant_id: string;
  role_id: string;
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

type AuthUser = {
  id: string;
  email?: string | null;
};

function json(body: Record<string, any>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getEnv(name: string): string | null {
  return Deno.env.get(name) || null;
}

function getToken(req: Request): string | null {
  const header = req.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

function restUrl(baseUrl: string, table: string, query = "") {
  return `${baseUrl}/rest/v1/${table}${query ? `?${query}` : ""}`;
}

async function restRequest<T>(
  baseUrl: string,
  serviceRoleKey: string,
  table: string,
  options: {
    method?: string;
    query?: string;
    body?: unknown;
    prefer?: string;
  } = {},
): Promise<{ data: T | null; error: string | null; status: number }> {
  const headers: Record<string, string> = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.prefer) {
    headers["Prefer"] = options.prefer;
  }

  const requestUrl = restUrl(baseUrl, table, options.query);
  diag("REST:BEFORE", {
    method: options.method || "GET",
    table,
    query: options.query || "",
  });

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (err) {
    console.error("[CREATE USER][REST:FETCH_ERROR]", err);
    throw err;
  }

  diag("REST:AFTER_HEADERS", {
    table,
    status: response.status,
    ok: response.ok,
  });

  let text: string;
  try {
    text = await response.text();
  } catch (err) {
    console.error("[CREATE USER][REST:BODY_ERROR]", err);
    throw err;
  }
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    const message =
      typeof parsed === "string"
        ? parsed
        : parsed?.message || parsed?.error || parsed?.hint || `HTTP ${response.status}`;
    return { data: null, error: message, status: response.status };
  }

  return { data: parsed as T, error: null, status: response.status };
}

async function authUserRequest(
  baseUrl: string,
  token: string,
  serviceRoleKey: string,
): Promise<{ user: AuthUser | null; error: string | null; status: number }> {
  diag("AUTH USER:BEFORE");
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch (err) {
    console.error("[CREATE USER][AUTH USER:FETCH_ERROR]", err);
    throw err;
  }

  diag("AUTH USER:AFTER_HEADERS", {
    status: response.status,
    ok: response.ok,
  });

  let text: string;
  try {
    text = await response.text();
  } catch (err) {
    console.error("[CREATE USER][AUTH USER:BODY_ERROR]", err);
    throw err;
  }
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok || !parsed?.id) {
    return {
      user: null,
      error:
        typeof parsed === "string"
          ? parsed
          : parsed?.message || parsed?.error_description || `HTTP ${response.status}`,
      status: response.status,
    };
  }

  return { user: parsed as AuthUser, error: null, status: response.status };
}

async function createAuthUser(
  baseUrl: string,
  serviceRoleKey: string,
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; error: string | null; status: number }> {
  diag("AUTH CREATE:BEFORE", { email });
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    });
  } catch (err) {
    console.error("[CREATE USER][AUTH CREATE:FETCH_ERROR]", err);
    throw err;
  }

  diag("AUTH CREATE:AFTER_HEADERS", {
    status: response.status,
    ok: response.ok,
  });

  let text: string;
  try {
    text = await response.text();
  } catch (err) {
    console.error("[CREATE USER][AUTH CREATE:BODY_ERROR]", err);
    throw err;
  }
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok || !parsed?.id) {
    return {
      user: null,
      error:
        typeof parsed === "string"
          ? parsed
          : parsed?.message || parsed?.msg || parsed?.error || `HTTP ${response.status}`,
      status: response.status,
    };
  }

  return { user: parsed as AuthUser, error: null, status: response.status };
}

async function deleteAuthUser(
  baseUrl: string,
  serviceRoleKey: string,
  authUserId: string,
): Promise<{ error: string | null; status: number }> {
  diag("AUTH DELETE:BEFORE", { authUserId });
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/auth/v1/admin/users/${encodeURIComponent(authUserId)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: "application/json",
      },
    });
  } catch (err) {
    console.error("[CREATE USER][AUTH DELETE:FETCH_ERROR]", err);
    throw err;
  }

  diag("AUTH DELETE:AFTER_HEADERS", {
    status: response.status,
    ok: response.ok,
  });

  if (response.ok || response.status === 404) {
    return { error: null, status: response.status };
  }

  const text = await response.text();
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  return {
    error:
      typeof parsed === "string"
        ? parsed
        : parsed?.message || parsed?.msg || parsed?.error || `HTTP ${response.status}`,
    status: response.status,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Método no permitido." }, 405);
  }

  try {
    diag("STEP 1:START");
    const supabaseUrl = getEnv("SUPABASE_URL");
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl) {
      return json({ source: "env", error: "SUPABASE_URL missing" }, 500);
    }

    if (!serviceRoleKey) {
      return json({ source: "env", error: "SUPABASE_SERVICE_ROLE_KEY missing" }, 500);
    }

    diag("STEP 2:ENV_OK");
    const token = getToken(req);
    if (!token) {
      return json({ error: "No autorizado. Falta el token." }, 401);
    }

    diag("STEP 3:AUTH_VALIDATION:BEFORE");
    // Validate the caller using the caller's JWT, while all database/admin
    // operations use the service-role key through fetch().
    const { user: authUser, error: authUserError } = await authUserRequest(
      supabaseUrl,
      token,
      serviceRoleKey,
    );

    if (authUserError || !authUser) {
      return json({ error: "Sesión inválida o expirada." }, 401);
    }

    const creatorAuthUserId = authUser.id;
    diag("STEP 3:AUTH_VALIDATION:OK", { creatorAuthUserId });

    // A single Auth user may belong to multiple restaurants.
    diag("STEP 4:PROFILES:BEFORE");
    const creatorProfilesResult = await restRequest<CreatorProfile[]>(
      supabaseUrl,
      serviceRoleKey,
      "restaurant_users",
      {
        query:
          `select=auth_user_id,restaurant_id,role_id,active&auth_user_id=eq.${encodeURIComponent(creatorAuthUserId)}`,
      },
    );

    if (
      creatorProfilesResult.error ||
      !creatorProfilesResult.data ||
      creatorProfilesResult.data.length === 0
    ) {
      return json(
        { error: "El usuario autenticado no tiene perfiles de restaurante válidos." },
        403,
      );
    }

    diag("STEP 4:PROFILES:OK", {
      count: creatorProfilesResult.data.length,
    });

    const activeProfiles = creatorProfilesResult.data.filter(
      (profile: CreatorProfile) => profile.active !== false,
    );

    if (activeProfiles.length === 0) {
      return json(
        { error: "El usuario está desactivado en todos sus restaurantes." },
        403,
      );
    }

    const creatorRoleIds = Array.from(
      new Set(
        activeProfiles
          .map((profile: CreatorProfile) => profile.role_id)
          .filter(Boolean),
      ),
    );

    if (creatorRoleIds.length === 0) {
      return json({ error: "El usuario no tiene un rol válido." }, 403);
    }

    diag("STEP 5:ROLES:BEFORE", { creatorRoleIds });
    const creatorRolesResult = await restRequest<CreatorRole[]>(
      supabaseUrl,
      serviceRoleKey,
      "restaurant_roles",
      {
        query: `select=id,code,name&id=in.(${creatorRoleIds.map(encodeURIComponent).join(",")})`,
      },
    );

    if (
      creatorRolesResult.error ||
      !creatorRolesResult.data ||
      creatorRolesResult.data.length === 0
    ) {
      return json({ error: "No fue posible determinar los roles del usuario." }, 403);
    }

    const superAdminRole = creatorRolesResult.data.find(
      (role: CreatorRole) =>
        String(role.code || "").trim().toLowerCase() === "super-user",
    );

    const isSuperAdmin = Boolean(superAdminRole);
    diag("STEP 5:ROLES:OK", { isSuperAdmin });

    diag("STEP 6:BODY:BEFORE");
    const body = await req.json();
    diag("STEP 6:BODY:OK");

    const {
      email,
      password,
      full_name,
      phone,
      restaurant_id,
      role_id,
    } = body;

    if (!email || !password || !full_name || !restaurant_id || !role_id) {
      return json({ error: "Faltan datos obligatorios." }, 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const targetRestaurantId = String(restaurant_id);
    const targetRoleId = String(role_id);

    // Super Admin has no restaurant restriction.
    // Everyone else must have an active profile in the requested restaurant.
    if (!isSuperAdmin) {
      const creatorRestaurantProfile = activeProfiles.find(
        (profile: CreatorProfile) => profile.restaurant_id === targetRestaurantId,
      );

      if (!creatorRestaurantProfile) {
        return json(
          { error: "No puedes crear usuarios para otro restaurante." },
          403,
        );
      }
    } else {
      console.log(
        "[CREATE RESTAURANT USER] Super Admin autorizado:",
        creatorAuthUserId,
        "restaurant:",
        targetRestaurantId,
      );
    }

    diag("STEP 7:RESTAURANT:BEFORE", { targetRestaurantId });
    // Validate target restaurant.
    const restaurantResult = await restRequest<Array<{ id: string }>>(
      supabaseUrl,
      serviceRoleKey,
      "restaurants",
      {
        query: `select=id&id=eq.${encodeURIComponent(targetRestaurantId)}&limit=1`,
      },
    );

    if (
      restaurantResult.error ||
      !restaurantResult.data ||
      restaurantResult.data.length === 0
    ) {
      return json({ error: "El restaurante seleccionado no existe." }, 400);
    }

    diag("STEP 7:RESTAURANT:OK");

    diag("STEP 8:TARGET_ROLE:BEFORE", { targetRoleId });
    // Validate target role and ensure it belongs to the selected restaurant.
    const targetRoleResult = await restRequest<TargetRole[]>(
      supabaseUrl,
      serviceRoleKey,
      "restaurant_roles",
      {
        query:
          `select=id,restaurant_id,code,name&id=eq.${encodeURIComponent(targetRoleId)}&limit=1`,
      },
    );

    if (
      targetRoleResult.error ||
      !targetRoleResult.data ||
      targetRoleResult.data.length === 0
    ) {
      return json({ error: "El rol seleccionado no existe." }, 400);
    }

    const targetRole = targetRoleResult.data[0];
    diag("STEP 8:TARGET_ROLE:OK", {
      targetRoleId: targetRole.id,
      targetRoleCode: targetRole.code,
    });

    if (targetRole.restaurant_id !== targetRestaurantId) {
      return json(
        { error: "El rol seleccionado no pertenece al restaurante." },
        400,
      );
    }

    const protectedRoles = ["super-user", "owner", "manager"];
    const normalizedTargetRoleCode = String(targetRole.code || "")
      .trim()
      .toLowerCase();

    // Super Admin can assign every role. For restaurant users, permissions
    // are determined by the creator's role in the target restaurant.
    if (!isSuperAdmin) {
      const creatorProfile = activeProfiles.find(
        (profile: CreatorProfile) =>
          profile.restaurant_id === targetRestaurantId,
      );

      if (!creatorProfile) {
        return json(
          { error: "No tienes acceso a este restaurante." },
          403,
        );
      }

      const creatorRole = creatorRolesResult.data.find(
        (role: CreatorRole) => role.id === creatorProfile.role_id,
      );
      const creatorRoleCode = String(creatorRole?.code || "")
        .trim()
        .toLowerCase();

      const canAssign =
        (creatorRoleCode === "owner" &&
          (normalizedTargetRoleCode === "manager" ||
            !protectedRoles.includes(normalizedTargetRoleCode))) ||
        (creatorRoleCode === "manager" &&
          !protectedRoles.includes(normalizedTargetRoleCode));

      if (!canAssign) {
        return json(
          { error: "No tienes permiso para asignar este rol." },
          403,
        );
      }
    }

    diag("STEP 9:DUPLICATE_CHECK:BEFORE", { normalizedEmail });
    // Prevent duplicate restaurant membership for this email.
    const existingRestaurantUserResult = await restRequest<Array<{ id: string }>>(
      supabaseUrl,
      serviceRoleKey,
      "restaurant_users",
      {
        query:
          `select=id&restaurant_id=eq.${encodeURIComponent(targetRestaurantId)}&email=eq.${encodeURIComponent(normalizedEmail)}&limit=1`,
      },
    );

    if (existingRestaurantUserResult.error) {
      return json(
        {
          source: "restaurant_users.lookup",
          error: existingRestaurantUserResult.error,
        },
        400,
      );
    }

    if (
      existingRestaurantUserResult.data &&
      existingRestaurantUserResult.data.length > 0
    ) {
      return json(
        { error: "Ese correo ya existe en este restaurante." },
        409,
      );
    }

    diag("STEP 9:DUPLICATE_CHECK:OK");

    // Create Auth user through the Auth Admin HTTP API.
    const authCreateResult = await createAuthUser(
      supabaseUrl,
      serviceRoleKey,
      normalizedEmail,
      String(password),
    );

    if (authCreateResult.error || !authCreateResult.user) {
      return json(
        {
          source: "auth.createUser",
          error: authCreateResult.error || "No fue posible crear el usuario.",
        },
        400,
      );
    }

    const authUserId = authCreateResult.user.id;
    diag("STEP 10:AUTH_CREATE:OK", { authUserId });

    // Create the restaurant membership through PostgREST.
    const insertResult = await restRequest<any[]>(
      supabaseUrl,
      serviceRoleKey,
      "restaurant_users",
      {
        method: "POST",
        prefer: "return=representation",
        body: {
          auth_user_id: authUserId,
          restaurant_id: targetRestaurantId,
          role_id: targetRoleId,
          full_name,
          phone,
          email: normalizedEmail,
          active: true,
        },
      },
    );

    diag("STEP 11:MEMBERSHIP_INSERT:RESULT", {
      error: insertResult.error,
      status: insertResult.status,
    });

    // Roll back Auth if restaurant_users failed.
    if (insertResult.error) {
      const cleanup = await deleteAuthUser(
        supabaseUrl,
        serviceRoleKey,
        authUserId,
      );

      if (cleanup.error) {
        console.error("ERROR CLEANUP AUTH USER:", cleanup.error);
      }

      return json(
        {
          source: "restaurant_users.insert",
          error: insertResult.error,
        },
        400,
      );
    }

    diag("STEP 12:SUCCESS", { authUserId, targetRestaurantId, targetRoleId });

    return json(
      {
        success: true,
        auth_user_id: authUserId,
        restaurant_user: insertResult.data,
      },
      200,
    );
  } catch (err: any) {
    console.error("[CREATE USER][FATAL]", {
      name: err?.name,
      message: err?.message || String(err),
      stack: err?.stack,
    });

    return json(
      {
        source: "catch",
        error: err?.message || String(err),
      },
      500,
    );
  }
});
