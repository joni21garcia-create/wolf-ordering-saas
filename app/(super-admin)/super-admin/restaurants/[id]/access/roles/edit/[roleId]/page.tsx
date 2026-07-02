"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const roleId = params.roleId as string;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const { data, error } = await supabase
      .from("restaurant_roles")
      .select("*")
      .eq("id", roleId)
      .maybeSingle();

    if (error) { console.error(error); return; }
    if (data) {
      setName(data.name || "");
      setCode(data.code || "");
    }
  }

  async function saveRole() {
    if (!name || !code) {
      alert("Por favor, completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("restaurant_roles")
        .update({ name, code: code.toLowerCase() })
        .eq("id", roleId);

      if (error) { alert(error.message); return; }

      alert("Rol actualizado correctamente");
      router.push(`/super-admin/restaurants/${restaurantId}/access/roles`);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el rol");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#fff" }}>
      <p style={{ color: "#666", marginBottom: "8px" }}>Roles / Editar</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "30px" }}>🛡️ Editar Rol</h1>

      <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "14px", color: "#aaa" }}>Nombre del Rol</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ fontSize: "14px", color: "#aaa" }}>Código Interno</label>
          <input 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={saveRole} disabled={loading} 
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