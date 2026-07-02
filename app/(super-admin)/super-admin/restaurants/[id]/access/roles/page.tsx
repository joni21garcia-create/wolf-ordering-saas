"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function RolesPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    loadRoles();
  }, [restaurantId]);

  async function loadRoles() {
    const { data } = await supabase.from("restaurant_roles").select("*").eq("restaurant_id", restaurantId);
    
    if (!data) return;

    const rolesWithStats = await Promise.all(
      data.map(async (role) => {
        const { count: usersCount } = await supabase.from("restaurant_users").select("*", { count: "exact", head: true }).eq("restaurant_id", restaurantId).eq("role_id", role.id);
        const { count: permissionsCount } = await supabase.from("role_modules").select("*", { count: "exact", head: true }).eq("role_id", role.id).eq("can_view", true);

        return { ...role, users: usersCount || 0, permissions: permissionsCount || 0 };
      })
    );
    setRoles(rolesWithStats);
  }

  const roleConfig: any = {
    superadmin: { icon: "👑", color: "#f97316", description: "Control total de Wolf Ordering." },
    owner: { icon: "🏆", color: "#eab308", description: "Propietario del restaurante." },
    manager: { icon: "🛡️", color: "#3b82f6", description: "Gestiona la operación diaria." },
    marketing: { icon: "📢", color: "#a855f7", description: "Gestiona campañas y contenido." },
  };

  const formattedRoles = roles.map((role) => {
    const roleKey = String(role.name || "").trim().toLowerCase().replace(/\s+/g, "");
    return { ...role, ...(roleConfig[roleKey] || { icon: "🛡️", color: "#3b82f6", description: "Rol personalizado" }) };
  });

  const totalUsers = formattedRoles.reduce((acc, role) => acc + role.users, 0);
  const totalPermissions = formattedRoles.reduce((acc, role) => acc + role.permissions, 0);

  return (
    <PermissionGuard permission="roles">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", color: "#fff" }}>
        {/* HEADER */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <div>
            <p style={{ color: "#666", margin: 0 }}>Acceso / Roles</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: 0 }}>🛡️ Roles y Cargos</h1>
            <p style={{ color: "#888", marginTop: "10px", maxWidth: "600px" }}>Define permisos y niveles de acceso dentro del restaurante.</p>
          </div>
          <Link href={`/super-admin/restaurants/${restaurantId}/access/roles/new`} 
            style={{ background: "#f97316", color: "#fff", padding: "12px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: "700" }}>
            + Nuevo Rol
          </Link>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <StatCard title="Roles" value={String(roles.length)} />
          <StatCard title="Usuarios" value={String(totalUsers)} />
          <StatCard title="Permisos" value={String(totalPermissions)} />
          <StatCard title="Activos" value={String(roles.length)} />
        </div>

        {/* ROLES GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {formattedRoles.map((role) => (
            <div key={role.id} style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "25px", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>{role.icon}</div>
              <h2 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>{role.name}</h2>
              <p style={{ color: "#999", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>{role.description}</p>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,.03)", padding: "10px", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ color: "#777", fontSize: "12px" }}>Usuarios</div>
                  <div style={{ fontSize: "20px", fontWeight: "800" }}>{role.users}</div>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,.03)", padding: "10px", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ color: "#777", fontSize: "12px" }}>Permisos</div>
                  <div style={{ fontSize: "20px", fontWeight: "800" }}>{role.permissions}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Link href={`/super-admin/restaurants/${restaurantId}/access/roles/edit/${role.id}`}
                  style={{ flex: 1, background: role.color, color: "#fff", padding: "10px", borderRadius: "10px", textDecoration: "none", textAlign: "center", fontSize: "14px", fontWeight: "700" }}>
                  ✏️ Editar
                </Link>
                <Link href={`/super-admin/restaurants/${restaurantId}/access/permissions?role=${role.id}`}
                  style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "10px", borderRadius: "10px", textDecoration: "none", textAlign: "center", fontSize: "14px" }}>
                  🔐 Permisos
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* INFO PANEL */}
        <div style={{ marginTop: "40px", background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "25px" }}>
          <h3 style={{ marginTop: 0 }}>Arquitectura Wolf Roles</h3>
          <p style={{ color: "#888", lineHeight: 1.6, margin: 0 }}>Los usuarios heredan permisos desde su rol asignado. Un cambio realizado en un rol impacta automáticamente a todos los usuarios asociados.</p>
        </div>
      </main>
    </PermissionGuard>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px" }}>
      <div style={{ color: "#888", fontSize: "13px", marginBottom: "5px" }}>{title}</div>
      <div style={{ fontSize: "32px", fontWeight: "800", color: "#fff" }}>{value}</div>
    </div>
  );
}