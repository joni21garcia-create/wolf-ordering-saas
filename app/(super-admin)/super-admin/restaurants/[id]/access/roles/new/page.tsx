"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewRolePage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId =
    params.id as string;

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function createRole() {
    try {
      if (!name) {
        alert(
          "Ingrese nombre del rol"
        );
        return;
      }

      if (!code) {
        alert(
          "Ingrese código"
        );
        return;
      }

      setLoading(true);

      const { data: existing } =
        await supabase
          .from("restaurant_roles")
          .select("id")
          .eq(
            "restaurant_id",
            restaurantId
          )
          .eq("code", code)
          .maybeSingle();

      if (existing) {
        alert(
          "Ese código ya existe"
        );
        return;
      }

      const { data, error } =
        await supabase
          .from("restaurant_roles")
          .insert({
            restaurant_id:
              restaurantId,

            name,

            code:
              code.toLowerCase(),
          })
          .select()
          .single();

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Rol creado correctamente"
      );

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/roles`
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error creando rol"
      );
    } finally {
      setLoading(false);
    }
  }
    return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <p
        style={{
          color: "#666",
        }}
      >
        Acceso / Roles / Nuevo
      </p>

      <h1
        style={{
          fontSize: "52px",
          marginBottom: "30px",
        }}
      >
        🛡️ Nuevo Rol
      </h1>

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",

          border:
            "1px solid rgba(255,255,255,.08)",

          borderRadius:
            "24px",

          padding: "30px",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label>
            Nombre del Rol
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Ej: Cajero"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <label>
            Código Interno
          </label>

          <input
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            placeholder="Ej: cashier"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={createRole}
            disabled={loading}
            style={{
              background:
                "#f97316",

              color: "#fff",

              border: "none",

              padding:
                "14px 24px",

              borderRadius:
                "12px",

              cursor:
                "pointer",

              fontWeight:
                "700",
            }}
          >
            {loading
              ? "Guardando..."
              : "Crear Rol"}
          </button>

          <button
            onClick={() =>
              router.back()
            }
            style={{
              background:
                "#333",

              color: "#fff",

              border: "none",

              padding:
                "14px 24px",

              borderRadius:
                "12px",

              cursor:
                "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  background: "#111",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: "12px",
};