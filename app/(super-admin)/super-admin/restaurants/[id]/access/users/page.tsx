"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

type RestaurantUser = {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  active: boolean;
  role_id?: string | null;
  restaurant_roles?: {
    id: string;
    name: string;
    code: string;
  } | null;
};

export default function UsersPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [users, setUsers] = useState<RestaurantUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadUsers();
    }
  }, [restaurantId]);

  async function loadUsers() {
    setLoading(true);

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
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando usuarios:", error);
      setLoading(false);
      return;
    }

    setUsers((data || []) as RestaurantUser[]);
    setLoading(false);
  }

  async function toggleUser(user: RestaurantUser) {
    const action = user.active ? "desactivar" : "activar";

    const confirmed = window.confirm(
      `¿Quieres ${action} a ${user.full_name || user.email}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("restaurant_users")
      .update({ active: !user.active })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadUsers();
  }

  const activeUsers = users.filter((user) => user.active).length;
  const inactiveUsers = users.length - activeUsers;

  return (
    <PermissionGuard permission="users">
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px 20px 60px",
          color: "#fff",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "20px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          <div>
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
                letterSpacing: "-0.4px",
              }}
            >
              Usuarios
            </h1>

            <p
              style={{
                margin: "7px 0 0",
                color: "rgba(255,255,255,.45)",
                fontSize: "13px",
              }}
            >
              Personas con acceso a este restaurante.
            </p>
          </div>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/users/new`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "#f97316",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 750,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "16px" }}>+</span>
            Nuevo usuario
          </Link>
        </header>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "7px",
            borderBottom: "1px solid rgba(255,255,255,.07)",
            paddingBottom: "11px",
            marginBottom: "16px",
          }}
        >
          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/users`}
            style={{
              textDecoration: "none",
              color: "#fff",
              background: "rgba(249,115,22,.14)",
              border: "1px solid rgba(249,115,22,.28)",
              borderRadius: "9px",
              padding: "8px 13px",
              fontSize: "12px",
              fontWeight: 750,
            }}
          >
            Usuarios
          </Link>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/roles`}
            style={{
              textDecoration: "none",
              color: "rgba(255,255,255,.52)",
              background: "rgba(255,255,255,.035)",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: "9px",
              padding: "8px 13px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Roles operativos
          </Link>
        </div>

        {/* RESUMEN MINIMALISTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "15px",
            color: "rgba(255,255,255,.42)",
            fontSize: "12px",
          }}
        >
          <span>
            <strong style={{ color: "#fff" }}>{users.length}</strong>{" "}
            usuarios
          </span>

          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />

          <span>{activeUsers} activos</span>

          {inactiveUsers > 0 && (
            <>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#facc15",
                }}
              />

              <span>{inactiveUsers} inactivos</span>
            </>
          )}
        </div>

        {/* LISTA */}
        <section
          style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "rgba(255,255,255,.4)",
                fontSize: "13px",
              }}
            >
              Cargando usuarios...
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: "45px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  marginBottom: "10px",
                  opacity: 0.7,
                }}
              >
                👤
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "5px",
                }}
              >
                No hay usuarios
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.4)",
                  fontSize: "12px",
                }}
              >
                Agrega el primer usuario del restaurante.
              </div>
            </div>
          ) : (
            users.map((user, index) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                  padding: "15px 16px",
                  borderBottom:
                    index === users.length - 1
                      ? "none"
                      : "1px solid rgba(255,255,255,.055)",
                }}
              >
                {/* USUARIO */}
                <div
                  style={{
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {/* AVATAR */}
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      minWidth: "36px",
                      borderRadius: "10px",
                      background: user.active
                        ? "rgba(249,115,22,.12)"
                        : "rgba(255,255,255,.045)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: user.active
                        ? "#f97316"
                        : "rgba(255,255,255,.35)",
                      fontSize: "14px",
                      fontWeight: 800,
                    }}
                  >
                    {(user.full_name || user.email || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 750,
                          color: "#fff",
                        }}
                      >
                        {user.full_name || user.email}
                      </span>

                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: user.active
                            ? "#22c55e"
                            : "#6b7280",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "3px",
                        color: "rgba(255,255,255,.38)",
                        fontSize: "11px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "420px",
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* ROL */}
                <div
                  style={{
                    minWidth: "110px",
                    color: "#f97316",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {user.restaurant_roles?.name || "Sin rol"}
                </div>

                {/* ESTADO */}
                <div
                  style={{
                    minWidth: "65px",
                    color: user.active
                      ? "#22c55e"
                      : "rgba(255,255,255,.35)",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {user.active ? "Activo" : "Inactivo"}
                </div>

                {/* ACCIONES */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Link
                    href={`/super-admin/restaurants/${restaurantId}/access/users/edit/${user.id}`}
                    style={{
                      textDecoration: "none",
                      color: "rgba(255,255,255,.62)",
                      background: "rgba(255,255,255,.045)",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: "8px",
                      padding: "7px 9px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => toggleUser(user)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: user.active
                        ? "rgba(255,255,255,.3)"
                        : "#22c55e",
                      padding: "7px 5px",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {user.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </PermissionGuard>
  );
}