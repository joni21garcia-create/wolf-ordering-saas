"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function UsersPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, [restaurantId]);

  async function loadUsers() {
    const { data, error } = await supabase
      .from("restaurant_users")
      .select(`*, restaurant_roles (id, name, code)`)
      .eq("restaurant_id", restaurantId);

    if (error) { console.error(error); return; }
    setUsers(data || []);
  }

  async function toggleUser(user: any) {
    const confirmAction = confirm(user.active ? "¿Desactivar usuario?" : "¿Activar usuario?");
    if (!confirmAction) return;

    const { error } = await supabase
      .from("restaurant_users")
      .update({ active: !user.active })
      .eq("id", user.id);

    if (error) { alert(error.message); return; }
    loadUsers();
  }

  function StatCard({ title, value }: { title: string; value: string }) {
    return (
      <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px" }}>
        <div style={{ color: "#888", marginBottom: "8px", fontSize: "14px" }}>{title}</div>
        <div style={{ fontSize: "32px", fontWeight: "800", color: "#fff" }}>{value}</div>
      </div>
    );
  }

  return (
    <PermissionGuard permission="users">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", color: "#fff" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <div>
            <p style={{ color: "#666", margin: 0 }}>Acceso / Usuarios</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: 0 }}>👥 Usuarios</h1>
          </div>
          <Link href={`/super-admin/restaurants/${restaurantId}/access/users/new`} 
            style={{ background: "#f97316", color: "#fff", padding: "12px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: "700" }}>
            + Nuevo Usuario
          </Link>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <StatCard title="Usuarios" value={String(users.length)} />
          <StatCard title="Activos" value={String(users.filter((u) => u.active).length)} />
          <StatCard title="Pendientes" value="0" />
          <StatCard title="Suspendidos" value={String(users.filter((u) => !u.active).length)} />
        </div>

        {/* USERS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {users.map((user) => (
            <div key={user.id} style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>{user.email}</h3>
                <p style={{ color: "#f97316", fontWeight: "700", margin: 0 }}>{user.restaurant_roles?.name}</p>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={{ 
                  background: user.active ? "rgba(34,197,94,.15)" : "rgba(250,204,21,.15)", 
                  color: user.active ? "#22c55e" : "#facc15", 
                  padding: "6px 12px", borderRadius: "999px", fontSize: "14px", fontWeight: "700" 
                }}>
                  {user.active ? "Activo" : "Inactivo"}
                </span>

                <Link href={`/super-admin/restaurants/${restaurantId}/access/users/edit/${user.id}`}
                  style={{ background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: "10px", textDecoration: "none", fontSize: "14px" }}>
                  ✏️ Editar
                </Link>

                <button onClick={() => toggleUser(user)}
                  style={{ background: user.active ? "#dc2626" : "#16a34a", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>
                  {user.active ? "🚫 Desactivar" : "✅ Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PermissionGuard>
  );
}