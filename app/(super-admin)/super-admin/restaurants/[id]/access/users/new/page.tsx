"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  name: string;
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

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    const { data } = await supabase
      .from("restaurant_roles")
      .select("id,name")
      .eq("restaurant_id", restaurantId)
      .order("name");

    if (data) {
      setRoles(data);

      if (data.length > 0) {
        setRoleId(data[0].id);
      }
    }
  }

  async function createUser() {
    try {
      setLoading(true);

      if (!email) {
  alert("Ingrese un email");
  return;
}

if (!password) {
  alert("Ingrese una contraseña");
  return;
}

if (!roleId) {
  alert("Seleccione un rol");
  return;
}

if (!fullName) {
  alert("Ingrese el nombre");
  return;
}

if (!phone) {
  alert("Ingrese el teléfono");
  return;
}


const { data: existing } =
  await supabase
    .from("restaurant_users")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .eq("email", email)
    .maybeSingle();

if (existing) {
  alert(
    "Ese correo ya existe"
  );
  return;
}

const { data, error } =
  await supabase.functions.invoke(
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

      alert("Usuario creado");

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
        Acceso / Usuarios / Nuevo
      </p>

      <h1
        style={{
          fontSize: "52px",
          marginBottom: "30px",
        }}
      >
        👤 Nuevo Usuario
      </h1>

      <div
        style={{
          background: "rgba(17,17,17,.95)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "30px",
        }}
      >

<div style={{ marginBottom: "20px" }}>
  <label>Nombre Completo</label>

  <input
    value={fullName}
    onChange={(e) =>
      setFullName(e.target.value)
    }
    style={inputStyle}
  />
</div>

        <div style={{ marginBottom: "20px" }}>
          <label>Email</label>

          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />
        </div>


<div style={{ marginBottom: "20px" }}>
  <label>Teléfono</label>

  <input
    value={phone}
    onChange={(e) =>
      setPhone(e.target.value)
    }
    style={inputStyle}
  />
</div>

        <div style={{ marginBottom: "20px" }}>
          <label>Contraseña</label>

<input
  type="password"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
  style={inputStyle}
/>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label>Rol</label>

          <select
            value={roleId}
            onChange={(e) =>
              setRoleId(e.target.value)
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

        <button
          onClick={createUser}
          disabled={loading}
          style={{
            background: "#f97316",
            color: "#fff",
            border: "none",
            padding: "14px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          {loading
            ? "Guardando..."
            : "Crear Usuario"}
        </button>

<button
  onClick={() =>
    router.back()
  }
  style={{
    marginLeft: "10px",
    background: "#333",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
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