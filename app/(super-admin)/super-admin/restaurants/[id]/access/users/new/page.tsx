"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
  code?: string | null;
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
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadRoles();
    }
  }, [restaurantId]);

  async function loadRoles() {
    try {
      setLoadingRoles(true);

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
       * Los roles estructurales de Wolf NO se pueden
       * asignar desde el panel del restaurante.
       *
       * Solo se muestran roles operativos.
       */
      const operationalRoles = (data || []).filter((role) => {
        const name = (role.name || "").trim().toLowerCase();
        const code = (role.code || "").trim().toLowerCase();

        const protectedCodes = [
  "super-user",
  "owner",
  "manager",
];

        return !protectedCodes.includes(code);
      });

      setRoles(operationalRoles);

      if (operationalRoles.length > 0) {
        setRoleId(operationalRoles[0].id);
      } else {
        setRoleId("");
      }
    } finally {
      setLoadingRoles(false);
    }
  }

  async function createUser() {
    try {
      setLoading(true);

      if (!email || !password || !roleId || !fullName || !phone) {
        alert("Por favor, completa todos los campos");
        return;
      }

      /*
       * Seguridad adicional:
       * verificamos que el rol seleccionado pertenezca
       * realmente al listado operativo.
       */
      const selectedRole = roles.find((role) => role.id === roleId);

      if (!selectedRole) {
        alert("Selecciona un rol operativo válido");
        return;
      }

      const { data: existing } = await supabase
        .from("restaurant_users")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        alert("Ese correo ya existe en este restaurante");
        return;
      }

      const { error } = await supabase.functions.invoke(
        "create-restaurant-user",
        {
          body: {
            email,
            password,
            full_name: fullName,
            phone,
            restaurant_id: restaurantId,
            role_id: roleId,
          },
        }
      );

      if (error) {
        alert(error.message);
        return;
      }

      alert("Usuario creado correctamente");

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/users`
      );
    } catch (error) {
      console.error(error);
      alert("Error creando usuario");
    } finally {
      setLoading(false);
    }
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
          Nuevo usuario
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "rgba(255,255,255,.45)",
            fontSize: "13px",
          }}
        >
          Crea una cuenta y asígnale un rol operativo.
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* NOMBRE */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Nombre completo</label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label style={labelStyle}>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={inputStyle}
            />
          </div>

          {/* TELEFONO */}
          <div>
            <label style={labelStyle}>Teléfono</label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="099..."
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña temporal"
              style={inputStyle}
            />
          </div>

          {/* ROL */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Rol operativo</label>

            {loadingRoles ? (
              <div
                style={{
                  marginTop: "7px",
                  padding: "12px",
                  color: "rgba(255,255,255,.4)",
                  background: "#0b0f16",
                  border: "1px solid rgba(255,255,255,.07)",
                  borderRadius: "10px",
                  fontSize: "13px",
                }}
              >
                Cargando roles...
              </div>
            ) : roles.length === 0 ? (
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
                color: "rgba(255,255,255,.32)",
                fontSize: "11px",
                lineHeight: 1.5,
              }}
            >
              Solo puedes asignar roles operativos del restaurante.
            </p>
          </div>
        </div>

        {/* ACCIONES */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "22px",
          }}
        >
          <button
            onClick={createUser}
            disabled={loading || loadingRoles || roles.length === 0}
            style={{
              flex: 1,
              background:
                loading || loadingRoles || roles.length === 0
                  ? "rgba(249,115,22,.35)"
                  : "#f97316",
              color: "#fff",
              border: "none",
              padding: "11px 15px",
              borderRadius: "10px",
              cursor:
                loading || loadingRoles || roles.length === 0
                  ? "not-allowed"
                  : "pointer",
              fontSize: "13px",
              fontWeight: 750,
            }}
          >
            {loading ? "Creando..." : "Crear usuario"}
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

