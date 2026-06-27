"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
};

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId =
    params.id as string;

  const userId =
    params.userId as string;

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [email, setEmail] =
    useState("");

  const [roleId, setRoleId] =
    useState("");

  const [active, setActive] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadRoles();
    loadUser();
  }, []);

  async function loadRoles() {
    const { data } =
      await supabase
        .from("restaurant_roles")
        .select("id,name")
        .eq(
          "restaurant_id",
          restaurantId
        )
        .order("name");

    if (data) {
      setRoles(data);
    }
  }

  async function loadUser() {
    const { data, error } =
      await supabase
        .from("restaurant_users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setEmail(data.email);
    setRoleId(data.role_id);
    setActive(data.active);
  }
    async function saveUser() {
    if (!email) {
      alert("Ingrese email");
      return;
    }

    if (!roleId) {
      alert("Seleccione rol");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase
        .from("restaurant_users")
        .update({
          email,
          role_id: roleId,
          active,
        })
        .eq("id", userId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Usuario actualizado");

    router.push(
      `/super-admin/restaurants/${restaurantId}/access/users`
    );
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
        Usuarios / Editar
      </p>

      <h1
        style={{
          fontSize: "52px",
          marginBottom: "30px",
        }}
      >
        ✏️ Editar Usuario
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
          <label>Email</label>

          <input
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label>Rol</label>

          <select
            value={roleId}
            onChange={(e) =>
              setRoleId(
                e.target.value
              )
            }
            style={inputStyle}
          >
            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) =>
                setActive(
                  e.target.checked
                )
              }
            />

            {" "}Usuario activo
          </label>
        </div>

        <button
          onClick={saveUser}
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
            : "Guardar Cambios"}
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