import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "No autorizado." },
        { status: 401 }
      );
    }

    const { data: isSuperAdmin, error: roleError } =
      await supabase.rpc("is_super_admin");

    if (roleError || !isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Solo Super Admin puede eliminar usuarios." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const userId = String(body?.userId || "").trim();
    const restaurantId = String(body?.restaurantId || "").trim();

    if (!userId || !restaurantId) {
      return NextResponse.json(
        { success: false, error: "userId y restaurantId son obligatorios." },
        { status: 400 }
      );
    }

    const { data: target, error: targetError } = await supabaseAdmin
      .from("restaurant_users")
      .select("id, auth_user_id, restaurant_id")
      .eq("id", userId)
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (targetError) {
      return NextResponse.json(
        { success: false, error: targetError.message },
        { status: 500 }
      );
    }

    if (!target) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado en este restaurante." },
        { status: 404 }
      );
    }

    const { error: deleteProfileError } = await supabaseAdmin
      .from("restaurant_users")
      .delete()
      .eq("id", target.id)
      .eq("restaurant_id", restaurantId);

    if (deleteProfileError) {
      return NextResponse.json(
        { success: false, error: deleteProfileError.message },
        { status: 400 }
      );
    }

    // Un usuario puede estar vinculado a más de un restaurante.
    // Solo eliminamos Auth si ya no tiene ningún vínculo restante.
    let authDeleted = false;

    if (target.auth_user_id) {
      const { count, error: remainingError } = await supabaseAdmin
        .from("restaurant_users")
        .select("id", { count: "exact", head: true })
        .eq("auth_user_id", target.auth_user_id);

      if (remainingError) {
        console.error("[DELETE USER][REMAINING LINKS]", remainingError);
      } else if ((count ?? 0) === 0) {
        const { error: authDeleteError } =
          await supabaseAdmin.auth.admin.deleteUser(target.auth_user_id);

        if (authDeleteError) {
          console.error("[DELETE USER][AUTH]", authDeleteError);
          return NextResponse.json({
            success: true,
            warning: "El acceso del restaurante fue eliminado, pero la cuenta Auth no pudo eliminarse.",
            authDeleted: false,
          });
        }

        authDeleted = true;
      }
    }

    return NextResponse.json({
      success: true,
      authDeleted,
    });
  } catch (error: any) {
    console.error("[DELETE RESTAURANT USER]", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
