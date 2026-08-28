import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { checkPermission } from "@/lib/auth/checkPermission";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

type CreatedIds = {
  restaurantId: string | null;
  legalAcceptanceId: string | null;
  legalEventId: string | null;
  roleIds: string[];
};

type RestaurantProfile = {
  auth_user_id: string | null;
  restaurant_id: string;
  role_id: string | null;
  active: boolean | null;
};

async function rollbackCreatedData(ids: CreatedIds) {
  const errors: string[] = [];

const run = async (
  label: string,
  operation: () => PromiseLike<any>
) => {
    try {
      const { error } = await operation();
      if (error) {
        errors.push(`${label}: ${error.message}`);
      }
    } catch (error: any) {
      errors.push(`${label}: ${error?.message || "Unknown rollback error"}`);
    }
  };

  /*
   * Delete children before their parents.
   * This is a compensating rollback for the multi-step API flow.
   * For a true database transaction, these operations should eventually
   * move into a Supabase/Postgres RPC transaction.
   */

  if (ids.legalEventId) {
    await run("legal_events", () =>
      supabase
        .from("legal_events")
        .delete()
        .eq("id", ids.legalEventId!)
    );
  }

  if (ids.legalAcceptanceId) {
    await run("restaurant_legal_acceptance", () =>
      supabase
        .from("restaurant_legal_acceptance")
        .delete()
        .eq("id", ids.legalAcceptanceId!)
    );
  }

  // Eliminar permisos de los roles y luego los roles.
  for (const roleId of [...ids.roleIds].reverse()) {
    await run(`role_modules:${roleId}`, () =>
      supabase
        .from("role_modules")
        .delete()
        .eq("role_id", roleId)
    );

    await run(`restaurant_roles:${roleId}`, () =>
      supabase
        .from("restaurant_roles")
        .delete()
        .eq("id", roleId)
    );
  }

  if (ids.restaurantId) {
    const restaurantId = ids.restaurantId;

    await run("schedule_settings", () =>
      supabase
        .from("schedule_settings")
        .delete()
        .eq("restaurant_id", restaurantId)
    );

    await run("restaurant_pwa_settings", () =>
      supabase
        .from("restaurant_pwa_settings")
        .delete()
        .eq("restaurant_id", restaurantId)
    );

    await run("restaurant_theme_settings", () =>
      supabase
        .from("restaurant_theme_settings")
        .delete()
        .eq("restaurant_id", restaurantId)
    );

    await run("restaurant_delivery_settings", () =>
      supabase
        .from("restaurant_delivery_settings")
        .delete()
        .eq("restaurant_id", restaurantId)
    );

    await run("restaurant_settings", () =>
      supabase
        .from("restaurant_settings")
        .delete()
        .eq("restaurant_id", restaurantId)
    );

    await run("restaurants", () =>
      supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurantId)
    );
  }

  if (errors.length) {
    console.error("ROLLBACK ERRORS:", errors);
  }

  return errors;
}

