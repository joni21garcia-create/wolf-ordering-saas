"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewRolePage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.id as string;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

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
        protectedNames.includes(cleanName.toLowerCase()) ||
        protectedCodes.includes(cleanCode)
      ) {
        alert(
          "Ese rol está reservado y no puede ser creado desde el restaurante."
        );
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
          Nuevo rol operativo
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "rgba(255,255,255,.45)",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Crea un rol para organizar el equipo del restaurante.
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
            placeholder="Ej. Cajero"
            style={inputStyle}
            disabled={loading}
          />
        </div>

        {/* CÃ“DIGO */}
        <div style={{ marginBottom: "18px" }}>
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
            style={inputStyle}
            disabled={loading}
          />

          <p
            style={{
              margin: "7px 0 0",
              color: "rgba(255,255,255,.3)",
              fontSize: "11px",
            }}
          >
            Usa un código corto y único, por ejemplo: cashier,
            kitchen o waiter.
          </p>
        </div>

        {/* INFORMACIÃ“N */}
        <div
          style={{
            padding: "12px 13px",
            borderRadius: "10px",
            background: "rgba(249,115,22,.06)",
            border: "1px solid rgba(249,115,22,.12)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,.62)",
              fontSize: "11px",
              lineHeight: 1.55,
            }}
          >
            Este rol será operativo. Los permisos de los módulos
            son administrados por Wolf.
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
            onClick={createRole}
            disabled={loading}
            style={{
              flex: 1,
              background: loading
                ? "rgba(249,115,22,.4)"
                : "#f97316",
              color: "#fff",
              border: "none",
              padding: "11px 15px",
              borderRadius: "10px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "13px",
              fontWeight: 750,
            }}
          >
            {loading ? "Creando..." : "Crear rol"}
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
              cursor: loading
                ? "not-allowed"
                : "pointer",
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
