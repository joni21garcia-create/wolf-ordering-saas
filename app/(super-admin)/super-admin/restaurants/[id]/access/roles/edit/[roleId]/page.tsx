"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId =
    params.id as string;

  const roleId =
    params.roleId as string;

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const { data, error } =
      await supabase
        .from("restaurant_roles")
        .select("*")
        .eq("id", roleId)
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setName(data.name || "");
    setCode(data.code || "");
  }

  async function saveRole() {
    try {
      setLoading(true);

      if (!name) {
        alert(
          "Ingrese un nombre"
        );
        return;
      }

      if (!code) {
        alert(
          "Ingrese un código"
        );
        return;
      }

      const { error } =
        await supabase
          .from("restaurant_roles")
          .update({
            name,
            code,
          })
          .eq("id", roleId);

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Rol actualizado"
      );

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/roles`
      );
    } catch (error) {
      console.error(error);
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
        Roles / Editar
      </p>

      <h1
        style={{
          fontSize: "52px",
          marginBottom:
            "30px",
        }}
      >
        🛡️ Editar Rol
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
            marginBottom:
              "20px",
          }}
        >
          <label>
            Nombre
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom:
              "30px",
          }}
        >
          <label>
            Código
          </label>

          <input
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <button
          onClick={saveRole}
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

            fontWeight:
              "700",

            cursor:
              "pointer",
          }}
        >
          {loading
            ? "Guardando..."
            : "Guardar Cambios"}
        </button>

        <button
          onClick={() =>
            router.back()
          }
          style={{
            marginLeft:
              "10px",

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