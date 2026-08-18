import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const PAYPAL_API =
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PLAN_IDS = {
  basic: process.env.PAYPAL_PLAN_BASIC_ID,
  pro: process.env.PAYPAL_PLAN_PRO_ID,
} as const;

type Plan = "basic" | "pro";

type CreateRequestBody = {
  restaurant_name?: unknown;
  owner_name?: unknown;
  owner_email?: unknown;
  owner_phone?: unknown;
  password?: unknown;
  plan?: unknown;
  paypal_subscription_id?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlan(value: unknown): value is Plan {
  return value === "basic" || value === "pro";
}

function jsonError(
  error: string,
  message: string,
  status: number,
) {
  return NextResponse.json(
    { error, message },
    { status },
  );
}

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Faltan las variables de Supabase.",
    );
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "Faltan las credenciales de PayPal.",
    );
  }

  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "[ONBOARDING PAYPAL TOKEN ERROR]",
      response.status,
      errorText,
    );
    throw new Error(
      "No se pudo autenticar con PayPal.",
    );
  }

  const data = await response.json();

  if (!data?.access_token) {
    throw new Error(
      "PayPal no devolvió un access token.",
    );
  }

  return data.access_token as string;
}

async function getPayPalSubscription(
  subscriptionId: string,
) {
  const accessToken =
    await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v1/billing/subscriptions/${encodeURIComponent(
      subscriptionId,
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "No pudimos consultar la suscripción en PayPal.",
    );
  }

  return data;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

async function getUniqueSlug(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  restaurantName: string,
) {
  const baseSlug = slugify(restaurantName) || "restaurante";

  for (let index = 0; index < 100; index += 1) {
    const candidate =
      index === 0
        ? baseSlug
        : `${baseSlug}-${index + 1}`;

    const { data, error } = await supabase
      .from("restaurants")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(
        `No pudimos comprobar el slug del restaurante: ${error.message}`,
      );
    }

    if (!data) {
      return candidate;
    }
  }

  throw new Error(
    "No pudimos generar un slug único para el restaurante.",
  );
}