export async function POST(req: Request) {
  const ids: CreatedIds = {
    restaurantId: null,
    legalAcceptanceId: null,
    legalEventId: null,
    roleIds: [],
  };

  try {
    const headersList = await headers();

    const authorization = headersList.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const authUser = await getCurrentUser(token);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const canCreateRestaurant = await checkPermission(
      authUser.auth_user_id,
      "restaurant_new"
    );

    if (!canCreateRestaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { restaurant, user } = body ?? {};

    if (!restaurant || typeof restaurant !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Datos del restaurante inválidos.",
        },
        { status: 400 }
      );
    }

    /*
     * IMPORTANTE:
     * `user` se conserva en el contrato de la API porque el frontend actual
     * lo envía, pero esta versión no crea/modifica usuarios.
     */

    console.log("========== CREATE RESTAURANT ==========");
    console.log("Requested by:", authUser.email);
    console.log("Restaurant:", restaurant.name);

    /*
     * 1. CREAR RESTAURANTE
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

    ids.restaurantId = restaurantData.id;

    // Diseño visual inicial: Cinematic. Se mantiene independiente del contenido.
    const { data: cinematicTheme } = await supabase
      .from("design_theme_catalog")
      .select("id")
      .eq("slug", "cinematic")
      .maybeSingle();

    if (cinematicTheme?.id) {
      const { error: designThemeError } = await supabase
        .from("restaurant_design_themes")
        .upsert(
          {
            restaurant_id: restaurantData.id,
            theme_id: cinematicTheme.id,
          },
          { onConflict: "restaurant_id" }
        );

      if (designThemeError) {
        throw designThemeError;
      }
    }

    console.log("RESTAURANT CREATED:", ids.restaurantId);

    /*
     * 2. OBTENER DOCUMENTO LEGAL ACTIVO
     */

    const {
      data: legalDocument,
      error: legalDocumentError,
    } = await supabase
      .from("legal_documents")
      .select("*")
      .eq("code", "restaurant_agreement")
      .eq("is_active", true)
      .single();

    if (legalDocumentError) {
      throw legalDocumentError;
    }

    if (!legalDocument) {
      throw new Error("No existe un documento legal activo.");
    }

    /*
     * 3. CREAR EXPEDIENTE LEGAL
     */

    const {
      data: legalAcceptance,
      error: legalAcceptanceError,
    } = await supabase
      .from("restaurant_legal_acceptance")
      .insert({
        restaurant_id: ids.restaurantId,
        legal_document_id: legalDocument.id,
        owner_name: restaurant.owner_name,
        owner_email: restaurant.owner_email,
        owner_phone: restaurant.whatsapp,
        accepted_version: legalDocument.version,
        accepted_content_snapshot: legalDocument.content,
        status: "pending",
      })
      .select()
      .single();

    if (legalAcceptanceError) {
      throw legalAcceptanceError;
    }

    ids.legalAcceptanceId = legalAcceptance.id;

    console.log("LEGAL ACCEPTANCE CREATED:", ids.legalAcceptanceId);

    /*
     * 4. PRIMER EVENTO LEGAL
     */

    const { data: legalEvent, error: legalEventError } =
      await supabase
        .from("legal_events")
        .insert({
          acceptance_id: ids.legalAcceptanceId,
          event: "agreement_created",
          description:
            "Acuerdo legal generado automáticamente al crear el restaurante.",
          performed_by: authUser.email,
          metadata: {
            restaurant_id: ids.restaurantId,
            restaurant_name: restaurant.name,
            owner: restaurant.owner_name,
          },
        })
        .select()
        .single();

    if (legalEventError) {
      throw legalEventError;
    }

    ids.legalEventId = legalEvent.id;

    console.log("LEGAL EVENT CREATED:", ids.legalEventId);

    /*
     * 5. CREAR CATÁLOGO DE ROLES DEL RESTAURANTE
     *
     * El catálogo nuevo usa códigos normalizados:
     * owner, manager, cashier, kitchen, marketing y test.
     *
     * IMPORTANTE: NO se crea `super-user` aquí. Ese rol representa
     * Super Admin de plataforma; los roles de restaurante son owner,
     * manager, cashier, kitchen, marketing y test.
     */

    const roleDefinitions = [
      { code: "owner", name: "Owner" },
      { code: "manager", name: "Manager" },
      { code: "cashier", name: "Cashier" },
      { code: "kitchen", name: "Kitchen" },
      { code: "marketing", name: "Marketing" },
      { code: "test", name: "Test" },
    ];

    for (const role of roleDefinitions) {
      const { data: roleData, error: roleError } = await supabase
        .from("restaurant_roles")
        .insert({
          restaurant_id: ids.restaurantId,
          code: role.code,
          name: role.name,
        })
        .select()
        .single();

      if (roleError) {
        throw roleError;
      }

      ids.roleIds.push(roleData.id);
    }

    console.log("ROLES CREATED:", roleDefinitions.map((r) => r.code));

    /*
     * 7. LEER MÓDULOS DEL SISTEMA
     */

    const {
      data: systemModules,
      error: modulesError,
    } = await supabase
      .from("system_modules")
      .select("code");

    if (modulesError) {
      throw modulesError;
    }

    if (!systemModules?.length) {
      throw new Error("No existen módulos del sistema configurados.");
    }

    /*
     * 8. PERMISOS INICIALES
     *
     * Regla de Wolf Ordering:
     * - Pedidos (`orders`) es el único módulo fijo para los roles de restaurante.
     * - Los demás módulos se asignan manualmente desde Acceso > Permisos.
     *
     * No se conceden automáticamente todos los módulos a todos los roles.
     */

    const ordersModule = systemModules.find(
      (module) => module.code === "orders"
    );

    if (!ordersModule) {
      throw new Error('No existe el módulo "orders" configurado en system_modules.');
    }

    const rolePermissions = ids.roleIds.map((roleId) => ({
      role_id: roleId,
      module_code: ordersModule.code,
      can_view: true,
    }));

    const { error: rolePermissionsError } = await supabase
      .from("role_modules")
      .insert(rolePermissions);

    if (rolePermissionsError) {
      throw rolePermissionsError;
    }

    /*
     * 10. CONFIGURACIÓN INICIAL
     */

    const { error: settingsError } = await supabase
      .from("restaurant_settings")
      .insert({
        restaurant_id: ids.restaurantId,
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

    /*
     * 11. DELIVERY
     */

    const { error: deliveryError } = await supabase
      .from("restaurant_delivery_settings")
      .insert({
        restaurant_id: ids.restaurantId,
      });

    if (deliveryError) {
      throw deliveryError;
    }

    /*
     * 12. THEME
     */

    const { error: themeError } = await supabase
      .from("restaurant_theme_settings")
      .insert({
        restaurant_id: ids.restaurantId,
      });

    if (themeError) {
      throw themeError;
    }

    /*
     * 13. PWA
     */

    const { error: pwaError } = await supabase
      .from("restaurant_pwa_settings")
      .insert({
        restaurant_id: ids.restaurantId,
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

    /*
     * 14. HORARIOS
     */

    const { error: scheduleError } = await supabase
      .from("schedule_settings")
      .insert({
        restaurant_id: ids.restaurantId,
      });

    if (scheduleError) {
      throw scheduleError;
    }

    console.log("========== RESTAURANT CREATED SUCCESSFULLY ==========");

    return NextResponse.json({
      success: true,
      restaurant: restaurantData,
    });
  } catch (error: any) {
    console.error("========== RESTAURANT CREATION FAILED ==========");
    console.error(error);

    const rollbackErrors = await rollbackCreatedData(ids);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Error interno",
        rollback: {
          attempted: Boolean(ids.restaurantId),
          successful: rollbackErrors.length === 0,
          errors: rollbackErrors,
        },
      },
      {
        status: 500,
      }
    );
  }
}
