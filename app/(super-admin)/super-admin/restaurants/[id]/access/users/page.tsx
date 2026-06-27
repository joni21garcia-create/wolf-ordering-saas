"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function UsersPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

    const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
  loadUsers();
}, [restaurantId]);

async function loadUsers() {
  const { data, error } = await supabase
    .from("restaurant_users")
    .select(`
      *,
      restaurant_roles (
        id,
        name,
        code
      )
    `)
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error(error);
    return;
  }

  setUsers(data || []);
}


async function toggleUser(
  user: any
) {
  const confirmAction =
    confirm(
      user.active
        ? "¿Desactivar usuario?"
        : "¿Activar usuario?"
    );

  if (!confirmAction) return;

  const { error } =
    await supabase
      .from("restaurant_users")
      .update({
        active: !user.active,
      })
      .eq("id", user.id);

  if (error) {
    alert(error.message);
    return;
  }

  loadUsers();
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
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "42px",
          fontWeight: "800",
          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

return (
  <PermissionGuard permission="users">
    <main
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
            Acceso / Usuarios
          </p>

          <h1
            style={{
              fontSize: "52px",
              margin: 0,
            }}
          >
            👥 Usuarios
          </h1>
        </div>

        <Link
          href={`/super-admin/restaurants/${restaurantId}/access/users/new`}
          style={{
            background: "#f97316",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          + Nuevo Usuario
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
          title="Usuarios"
          value={String(users.length)}
        />

        <StatCard
          title="Activos"
          value={String(
            users.filter(
              (u) => u.active
            ).length
          )}
        />

        <StatCard
          title="Pendientes"
          value="0"
        />

        <StatCard
          title="Suspendidos"
          value={String(
            users.filter(
              (u) => !u.active
            ).length
          )}
        />
      </div>

      {/* USERS */}

      <div
        style={{
          display: "flex",
          flexDirection:
            "column",
          gap: "20px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              background:
                "rgba(17,17,17,.95)",

              border:
                "1px solid rgba(255,255,255,.08)",

              borderRadius:
                "24px",

              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  {user.email}
                </h2>

                <p
                  style={{
                    color:
                      "#888",
                  }}
                >
                  {user.email}
                </p>

                <p
                  style={{
                    color:
                      "#f97316",
                    fontWeight:
                      "700",
                  }}
                >
                  {user.restaurant_roles?.name}
                </p>
              </div>

              <div>
                <span
                  style={{
                    background:
                      user.active
                        ? "rgba(34,197,94,.15)"
                        : "rgba(250,204,21,.15)",

                    color:
                      user.active
                        ? "#22c55e"
                        : "#facc15",

                    padding:
                      "8px 14px",

                    borderRadius:
                      "999px",

                    fontWeight:
                      "700",
                  }}
                >
                  {user.active
                    ? "Activo"
                    : "Inactivo"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <Link
                href={`/super-admin/restaurants/${restaurantId}/access/users/edit/${user.id}`}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                ✏️ Editar
              </Link>

              <button
                onClick={() =>
                  toggleUser(user)
                }
                style={{
                  background: user.active
                    ? "#dc2626"
                    : "#16a34a",

                  border: "none",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {user.active
                  ? "🚫 Desactivar"
                  : "✅ Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  </PermissionGuard>
);
}