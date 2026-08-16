"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
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
          width: "100%",
          maxWidth: "760px",
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
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <button
              type="button"
              onClick={() => router.back()}
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
                cursor: "pointer",
                fontSize: "9px",
                fontWeight: 750,
              }}
              aria-label="Volver"
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
            <h1 style={{ margin: 0, fontSize: "22px", lineHeight: 1.1, fontWeight: 800 }}>
              Usuarios
            </h1>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,.38)", fontSize: "10px" }}>
              Accesos del restaurante.
            </p>
          </div>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/users/new`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              flexShrink: 0,
              background: "#f97316",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "10px",
              fontWeight: 800,
            }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span>
            Nuevo
          </Link>
        </header>

        <div
          style={{
            display: "flex",
            gap: "5px",
            overflowX: "auto",
            paddingBottom: "2px",
            marginBottom: "10px",
            scrollbarWidth: "none",
          }}
        >
          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/users`}
            style={{
              flexShrink: 0,
              textDecoration: "none",
              color: "#fff",
              background: "rgba(249,115,22,.12)",
              border: "1px solid rgba(249,115,22,.24)",
              borderRadius: "7px",
              padding: "6px 9px",
              fontSize: "9px",
              fontWeight: 800,
            }}
          >
            Usuarios
          </Link>
          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/roles`}
            style={{
              flexShrink: 0,
              textDecoration: "none",
              color: "rgba(255,255,255,.5)",
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(255,255,255,.05)",
              borderRadius: "7px",
              padding: "6px 9px",
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Roles operativos
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            color: "rgba(255,255,255,.38)",
            fontSize: "9px",
          }}
        >
          <span><strong style={{ color: "#ddd", fontSize: "11px" }}>{users.length}</strong> usuarios</span>
          <span style={{ color: "#22c55e" }}>●</span>
          <span>{activeUsers} activos</span>
          {inactiveUsers > 0 && (
            <>
              <span style={{ color: "#facc15" }}>●</span>
              <span>{inactiveUsers} inactivos</span>
            </>
          )}
        </div>

        <section
          style={{
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: "11px",
            overflow: "hidden",
            background: "rgba(17,24,39,.72)",
          }}
        >
          {loading ? (
            <div style={{ padding: "30px 15px", textAlign: "center", color: "rgba(255,255,255,.4)", fontSize: "10px" }}>
              Cargando usuarios...
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: "35px 15px", textAlign: "center" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  margin: "0 auto 8px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "9px",
                  background: "rgba(255,255,255,.035)",
                  color: "#777",
                  fontSize: "15px",
                }}
              >
                👤
              </div>
              <div style={{ fontSize: "11px", fontWeight: 750, marginBottom: "3px" }}>
                No hay usuarios
              </div>
              <div style={{ color: "rgba(255,255,255,.35)", fontSize: "9px" }}>
                Agrega el primer usuario del restaurante.
              </div>
            </div>
          ) : (
            users.map((user, index) => (
              <article
                key={user.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) auto",
                  gap: "8px",
                  padding: "9px 10px",
                  borderBottom:
                    index === users.length - 1 ? "none" : "1px solid rgba(255,255,255,.045)",
                }}
              >
                <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "29px",
                      height: "29px",
                      minWidth: "29px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "8px",
                      background: user.active ? "rgba(249,115,22,.10)" : "rgba(255,255,255,.035)",
                      color: user.active ? "#f97316" : "#666",
                      fontSize: "11px",
                      fontWeight: 850,
                    }}
                  >
                    {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                      <span
                        style={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#ddd",
                          fontSize: "10px",
                          fontWeight: 750,
                        }}
                      >
                        {user.full_name || user.email}
                      </span>
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          flexShrink: 0,
                          borderRadius: "50%",
                          background: user.active ? "#22c55e" : "#6b7280",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "2px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "rgba(255,255,255,.34)",
                        fontSize: "8px",
                      }}
                    >
                      {user.email}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                      <span style={{ color: "#f97316", fontSize: "8px", fontWeight: 750 }}>
                        {user.restaurant_roles?.name || "Sin rol"}
                      </span>
                      <span style={{ color: user.active ? "#22c55e" : "#777", fontSize: "8px", fontWeight: 700 }}>
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px", alignSelf: "center" }}>
                  <Link
                    href={`/super-admin/restaurants/${restaurantId}/access/users/edit/${user.id}`}
                    aria-label={`Editar ${user.full_name || user.email}`}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "28px",
                      height: "28px",
                      boxSizing: "border-box",
                      textDecoration: "none",
                      color: "rgba(255,255,255,.58)",
                      background: "rgba(255,255,255,.035)",
                      border: "1px solid rgba(255,255,255,.055)",
                      borderRadius: "7px",
                      fontSize: "8px",
                      fontWeight: 750,
                    }}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleUser(user)}
                    aria-label={
                      user.active
                        ? `Desactivar ${user.full_name || user.email}`
                        : `Activar ${user.full_name || user.email}`
                    }
                    style={{
                      width: "28px",
                      height: "28px",
                      boxSizing: "border-box",
                      border: "1px solid rgba(255,255,255,.055)",
                      borderRadius: "7px",
                      background: "transparent",
                      color: user.active ? "#777" : "#22c55e",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {user.active ? "×" : "✓"}
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </PermissionGuard>
  );
}