export async function POST(request: NextRequest) {
  let supabase: ReturnType<typeof getSupabaseAdmin> | null =
    null;

  let createdAuthUserId: string | null = null;
  let createdRestaurantId: string | null = null;
  let createdRoleId: string | null = null;

  try {
    const body =
      (await request.json()) as CreateRequestBody;

    const restaurantName = cleanString(
      body.restaurant_name,
    );
    const ownerName = cleanString(
      body.owner_name,
    );
    const ownerEmail = cleanString(
      body.owner_email,
    ).toLowerCase();
    const ownerPhone = cleanString(
      body.owner_phone,
    );
    const password = cleanString(body.password);
    const plan = body.plan;
    const paypalSubscriptionId = cleanString(
      body.paypal_subscription_id,
    );

    if (restaurantName.length < 2) {
      return jsonError(
        "Nombre de restaurante inválido",
        "El nombre del restaurante debe tener al menos 2 caracteres.",
        400,
      );
    }

    if (ownerName.length < 2) {
      return jsonError(
        "Nombre del propietario inválido",
        "El nombre del propietario debe tener al menos 2 caracteres.",
        400,
      );
    }

    if (
      !ownerEmail ||
      !/^\S+@\S+\.\S+$/.test(ownerEmail)
    ) {
      return jsonError(
        "Correo inválido",
        "Introduce un correo electrónico válido.",
        400,
      );
    }

    if (
      ownerPhone.replace(/\D/g, "").length < 7
    ) {
      return jsonError(
        "Teléfono inválido",
        "Introduce un número de teléfono válido.",
        400,
      );
    }

    if (password.length < 8) {
      return jsonError(
        "Contraseña inválida",
        "La contraseña debe tener al menos 8 caracteres.",
        400,
      );
    }

    if (!isPlan(plan)) {
      return jsonError(
        "Plan inválido",
        "El plan debe ser basic o pro.",
        400,
      );
    }

    if (!paypalSubscriptionId) {
      return jsonError(
        "Suscripción requerida",
        "No recibimos el identificador de la suscripción de PayPal.",
        400,
      );
    }

    supabase = getSupabaseAdmin();

    // Nunca confiamos solamente en que el navegador diga "paypal=success".
    // El backend vuelve a consultar PayPal antes de crear la cuenta.
    const paypalSubscription =
      await getPayPalSubscription(
        paypalSubscriptionId,
      );

    const expectedPlanId = PLAN_IDS[plan];

    if (!expectedPlanId) {
      return jsonError(
        "Plan de PayPal no configurado",
        "El plan seleccionado no está configurado en PayPal.",
        500,
      );
    }

    if (
      paypalSubscription?.id !==
      paypalSubscriptionId
    ) {
      return jsonError(
        "Suscripción inconsistente",
        "La suscripción de PayPal no coincide con la solicitada.",
        409,
      );
    }

    if (
      paypalSubscription?.plan_id !==
      expectedPlanId
    ) {
      return jsonError(
        "Plan inconsistente",
        "La suscripción de PayPal no corresponde al plan seleccionado.",
        409,
      );
    }

    if (
      !["ACTIVE", "APPROVED"].includes(
        paypalSubscription?.status,
      )
    ) {
      return jsonError(
        "Pago pendiente",
        `PayPal todavía no confirma la suscripción. Estado: ${
          paypalSubscription?.status || "desconocido"
        }.`,
        409,
      );
    }

    // Evita duplicar la cuenta si el usuario vuelve a enviar el formulario.
    const { data: existingRequest, error: existingError } =
      await supabase
        .from("restaurant_creation_requests")
        .select(
          "id, user_id, restaurant_id, plan, request_status, payment_status, subscription_status, paypal_subscription_id",
        )
        .eq(
          "paypal_subscription_id",
          paypalSubscriptionId,
        )
        .maybeSingle();

    if (existingError) {
      throw new Error(
        `No pudimos comprobar la solicitud existente: ${existingError.message}`,
      );
    }

    if (existingRequest) {
      return NextResponse.json({
        success: true,
        existing: true,
        requestId: existingRequest.id,
        restaurantId:
          existingRequest.restaurant_id,
        plan: existingRequest.plan,
        paypalSubscriptionId:
          existingRequest.paypal_subscription_id,
      });
    }

    // 1. Crear restaurante.
    const slug = await getUniqueSlug(
      supabase,
      restaurantName,
    );

    const planName =
      plan === "pro" ? "PRO" : "BASIC";

    const { data: restaurant, error: restaurantError } =
      await supabase
        .from("restaurants")
        .insert({
          name: restaurantName,
          slug,
          owner_name: ownerName,
          owner_email: ownerEmail,
          whatsapp: ownerPhone,
          active: true,
          accepting_orders: false,
          terms_accepted: true,
          terms_accepted_at:
            new Date().toISOString(),
          plan_name: planName,
          expires_at: null,
          discover_visible: false,
          featured_visible: false,
          service_menu: true,
          service_ordering: true,
          pickup_enabled: true,
          delivery_enabled: true,
        })
        .select("id, name, slug, plan_name")
        .single();

    if (restaurantError || !restaurant) {
      throw new Error(
        restaurantError?.message ||
          "No pudimos crear el restaurante.",
      );
    }

    createdRestaurantId = restaurant.id;

    // 2. Crear el rol owner específico de este restaurante.
    const {
      data: ownerRole,
      error: ownerRoleError,
    } = await supabase
      .from("restaurant_roles")
      .insert({
        restaurant_id: restaurant.id,
        code: "owner",
        name: "Owner",
      })
      .select("id, code, name")
      .single();

    if (
      ownerRoleError ||
      !ownerRole
    ) {
      throw new Error(
        ownerRoleError?.message ||
          "No pudimos crear el rol Owner.",
      );
    }

    createdRoleId = ownerRole.id;

    // 3. Crear la cuenta Auth.
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.admin.createUser({
      email: ownerEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: ownerName,
        phone: ownerPhone,
        restaurant_id: restaurant.id,
        role: "owner",
      },
    });

    if (
      authError ||
      !authData?.user
    ) {
      if (
        authError?.message
          ?.toLowerCase()
          .includes("already")
      ) {
        throw new Error(
          "Ese correo ya tiene una cuenta en Wolf Ordering. Usa otro correo para crear esta cuenta.",
        );
      }

      throw new Error(
        authError?.message ||
          "No pudimos crear la cuenta del propietario.",
      );
    }

    createdAuthUserId =
      authData.user.id;

    // 4. Vincular Auth con restaurant_users.
    const {
      data: restaurantUser,
      error: restaurantUserError,
    } = await supabase
      .from("restaurant_users")
      .insert({
        auth_user_id:
          createdAuthUserId,
        restaurant_id:
          restaurant.id,
        role_id:
          ownerRole.id,
        full_name:
          ownerName,
        phone:
          ownerPhone,
        email:
          ownerEmail,
        active: true,
      })
      .select(
        "id, auth_user_id, restaurant_id, role_id, email, full_name",
      )
      .single();

    if (
      restaurantUserError ||
      !restaurantUser
    ) {
      throw new Error(
        restaurantUserError?.message ||
          "No pudimos vincular la cuenta con el restaurante.",
      );
    }

    // 5. Registrar la solicitud/pago para el panel de administración.
    const {
      data: creationRequest,
      error: requestError,
    } = await supabase
      .from("restaurant_creation_requests")
      .insert({
        user_id:
          createdAuthUserId,
        restaurant_name:
          restaurantName,
        owner_name:
          ownerName,
        owner_email:
          ownerEmail,
        owner_phone:
          ownerPhone,
        plan,
        paypal_subscription_id:
          paypalSubscriptionId,
        payment_status:
          "completed",
        subscription_status:
          "active",
        request_status:
          "pending",
        restaurant_id:
          restaurant.id,
      })
      .select(
        "id, user_id, restaurant_id, plan, request_status, payment_status, subscription_status, paypal_subscription_id",
      )
      .single();

    if (
      requestError ||
      !creationRequest
    ) {
      throw new Error(
        requestError?.message ||
          "No pudimos registrar la solicitud del restaurante.",
      );
    }

    console.log(
      "[PUBLIC RESTAURANT ONBOARDING] Cuenta creada",
      {
        requestId:
          creationRequest.id,
        restaurantId:
          restaurant.id,
        authUserId:
          createdAuthUserId,
        plan,
        paypalSubscriptionId,
      },
    );

    return NextResponse.json({
      success: true,
      existing: false,
      requestId:
        creationRequest.id,
      restaurantId:
        restaurant.id,
      authUserId:
        createdAuthUserId,
      plan,
      paypalSubscriptionId,
      status: {
        payment: "completed",
        subscription: "active",
        request: "pending",
      },
    });
  } catch (error) {
    console.error(
      "[PUBLIC RESTAURANT ONBOARDING] Error:",
      error,
    );

    // Rollback: no dejamos cuentas/restaurantes huérfanos
    // si uno de los pasos posteriores falla.
    if (supabase) {
      if (createdAuthUserId) {
        try {
          await supabase.auth.admin.deleteUser(
            createdAuthUserId,
          );
        } catch (cleanupError) {
          console.error(
            "[PUBLIC RESTAURANT ONBOARDING] Error eliminando Auth durante rollback:",
            cleanupError,
          );
        }
      }

      if (createdRoleId) {
        const { error: roleCleanupError } =
          await supabase
            .from("restaurant_roles")
            .delete()
            .eq("id", createdRoleId);

        if (roleCleanupError) {
          console.error(
            "[PUBLIC RESTAURANT ONBOARDING] Error eliminando rol durante rollback:",
            roleCleanupError,
          );
        }
      }

      if (createdRestaurantId) {
        const {
          error: restaurantCleanupError,
        } = await supabase
          .from("restaurants")
          .delete()
          .eq("id", createdRestaurantId);

        if (restaurantCleanupError) {
          console.error(
            "[PUBLIC RESTAURANT ONBOARDING] Error eliminando restaurante durante rollback:",
            restaurantCleanupError,
          );
        }
      }
    }

    return NextResponse.json(
      {
        error:
          "No pudimos completar la creación de tu cuenta",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
      },
      { status: 500 },
    );
  }
}