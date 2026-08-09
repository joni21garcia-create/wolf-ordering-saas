"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
  code: string;
};

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.id as string;
  const roleId = params.roleId as string;

  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurantId && roleId) {
      loadRole();
    }
  }, [restaurantId, roleId]);

  async function loadRole() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("restaurant_roles")
        .select("id,name,code")
        .eq("id", roleId)
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

      if (error) {
        console.error("Error cargando rol:", error);
        return;
      }

      if (!data) {
        alert("No se encontró el rol.");
        router.back();
        return;
      }

      const roleName = String(data.name || "")
        .trim()
        .toLowerCase();

      const roleCode = String(data.code || "")
        .trim()
        .toLowerCase();

      const protectedNames = [
        "super admin",
        "superadmin",
        "propietario",
        "owner",
      ];

      const protectedCodes = [
        "super_admin",
        "superadmin",
        "propietario",
        "owner",
      ];

      const isProtected =
        protectedNames.includes(roleName) ||
        protectedCodes.includes(roleCode);

      if (isProtected) {
        alert("Este rol está protegido y no puede editarse desde aquí.");
        router.push(
          `/super-admin/restaurants/${restaurantId}/access/roles`
        );
        return;
      }

      setRole(data);
      setName(data.name || "");
    } finally {
      setLoading(false);
    }
  }

  async function saveRole() {
    const cleanName = name.trim();

    if (!cleanName) {
      alert("Por favor, escribe un nombre para el rol.");
      return;
    }

    if (!role) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("restaurant_roles")
        .update({
          name: cleanName,
        })
        .eq("id", roleId)
        .eq("restaurant_id", restaurantId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Rol actualizado correctamente.");

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/roles`
      );
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          padding: "40px 20px",
          color: "#fff",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,.4)",
            fontSize: "13px",
          }}
        >
          Cargando rol...
        </div>
      </main>
    );
  }

  if (!role) return null;

  return (
    <main
      style={{
        maxWidth: "620px",
        margin: "0 auto",
        padding: "24px 20px 60px",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <header style={{ marginBottom: "22px" }}>
        <div
          style={{
            color: "#f97316",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            marginBottom: "7px",
          }}
        >
          Equipo
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            lineHeight: 1.15,
            fontWeight: 800,
          }}
        >
          Editar rol
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "rgba(255,255,255,.45)",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Modifica el nombre del rol operativo.
        </p>
      </header>

      {/* FORMULARIO */}
      <section
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        {/* NOMBRE */}
        <div style={{ marginBottom: "17px" }}>
          <label style={labelStyle}>Nombre del rol</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            style={inputStyle}
          />
        </div>

        {/* CÃ“DIGO */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Código interno</label>

          <input
            value={role.code}
            disabled
            readOnly
            style={{
              ...inputStyle,
              color: "rgba(255,255,255,.35)",
              cursor: "not-allowed",
            }}
          />

          <p
            style={{
              margin: "7px 0 0",
              color: "rgba(255,255,255,.3)",
              fontSize: "11px",
              lineHeight: 1.5,
            }}
          >
            El código está estandarizado y no puede modificarse desde
            el restaurante.
          </p>
        </div>

        {/* INFORMACIÃ“N */}
        <div
          style={{
            padding: "12px 13px",
            borderRadius: "10px",
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,255,255,.06)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,.42)",
              fontSize: "11px",
              lineHeight: 1.55,
            }}
          >
            Los permisos asociados al rol son administrados desde
            Wolf y no se modifican desde este panel.
          </div>
        </div>

        {/* ACCIONES */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={saveRole}
            disabled={saving}
            style={{
              flex: 1,
              background: saving
                ? "rgba(249,115,22,.4)"
                : "#f97316",
              color: "#fff",
              border: "none",
              padding: "11px 15px",
              borderRadius: "10px",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontWeight: 750,
            }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            onClick={() => router.back()}
            disabled={saving}
            style={{
              padding: "11px 15px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: "10px",
              color: "rgba(255,255,255,.65)",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Cancelar
          </button>
        </div>
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,.62)",
  fontSize: "12px",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  marginTop: "7px",
  background: "#0b0f16",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "10px",
  outline: "none",
  fontSize: "13px",
};
