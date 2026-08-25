"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/providers/SessionProvider";

export default function NewRolePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, loading: sessionLoading } = useSession();

  const restaurantId = params.id as string;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const isSuperAdmin =
    currentUser?.role?.code?.trim().toLowerCase() === "super-user";

  async function createRole() {
    try {
      const cleanName = name.trim();
      const cleanCode = code.trim().toLowerCase();

      if (!cleanName || !cleanCode) {
        alert("Completa el nombre y el código del rol.");
        return;
      }

      /*
       * Roles protegidos de Wolf.
       * Nunca pueden ser creados desde el panel del restaurante.
       */
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

      if (
        !isSuperAdmin &&
        (protectedNames.includes(cleanName.toLowerCase()) ||
          protectedCodes.includes(cleanCode))
      ) {
        alert(
          "Ese rol está reservado y no puede ser creado desde el restaurante."
        );
        return;
      }

      if (sessionLoading) {
        alert("Espera a que termine de cargar la sesión.");
        return;
      }

      setLoading(true);

      /*
       * Verificamos que el código no exista
       * dentro de este restaurante.
       */
      const { data: existing } = await supabase
        .from("restaurant_roles")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("code", cleanCode)
        .maybeSingle();

      if (existing) {
        alert("Ese código ya existe en este restaurante.");
        return;
      }

      const { error } = await supabase
        .from("restaurant_roles")
        .insert({
          restaurant_id: restaurantId,
          name: cleanName,
          code: cleanCode,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Rol operativo creado correctamente.");

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/roles`
      );
    } catch (error) {
      console.error("Error creando rol:", error);
      alert("Error creando rol.");
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
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header style={{ marginBottom: "12px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          aria-label="Volver a roles"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            border: "1px solid rgba(255,255,255,.07)",
            background: "rgba(255,255,255,.035)",
            color: "rgba(255,255,255,.62)",
            borderRadius: "999px",
            padding: "6px 10px 6px 7px",
            marginBottom: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "9px",
            fontWeight: 750,
          }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "rgba(249,115,22,.12)",
              color: "#f97316",
              fontSize: "17px",
              lineHeight: 1,
            }}
          >
            ‹
          </span>
          Volver
        </button>

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
            letterSpacing: "-.4px",
          }}
        >
          Nuevo rol operativo
        </h1>

        <p
          style={{
            margin: "4px 0 0",
            color: "rgba(255,255,255,.38)",
            fontSize: "10px",
            lineHeight: 1.45,
          }}
        >
          Crea un rol para organizar el equipo del restaurante.
        </p>
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
            padding: "11px 12px",
            borderBottom: "1px solid rgba(255,255,255,.045)",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: "9px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".8px",
            }}
          >
            Datos del rol
          </span>
        </div>

        <div style={{ padding: "12px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Nombre del rol</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Cajero"
              autoComplete="off"
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Código interno</label>

            <input
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                )
              }
              placeholder="Ej. cashier"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              style={{
                ...inputStyle,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
            />

            <p
              style={{
                margin: "5px 0 0",
                color: "rgba(255,255,255,.25)",
                fontSize: "8px",
                lineHeight: 1.4,
              }}
            >
              Código corto y único. Ej.: cashier, kitchen o waiter.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "9px 10px",
              borderRadius: "8px",
              background: "rgba(249,115,22,.045)",
              border: "1px solid rgba(249,115,22,.10)",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
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
              }}
            >
              i
            </span>

            <div
              style={{
                color: "rgba(255,255,255,.38)",
                fontSize: "8px",
                lineHeight: 1.45,
              }}
            >
              Este rol será operativo. Sus permisos de módulos se
              administran posteriormente desde Permisos.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingTop: "11px",
              borderTop: "1px solid rgba(255,255,255,.045)",
            }}
          >
            <button
              type="button"
              onClick={createRole}
              disabled={loading}
              style={{
                flex: 1,
                minHeight: "38px",
                border: "none",
                borderRadius: "8px",
                background: loading ? "rgba(249,115,22,.3)" : "#f97316",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "10px",
                fontWeight: 800,
              }}
            >
              {loading ? "Creando..." : "Crear rol"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              style={{
                minHeight: "38px",
                padding: "0 12px",
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
        input:focus {
          border-color: rgba(249, 115, 22, 0.45) !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.07);
        }

        button {
          -webkit-tap-highlight-color: transparent;
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