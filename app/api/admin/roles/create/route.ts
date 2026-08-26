import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PROTECTED_CODES = ["super-user", "owner", "manager"];

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) return json({ error: "Sesión inválida o expirada." }, 401);

    const body = await request.json();
    const restaurantId = String(body?.restaurant_id || "").trim();
    const name = String(body?.name || "").trim();
    const code = String(body?.code || "").trim().toLowerCase();

    if (!restaurantId || !name || !code) return json({ error: "Faltan datos obligatorios." }, 400);
    if (PROTECTED_CODES.includes(code)) return json({ error: "Ese código está reservado para un rol protegido." }, 400);

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("restaurant_users")
      .select("restaurant_id, role_id, active")
      .eq("auth_user_id", authUser.id);

    if (profilesError) return json({ error: profilesError.message }, 500);

    const activeProfiles = (profiles || []).filter((p: any) => p.active !== false);
    const targetProfile = activeProfiles.find((p: any) => p.restaurant_id === restaurantId);

    if (!targetProfile) return json({ error: "No tienes acceso a este restaurante." }, 403);

    const { data: creatorRole, error: creatorRoleError } = await supabaseAdmin
      .from("restaurant_roles")
      .select("id, code, name")
      .eq("id", String(targetProfile.role_id || ""))
      .maybeSingle();

    if (creatorRoleError || !creatorRole) return json({ error: "No se pudo determinar tu rol." }, 403);

    const creatorCode = String(creatorRole.code || "").trim().toLowerCase();
    if (!["super-user", "owner", "manager"].includes(creatorCode)) {
      return json({ error: "Solo Owner, Manager o Super Admin pueden crear roles personalizados." }, 403);
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("restaurant_roles")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("code", code)
      .maybeSingle();

    if (existingError) return json({ error: existingError.message }, 500);
    if (existing) return json({ error: "Ya existe un rol con ese código." }, 409);

    const { data: createdRole, error: insertError } = await supabaseAdmin
      .from("restaurant_roles")
      .insert({ restaurant_id: restaurantId, name, code })
      .select("id, restaurant_id, name, code")
      .single();

    if (insertError) return json({ error: insertError.message }, 400);

    return json({ success: true, role: createdRole }, 201);
  } catch (error) {
    console.error("[CREATE ROLE]", error);
    return json({ error: error instanceof Error ? error.message : "Error inesperado creando el rol." }, 500);
  }
}
