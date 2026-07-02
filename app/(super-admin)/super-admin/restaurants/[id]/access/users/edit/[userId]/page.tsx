"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
};

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const userId = params.userId as string;

  const [roles, setRoles] = useState<Role[]>([]);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
    loadUser();
  }, []);

  async function loadRoles() {
    const { data } = await supabase
      .from("restaurant_roles")
      .select("id,name")
      .eq("restaurant_id", restaurantId)
      .order("name");
    if (data) setRoles(data);
  }

  async function loadUser() {
    const { data, error } = await supabase
      .from("restaurant_users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) { console.error(error); return; }
    setEmail(data.email);
    setRoleId(data.role_id);
    setActive(data.active);
  }

  async function saveUser() {
    if (!email || !roleId) {
      alert("Por favor, completa los campos requeridos");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("restaurant_users")
      .update({ email, role_id: roleId, active })
      .eq("id", userId);

    setLoading(false);
    if (error) { alert(error.message); return; }
    alert("Usuario actualizado");
    router.push(`/super-admin/restaurants/${restaurantId}/access/users`);
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", color: "#fff" }}>
      <p style={{ color: "#666", marginBottom: "8px" }}>Usuarios / Editar</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "30px" }}>✏️ Editar Usuario</h1>

      <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "14px", color: "#aaa" }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "14px", color: "#aaa" }}>Rol</label>
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)} style={inputStyle}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            Usuario activo
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={saveUser} disabled={loading} 
            style={{ flex: 1, background: "#f97316", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", cursor: "pointer", fontWeight: "700" }}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button onClick={() => router.back()} 
            style={{ padding: "16px 24px", background: "#333", border: "none", borderRadius: "14px", color: "#fff", cursor: "pointer", fontWeight: "600" }}>
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px", marginTop: "8px", background: "#111", color: "#fff", 
  border: "1px solid #333", borderRadius: "12px", outline: "none", fontSize: "16px"
};