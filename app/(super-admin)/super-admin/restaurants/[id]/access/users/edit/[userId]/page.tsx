"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
  code?: string | null;
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
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (restaurantId && userId) {
      loadData();
    }
  }, [restaurantId, userId]);

  async function loadData() {
    try {
      setLoadingData(true);

      await Promise.all([
        loadRoles(),
        loadUser(),
      ]);
    } finally {
      setLoadingData(false);
    }
  }

  async function loadRoles() {
    const { data, error } = await supabase
      .from("restaurant_roles")
      .select("id,name,code")
      .eq("restaurant_id", restaurantId)
      .order("name");

    if (error) {
      console.error("Error cargando roles:", error);
      return;
    }

    /*
     * Super Admin y Propietario son roles protegidos
     * y nunca aparecen en la administración operativa.
     */
    const operationalRoles = (data || []).filter((role) => {
      const name = String(role.name || "")
        .trim()
        .toLowerCase();

      const code = String(role.code || "")
        .trim()
        .toLowerCase();

      const protectedCodes = [
  "super-user",
  "owner",
  "manager",
];

      return !protectedCodes.includes(code);
    });

    setRoles(operationalRoles);
  }

  async function loadUser() {
    const { data, error } = await supabase
      .from("restaurant_users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error cargando usuario:", error);
      return;
    }

    if (!data) {
      alert("No se encontró el usuario.");
      router.back();
      return;
    }

    setEmail(data.email || "");
    setRoleId(data.role_id || "");
    setActive(Boolean(data.active));
  }

  async function saveUser() {
    if (!email || !roleId) {
      alert("Por favor, completa los campos requeridos.");
      return;
    }

    /*
     * Comprobación adicional:
     * el rol seleccionado debe pertenecer al listado operativo.
     */
    const selectedRole = roles.find(
      (role) => role.id === roleId
    );

    if (!selectedRole) {
      alert("Selecciona un rol operativo válido.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("restaurant_users")
        .update({
          email: email.trim(),
          role_id: roleId,
          active,
        })
        .eq("id", userId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Usuario actualizado correctamente.");

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/users`
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <main
        style={{
          maxWidth: "680px",
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
          Cargando usuario...
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "680px",
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
          Editar usuario
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "rgba(255,255,255,.45)",
            fontSize: "13px",
          }}
        >
          Actualiza el acceso y el rol operativo del usuario.
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
        {/* EMAIL */}
        <div style={{ marginBottom: "17px" }}>
          <label style={labelStyle}>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
        </div>

        {/* ROL */}
        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Rol operativo</label>

          {roles.length === 0 ? (
            <div
              style={{
                marginTop: "7px",
                padding: "12px",
                color: "#facc15",
                background: "rgba(250,204,21,.06)",
                border: "1px solid rgba(250,204,21,.12)",
                borderRadius: "10px",
                fontSize: "13px",
              }}
            >
              No hay roles operativos disponibles.
            </div>
          ) : (
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              style={inputStyle}
              disabled={loading}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          )}

          <p
            style={{
              margin: "7px 0 0",
              color: "rgba(255,255,255,.3)",
              fontSize: "11px",
            }}
          >
            Solo puedes asignar roles operativos.
          </p>
        </div>

        {/* ESTADO */}
        <div
          style={{
            padding: "12px 13px",
            borderRadius: "10px",
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,255,255,.06)",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              cursor: loading ? "default" : "pointer",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Usuario activo
              </div>

              <div
                style={{
                  marginTop: "3px",
                  color: "rgba(255,255,255,.35)",
                  fontSize: "11px",
                }}
              >
                Permite o bloquea el acceso al restaurante.
              </div>
            </div>

            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              disabled={loading}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#f97316",
              }}
            />
          </label>
        </div>

        {/* ACCIONES */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={saveUser}
            disabled={loading || roles.length === 0}
            style={{
              flex: 1,
              background:
                loading || roles.length === 0
                  ? "rgba(249,115,22,.4)"
                  : "#f97316",
              color: "#fff",
              border: "none",
              padding: "11px 15px",
              borderRadius: "10px",
              cursor:
                loading || roles.length === 0
                  ? "not-allowed"
                  : "pointer",
              fontSize: "13px",
              fontWeight: 750,
            }}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            onClick={() => router.back()}
            disabled={loading}
            style={{
              padding: "11px 15px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: "10px",
              color: "rgba(255,255,255,.65)",
              cursor: loading ? "not-allowed" : "pointer",
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

