"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
};

export default function NewUserPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [roles, setRoles] = useState<Role[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    const { data } = await supabase
      .from("restaurant_roles")
      .select("id,name")
      .eq("restaurant_id", restaurantId)
      .order("name");

    if (data) {
      setRoles(data);
      if (data.length > 0) setRoleId(data[0].id);
    }
  }

  async function createUser() {
    try {
      setLoading(true);
      if (!email || !password || !roleId || !fullName || !phone) {
        alert("Por favor, completa todos los campos");
        return;
      }

      const { data: existing } = await supabase
        .from("restaurant_users")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("email", email)
        .maybeSingle();

      if (existing) { alert("Ese correo ya existe en este restaurante"); return; }

      const { error } = await supabase.functions.invoke("create-restaurant-user", {
        body: { email, password, full_name: fullName, phone, restaurant_id: restaurantId, role_id: roleId },
      });

      if (error) { alert(error.message); return; }
      alert("Usuario creado correctamente");
      router.push(`/super-admin/restaurants/${restaurantId}/access/users`);
    } catch (error) {
      console.error(error);
      alert("Error creando usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", color: "#fff" }}>
      <p style={{ color: "#666", marginBottom: "8px" }}>Acceso / Usuarios / Nuevo</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "30px" }}>👤 Nuevo Usuario</h1>

      <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "14px", color: "#aaa" }}>Nombre Completo</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: "14px", color: "#aaa" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: "14px", color: "#aaa" }}>Teléfono</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "14px", color: "#aaa" }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "14px", color: "#aaa" }}>Rol</label>
            <select value={roleId} onChange={(e) => setRoleId(e.target.value)} style={inputStyle}>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
          <button onClick={createUser} disabled={loading} 
            style={{ flex: 1, background: "#f97316", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", cursor: "pointer", fontWeight: "700" }}>
            {loading ? "Guardando..." : "Crear Usuario"}
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