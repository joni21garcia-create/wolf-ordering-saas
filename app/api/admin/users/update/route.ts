import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PROTECTED = ["super-user", "owner", "manager"];

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function canAssign(creator: string, target: string) {
  if (creator === "super-user") return true;
  if (creator === "owner") return target !== "super-user" && target !== "owner";
  if (creator === "manager") return !PROTECTED.includes(target);
  return false;
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) return json({ error: "Sesión inválida o expirada." }, 401);

    const body = await request.json();
    const restaurantId = String(body?.restaurant_id || "").trim();
    const userId = String(body?.user_id || "").trim();
    const fullName = String(body?.full_name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const active = Boolean(body?.active);
    const roleId = body?.role_id ? String(body.role_id) : null;

    if (!restaurantId || !userId || !fullName || !email) return json({ error: "Faltan datos obligatorios." }, 400);

    const { data: creatorProfiles, error: profileError } = await supabaseAdmin
      .from("restaurant_users")
      .select("restaurant_id, role_id, active")
      .eq("auth_user_id", authUser.id);
    if (profileError) return json({ error: profileError.message }, 500);

    const creatorProfile = (creatorProfiles || []).find((p: any) => p.restaurant_id === restaurantId && p.active !== false);
    if (!creatorProfile) return json({ error: "No tienes acceso a este restaurante." }, 403);

    const { data: creatorRole } = await supabaseAdmin
      .from("restaurant_roles")
      .select("code")
      .eq("id", String(creatorProfile.role_id || ""))
      .maybeSingle();
    const creatorCode = String(creatorRole?.code || "").trim().toLowerCase();
    if (!["super-user", "owner", "manager"].includes(creatorCode)) return json({ error: "Tu rol no puede administrar usuarios." }, 403);

    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from("restaurant_users")
      .select("id, role_id")
      .eq("id", userId)
      .eq("restaurant_id", restaurantId)
      .maybeSingle();
    if (targetError) return json({ error: targetError.message }, 500);
    if (!targetUser) return json({ error: "Usuario no encontrado." }, 404);

    if (targetUser.role_id) {
      const { data: targetCurrentRole } = await supabaseAdmin
        .from("restaurant_roles")
        .select("code")
        .eq("id", targetUser.role_id)
        .maybeSingle();
      const currentCode = String(targetCurrentRole?.code || "").trim().toLowerCase();
      if (!canAssign(creatorCode, currentCode)) return json({ error: "No puedes administrar a este usuario por su nivel de rol." }, 403);
    }

    if (!roleId) return json({ error: "Debes seleccionar un rol." }, 400);

    const { data: targetRole, error: roleError } = await supabaseAdmin
      .from("restaurant_roles")
      .select("id, restaurant_id, code")
      .eq("id", roleId)
      .maybeSingle();
    if (roleError) return json({ error: roleError.message }, 500);
    if (!targetRole || targetRole.restaurant_id !== restaurantId) return json({ error: "El rol seleccionado no pertenece al restaurante." }, 400);

    const targetCode = String(targetRole.code || "").trim().toLowerCase();
    if (!canAssign(creatorCode, targetCode)) return json({ error: "No tienes permiso para asignar ese rol." }, 403);

    const { error: updateError } = await supabaseAdmin
      .from("restaurant_users")
      .update({ full_name: fullName, email, phone: phone || null, active, role_id: roleId })
      .eq("id", userId)
      .eq("restaurant_id", restaurantId);
    if (updateError) return json({ error: updateError.message }, 400);

    return json({ success: true });
  } catch (error) {
    console.error("[UPDATE USER]", error);
    return json({ error: error instanceof Error ? error.message : "Error actualizando usuario." }, 500);
  }
}
