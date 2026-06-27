"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";


export default function RolesPage() {
  const params = useParams();

const restaurantId = params.id as string;

const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
  loadRoles();
}, [restaurantId]);

async function loadRoles() {
  const { data, error } = await supabase
    .from("restaurant_roles")
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error(error);
    return;
  }

  const rolesWithStats = await Promise.all(
    (data || []).map(async (role) => {

      const { count: usersCount } =
        await supabase
          .from("restaurant_users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("restaurant_id", restaurantId)
          .eq("role_id", role.id);

      const { count: permissionsCount } =
        await supabase
          .from("role_modules")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("role_id", role.id)
          .eq("can_view", true);

      return {
        ...role,
        users: usersCount || 0,
        permissions:
          permissionsCount || 0,
      };
    })
  );
console.log(roles);
  setRoles(rolesWithStats);
}

const roleConfig = {
  superadmin: {
    icon: "👑",
    color: "#f97316",
    description:
      "Control total de Wolf Ordering.",
  },

  owner: {
    icon: "🏆",
    color: "#eab308",
    description:
      "Propietario del restaurante.",
  },

  manager: {
    icon: "🛡️",
    color: "#3b82f6",
    description:
      "Gestiona la operación diaria.",
  },

  marketing: {
    icon: "📢",
    color: "#a855f7",
    description:
      "Gestiona campañas y contenido.",
  },
};

const formattedRoles =
  roles.map((role) => {
    const roleKey = String(role.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "") as keyof typeof roleConfig;

    return {
      ...role,
      icon:
        roleConfig[roleKey]?.icon || "🛡️",
      color:
        roleConfig[roleKey]?.color || "#3b82f6",
      description:
        roleConfig[roleKey]?.description ||
        "Rol personalizado",
    };
  });

const totalUsers =
  formattedRoles.reduce(
    (acc, role) => acc + role.users,
    0
  );

const totalPermissions =
  formattedRoles.reduce(
    (acc, role) =>
      acc + role.permissions,
    0
  );

return (
  <PermissionGuard
    permission="roles"
  >
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <p
            style={{
              color: "#666",
            }}
          >
            Acceso / Roles
          </p>

          <h1
            style={{
              fontSize: "52px",
              margin: 0,
            }}
          >
            🛡️ Roles y Cargos
          </h1>

          <p
            style={{
              color: "#888",
              marginTop: "10px",
              maxWidth: "700px",
            }}
          >
            Define qué puede ver y
            administrar cada usuario
            dentro del restaurante.
          </p>
        </div>

        <Link
  href={`/super-admin/restaurants/${restaurantId}/access/roles/new`}
          style={{
            background:
              "#f97316",
            color: "#fff",
            padding:
              "14px 24px",
            borderRadius:
              "14px",
            textDecoration:
              "none",
            fontWeight: "700",
          }}
        >
          + Nuevo Rol
        </Link>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
<StatCard
  title="Roles"
  value={String(roles.length)}
/>

<StatCard
  title="Usuarios"
  value={String(totalUsers)}
/>

<StatCard
  title="Permisos"
  value={String(totalPermissions)}
/>
<StatCard
  title="Activos"
  value={String(roles.length)}
/>
      </div>

      {/* ROLES GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: "25px",
        }}
      >
        {formattedRoles.map((role) => (

            
  <div
    key={role.id}
    style={{
      background:
        "rgba(17,17,17,.95)",

      border:
        "1px solid rgba(255,255,255,.08)",

      borderRadius:
        "28px",

      padding: "28px",

      backdropFilter:
        "blur(20px)",

      position:
        "relative",

      overflow:
        "hidden",
    }}
  >
    <div
      style={{
        position:
          "absolute",

        width: "200px",

        height: "200px",

        borderRadius:
          "50%",

background: role.color,

        filter:
          "blur(100px)",

        opacity: 0.12,

        top: "-80px",

        right: "-80px",
      }}
    />

    <div
      style={{
        position:
          "relative",
        zIndex: 2,
      }}
    >
      <div
        style={{
          fontSize: "50px",
          marginBottom:
            "15px",
        }}
      >
{role.icon}
      </div>

      <h2
        style={{
          margin: 0,
          color: "#fff",
          fontSize: "30px",
        }}
      >
        {role.name}
      </h2>

      <p
        style={{
          color: "#999",
          lineHeight: 1.7,
          marginTop: "10px",
          marginBottom:
            "25px",
        }}
      >
{role.description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "15px",
          marginBottom:
            "25px",
        }}
      >
        <div
          style={{
            background:
              "rgba(255,255,255,.03)",
            border:
              "1px solid rgba(255,255,255,.06)",
            borderRadius:
              "16px",
            padding: "15px",
          }}
        >
          <div
            style={{
              color: "#777",
              fontSize:
                "13px",
            }}
          >
            Usuarios
          </div>

          <div
            style={{
              fontSize:
                "28px",
              fontWeight:
                "800",
            }}
          >
            {role.users}
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,.03)",
            border:
              "1px solid rgba(255,255,255,.06)",
            borderRadius:
              "16px",
            padding: "15px",
          }}
        >
          <div
            style={{
              color: "#777",
              fontSize:
                "13px",
            }}
          >
            Permisos
          </div>

          <div
            style={{
              fontSize:
                "28px",
              fontWeight:
                "800",
            }}
          >
            {role.permissions}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap:
            "wrap",
        }}
      >
        <Link
  href={`/super-admin/restaurants/${restaurantId}/access/roles/edit/${role.id}`}
  style={{
    background: role.color,
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
  }}
>
  ✏️ Editar Rol
</Link>

        <Link
  href={`/super-admin/restaurants/${restaurantId}/access/permissions?role=${role.id}`}
  style={{
    background:
      "rgba(255,255,255,.05)",
    border:
      "1px solid rgba(255,255,255,.08)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "12px",
    fontWeight: "700",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  }}
>
  🔐 Permisos
</Link>
      </div>
    </div>
  </div>
))}
</div>

{/* INFO PANEL */}

<div
  style={{
    marginTop: "40px",
    background:
      "rgba(17,17,17,.95)",

    border:
      "1px solid rgba(255,255,255,.08)",

    borderRadius:
      "24px",

    padding: "25px",
  }}
>
  <h3
    style={{
      marginTop: 0,
      color: "#fff",
    }}
  >
    Arquitectura Wolf Roles
  </h3>

  <p
    style={{
      color: "#888",
      lineHeight: 1.8,
    }}
  >
    Los usuarios heredan permisos
    desde su rol asignado.
    Un cambio realizado en un rol
    impacta automáticamente a todos
    los usuarios asociados a ese
    cargo.
  </p>
</div>

      </div>
    </PermissionGuard>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(17,17,17,.95)",

        border:
          "1px solid rgba(255,255,255,.08)",

        borderRadius:
          "24px",

        padding: "24px",
      }}
    >
      <div
        style={{
          color: "#888",
          marginBottom:
            "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:
            "42px",

          fontWeight:
            "800",

          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}