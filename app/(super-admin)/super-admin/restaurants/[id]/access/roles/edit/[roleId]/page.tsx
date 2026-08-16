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
      <main style={pageStyle}>
        <div style={loadingStyle}>Cargando rol...</div>
      </main>
    );
  }

  if (!role) return null;

  return (
    <main style={pageStyle}>
      <header style={{ marginBottom: "12px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={saving}
          style={backButtonStyle}
          aria-label="Volver a roles"
        >
          <span style={backIconStyle}>‹</span>
          Volver
        </button>

        <div style={eyebrowStyle}>Equipo</div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1 style={titleStyle}>Editar rol</h1>
            <p style={subtitleStyle}>
              Actualiza el nombre del rol operativo.
            </p>
          </div>

          <span style={roleBadgeStyle}>Operativo</span>
        </div>
      </header>

      <section style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardHeaderLabelStyle}>Datos del rol</span>
        </div>

        <div style={{ padding: "12px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Nombre del rol</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              autoComplete="off"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Código interno</label>

            <input
              value={role.code}
              disabled
              readOnly
              style={{
                ...inputStyle,
                color: "rgba(255,255,255,.32)",
                cursor: "not-allowed",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
            />

            <p style={helpStyle}>
              El código está estandarizado y no puede modificarse desde el
              restaurante.
            </p>
          </div>

          <div style={infoStyle}>
            <span style={infoIconStyle}>i</span>
            <div>
              <div style={infoTitleStyle}>Permisos del rol</div>
              <div style={infoTextStyle}>
                Los módulos y permisos se administran desde la sección
                <strong style={{ color: "rgba(255,255,255,.58)" }}>
                  {" "}
                  Permisos
                </strong>
                .
              </div>
            </div>
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={saveRole}
              disabled={saving}
              style={{
                ...saveButtonStyle,
                opacity: saving ? 0.55 : 1,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              style={{
                ...cancelButtonStyle,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        input:focus {
          border-color: rgba(249, 115, 22, 0.45) !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.07);
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 390px) {
          .role-actions {
            flex-direction: column-reverse !important;
          }
        }
      `}</style>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "620px",
  margin: "0 auto",
  padding: "16px 12px 42px",
  color: "#fff",
  boxSizing: "border-box",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const loadingStyle: React.CSSProperties = {
  padding: "42px 15px",
  textAlign: "center",
  color: "rgba(255,255,255,.38)",
  fontSize: "10px",
};

const backButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  border: "1px solid rgba(255,255,255,.07)",
  background: "rgba(255,255,255,.035)",
  color: "rgba(255,255,255,.62)",
  borderRadius: "999px",
  padding: "6px 10px 6px 7px",
  marginBottom: "10px",
  cursor: "pointer",
  fontSize: "9px",
  fontWeight: 750,
};

const backIconStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  background: "rgba(249,115,22,.12)",
  color: "#f97316",
  fontSize: "17px",
  lineHeight: 1,
};

const eyebrowStyle: React.CSSProperties = {
  color: "#f97316",
  fontSize: "8px",
  fontWeight: 800,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  marginBottom: "3px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "22px",
  lineHeight: 1.1,
  fontWeight: 800,
  letterSpacing: "-.4px",
};

const subtitleStyle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "rgba(255,255,255,.38)",
  fontSize: "10px",
  lineHeight: 1.45,
};

const roleBadgeStyle: React.CSSProperties = {
  flexShrink: 0,
  padding: "5px 7px",
  borderRadius: "999px",
  color: "#f97316",
  background: "rgba(249,115,22,.08)",
  border: "1px solid rgba(249,115,22,.14)",
  fontSize: "8px",
  fontWeight: 800,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.06)",
  borderRadius: "12px",
  background: "rgba(17,24,39,.72)",
  overflow: "hidden",
};

const cardHeaderStyle: React.CSSProperties = {
  padding: "11px 12px",
  borderBottom: "1px solid rgba(255,255,255,.045)",
};

const cardHeaderLabelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.55)",
  fontSize: "9px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".8px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,.58)",
  fontSize: "9px",
  fontWeight: 750,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "39px",
  boxSizing: "border-box",
  padding: "9px 10px",
  marginTop: "6px",
  background: "#0b0f16",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: "8px",
  outline: "none",
  fontSize: "10px",
};

const helpStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "rgba(255,255,255,.25)",
  fontSize: "8px",
  lineHeight: 1.4,
};

const infoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  padding: "9px 10px",
  borderRadius: "8px",
  background: "rgba(249,115,22,.045)",
  border: "1px solid rgba(249,115,22,.10)",
  marginBottom: "12px",
};

const infoIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: "18px",
  height: "18px",
  display: "grid",
  placeItems: "center",
  borderRadius: "6px",
  background: "rgba(249,115,22,.10)",
  color: "#f97316",
  fontSize: "9px",
  fontWeight: 800,
};

const infoTitleStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.52)",
  fontSize: "9px",
  fontWeight: 750,
  marginBottom: "2px",
};

const infoTextStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.32)",
  fontSize: "8px",
  lineHeight: 1.45,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "6px",
  paddingTop: "11px",
  borderTop: "1px solid rgba(255,255,255,.045)",
};

const saveButtonStyle: React.CSSProperties = {
  flex: 1,
  minHeight: "38px",
  border: "none",
  borderRadius: "8px",
  background: "#f97316",
  color: "#fff",
  fontSize: "10px",
  fontWeight: 800,
};

const cancelButtonStyle: React.CSSProperties = {
  minHeight: "38px",
  padding: "0 12px",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: "8px",
  background: "rgba(255,255,255,.035)",
  color: "rgba(255,255,255,.58)",
  fontSize: "10px",
  fontWeight: 700,
};