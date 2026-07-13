import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

import { getCurrentUser }
from "@/lib/auth/getCurrentUser";

import { checkPermission }
from "@/lib/auth/checkPermission";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {

const headersList =
  await headers();

const authorization =
  headersList.get(
    "authorization"
  );

if (!authorization) {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

const token =
  authorization.replace(
    "Bearer ",
    ""
  );

const authUser =
  await getCurrentUser(
    token
  );

if (!authUser) {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}
console.log("AUTH USER:", authUser);
const canCreateRestaurant =
  await checkPermission(
    authUser.auth_user_id,
    "restaurant_new"
  );
console.log(
  "CAN CREATE:",
  canCreateRestaurant
);
if (
  !canCreateRestaurant
) {
  return NextResponse.json(
    {
      success: false,
      error: "Forbidden",
    },
    {
      status: 403,
    }
  );
}

    const body = await req.json();

    const {
      restaurant,
      user,
    } = body;

    /*
      CREAR RESTAURANTE
    */

    const { data: restaurantData, error: restaurantError } =
      await supabase
        .from("restaurants")
        .insert({
          ...restaurant,
          active: true,
          accepting_orders: true,
        })
        .select()
        .single();

    if (restaurantError) {
      throw restaurantError;
    }

    const restaurantId = restaurantData.id;

console.log("========== LEGAL FLOW ==========");
console.log("Restaurant ID:", restaurantId);
/*
|--------------------------------------------------------------------------
| OBTENER DOCUMENTO LEGAL ACTIVO
|--------------------------------------------------------------------------
*/

const {
  data: legalDocument,
  error: legalDocumentError,
} = await supabase
  .from("legal_documents")
  .select("*")
  .eq(
    "code",
    "restaurant_agreement"
  )
  .eq(
    "is_active",
    true
  )
  .single();

if (legalDocumentError) {
  throw legalDocumentError;
}


/*
|--------------------------------------------------------------------------
| CREAR EXPEDIENTE LEGAL
|--------------------------------------------------------------------------
*/

const {
  data: legalAcceptance,
  error: legalAcceptanceError,
} = await supabase
  .from("restaurant_legal_acceptance")
  .insert({
    restaurant_id: restaurantId,

    legal_document_id:
      legalDocument.id,

    owner_name:
      restaurant.owner_name,

    owner_email:
      restaurant.owner_email,

    owner_phone:
      restaurant.whatsapp,

    accepted_version:
      legalDocument.version,

    accepted_content_snapshot:
      legalDocument.content,

    status: "pending",
  })
  .select()
  .single();

if (legalAcceptanceError) {
  throw legalAcceptanceError;
}
console.log("LEGAL ACCEPTANCE:", legalAcceptance);
/*
|--------------------------------------------------------------------------
| PRIMER EVENTO LEGAL
|--------------------------------------------------------------------------
*/

const {
  error: legalEventError,
} = await supabase
  .from("legal_events")
  .insert({
    acceptance_id:
      legalAcceptance.id,

    event:
      "agreement_created",

    description:
      "Acuerdo legal generado automáticamente al crear el restaurante.",

    performed_by:
      authUser.email,

    metadata: {
      restaurant_id:
        restaurantId,

      restaurant_name:
        restaurant.name,

      owner:
        restaurant.owner_name,
    },
  });

if (legalEventError) {
  throw legalEventError;
}
console.log("LEGAL EVENT CREATED");

    /*
|--------------------------------------------------------------------------
| CREAR ROL OWNER
|--------------------------------------------------------------------------
*/

const { data: ownerRole, error: ownerRoleError } = await supabase
  .from("restaurant_roles")
  .insert({
    restaurant_id: restaurantId,
    code: "propietario",
    name: "Owner",
  })
  .select()
  .single();

if (ownerRoleError) {
  throw ownerRoleError;
}

/*
|--------------------------------------------------------------------------
| CREAR ROL SUPER ADMIN
|--------------------------------------------------------------------------
*/

const {
  data: managerRole,
  error: managerRoleError,
} = await supabase
  .from("restaurant_roles")
  .insert({
    restaurant_id: restaurantId,
    code: "super-user",
    name: "Super Admin",
  })
  .select()
  .single();

if (managerRoleError) {
  throw managerRoleError;
}

/*
|--------------------------------------------------------------------------
| LEER MÓDULOS DEL SISTEMA
|--------------------------------------------------------------------------
*/

const { data: systemModules, error: modulesError } = await supabase
  .from("system_modules")
  .select("code");

if (modulesError) {
  throw modulesError;
}

/*
|--------------------------------------------------------------------------
| PERMISOS OWNER
|--------------------------------------------------------------------------
*/

const ownerPermissions = systemModules.map((module) => ({
  role_id: ownerRole.id,
  module_code: module.code,
  can_view: true,
}));

const { error: ownerPermissionsError } = await supabase
  .from("role_modules")
  .insert(ownerPermissions);

if (ownerPermissionsError) {
  throw ownerPermissionsError;
}

/*
|--------------------------------------------------------------------------
| PERMISOS SUPER ADMIN
|--------------------------------------------------------------------------
*/

const managerPermissions = systemModules.map((module) => ({
  role_id: managerRole.id,
  module_code: module.code,
  can_view: true,
}));

const { error: managerPermissionsError } = await supabase
  .from("role_modules")
  .insert(managerPermissions);

if (managerPermissionsError) {
  throw managerPermissionsError;
}

    /*
      CREAR CONFIGURACIÓN INICIAL
    */

const { error: settingsError } = await supabase
  .from("restaurant_settings")
  .insert({
    restaurant_id: restaurantId,
    hero_enabled: true,
    gallery_enabled: true,
    featured_menu_enabled: true,
    about_enabled: true,
    map_enabled: true,
    pickup_enabled: true,
    delivery_enabled: true,
    reviews_enabled: true,
    hours_enabled: true,
    services_enabled: true,
    whatsapp_enabled: true,
    floating_whatsapp_enabled: true,
    delivery_fee_enabled: true,
    theme_type: "modern",
  });

if (settingsError) {
  throw settingsError;
}

const { error: deliveryError } = await supabase
  .from("restaurant_delivery_settings")
  .insert({
    restaurant_id: restaurantId,
  });

if (deliveryError) {
  throw deliveryError;
}

const { error: themeError } = await supabase
  .from("restaurant_theme_settings")
  .insert({
    restaurant_id: restaurantId,
  });

if (themeError) {
  throw themeError;
}

const { error: pwaError } = await supabase
  .from("restaurant_pwa_settings")
  .insert({
    restaurant_id: restaurantId,
    app_name: restaurant.name,
    short_name: restaurant.name,
    description: restaurant.description,
    theme_color: restaurant.primary_color,
    background_color: restaurant.secondary_color,
    display: "standalone",
    orientation: "portrait",
    app_logo: restaurant.logo_url,

    favicon_url: null,
    icon_72_url: null,
    icon_96_url: null,
    icon_128_url: null,
    icon_144_url: null,
    icon_152_url: null,
    icon_192_url: null,
    icon_384_url: null,
    icon_512_url: null,
    apple_icon_url: null,
    maskable_icon_url: null,

  });

if (pwaError) {
  throw pwaError;
}



const { error: scheduleError } = await supabase
  .from("schedule_settings")
  .insert({
    restaurant_id: restaurantId,
  });

if (scheduleError) {
  throw scheduleError;
}

    return NextResponse.json({
      success: true,
      restaurant:
        restaurantData,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}