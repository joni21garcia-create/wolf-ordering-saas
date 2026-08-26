"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/providers/SessionProvider";

type Role = {
  id: string;
  name: string;
  code?: string | null;
};

export default function NewUserPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, loading: sessionLoading } = useSession();

  const restaurantId = params.id as string;

  const [roles, setRoles] = useState<Role[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const isSuperAdmin =
    currentUser?.role?.code?.trim().toLowerCase() === "super-user";

  useEffect(() => {
    if (!sessionLoading && restaurantId) {
      loadRoles();
    }
  }, [restaurantId, sessionLoading]);

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
      const operationalRoles = isSuperAdmin
        ? (data || [])
        : (data || []).filter((role) => {
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

      const response = await fetch("/api/super-admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          full_name: fullName.trim(),
          phone: phone.trim(),
          restaurant_id: restaurantId,
          role_id: roleId,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        alert(
          result?.error ||
            "No se pudo crear el usuario."
        );
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
        width: "100%",
        maxWidth: "620px",
        margin: "0 auto",
        padding: "16px 12px 42px",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#f97316",
              fontSize: "8px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "3px",
            }}
          >
            Equipo
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-0.4px",
            }}
          >
            Nuevo usuario
          </h1>

          <p
            style={{
              margin: "4px 0 0",
              color: "rgba(255,255,255,.38)",
              fontSize: "10px",
            }}
          >
            Crea una cuenta y asígnale un rol operativo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          aria-label="Volver"
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            display: "grid",
            placeItems: "center",
            padding: 0,
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: "8px",
            background: "rgba(255,255,255,.035)",
            color: "rgba(255,255,255,.65)",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          ‹
        </button>
      </header>

      <section
        style={{
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: "12px",
          background: "rgba(17,24,39,.72)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 13px",
            borderBottom: "1px solid rgba(255,255,255,.045)",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: "9px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".8px",
            }}
          >
            Datos de acceso
          </div>
        </div>

        <div style={{ padding: "13px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
            className="form-grid"
          >
            <div className="full">
              <label style={labelStyle}>Nombre completo</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                autoComplete="name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="099..."
                autoComplete="tel"
                style={inputStyle}
              />
            </div>

            <div className="full">
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña temporal"
                autoComplete="new-password"
                style={inputStyle}
              />
              <div
                style={{
                  marginTop: "4px",
                  color: "rgba(255,255,255,.25)",
                  fontSize: "8px",
                }}
              >
                Usa una contraseña temporal segura.
              </div>
            </div>

            <div className="full">
              <label style={labelStyle}>Rol operativo</label>

              {loadingRoles ? (
                <div
                  style={{
                    marginTop: "6px",
                    minHeight: "39px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 11px",
                    boxSizing: "border-box",
                    color: "rgba(255,255,255,.4)",
                    background: "#0b0f16",
                    border: "1px solid rgba(255,255,255,.07)",
                    borderRadius: "8px",
                    fontSize: "10px",
                  }}
                >
                  Cargando roles...
                </div>
              ) : roles.length === 0 ? (
                <div
                  style={{
                    marginTop: "6px",
                    padding: "10px",
                    color: "#facc15",
                    background: "rgba(250,204,21,.05)",
                    border: "1px solid rgba(250,204,21,.12)",
                    borderRadius: "8px",
                    fontSize: "9px",
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
                  margin: "5px 0 0",
                  color: "rgba(255,255,255,.27)",
                  fontSize: "8px",
                  lineHeight: 1.4,
                }}
              >
                Solo puedes asignar roles operativos del restaurante.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "7px",
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,.045)",
            }}
          >
            <button
              type="button"
              onClick={createUser}
              disabled={loading || loadingRoles || roles.length === 0}
              style={{
                flex: 1,
                minHeight: "38px",
                border: "none",
                borderRadius: "8px",
                background:
                  loading || loadingRoles || roles.length === 0
                    ? "rgba(249,115,22,.28)"
                    : "#f97316",
                color: "#fff",
                cursor:
                  loading || loadingRoles || roles.length === 0
                    ? "not-allowed"
                    : "pointer",
                fontSize: "10px",
                fontWeight: 800,
              }}
            >
              {loading ? "Creando..." : "Crear usuario"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              style={{
                minHeight: "38px",
                padding: "0 13px",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: "8px",
                background: "rgba(255,255,255,.035)",
                color: "rgba(255,255,255,.58)",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 520px) {
          main {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }

          .form-grid {
            grid-template-columns: 1fr !important;
          }

          .full {
            grid-column: auto !important;
          }
        }

        input,
        select,
        button {
          -webkit-tap-highlight-color: transparent;
        }

        input:focus,
        select:focus {
          border-color: rgba(249, 115, 22, 0.45) !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.07);
        }
      `}</style>
    </main>
  );
}

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