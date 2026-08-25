"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useSession } from "@/providers/SessionProvider";

type Role = {
  id: string;
  name: string;
  code?: string | null;
  users: number;
};

export default function RolesPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, loading: sessionLoading } = useSession();
  const restaurantId = params.id as string;

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin =
    currentUser?.role?.code?.trim().toLowerCase() === "super-user";

  useEffect(() => {
    if (!sessionLoading && restaurantId) {
      loadRoles();
    }
  }, [restaurantId, sessionLoading]);

  async function loadRoles() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("restaurant_roles")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("name");

      if (error) {
        console.error("Error cargando roles:", error);
        setLoading(false);
        return;
      }

      /*
       * Roles protegidos de Wolf.
       *
       * No se muestran dentro de la administración
       * operativa del restaurante.
       */
      const operationalRoles = isSuperAdmin
        ? (data || [])
        : (data || []).filter((role) => {
            const code = String(role.code || "")
              .trim()
              .toLowerCase();

            const protectedCodes = [
              "super-user",
              "owner",
              "manager",
            ];

            return !protectedCodes.includes(code);
          });

      const rolesWithUsers = await Promise.all(
        operationalRoles.map(async (role) => {
          const { count } = await supabase
            .from("restaurant_users")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq("restaurant_id", restaurantId)
            .eq("role_id", role.id);

          return {
            ...role,
            users: count || 0,
          };
        })
      );

      setRoles(rolesWithUsers);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PermissionGuard permission="roles">
      <main
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
          padding: "16px 12px 42px",
          color: "#fff",
          boxSizing: "border-box",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <header
          className="roles-header"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
            flexWrap: "wrap",
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
                letterSpacing: "-0.4px",
              }}
            >
              Roles operativos
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                color: "rgba(255,255,255,.38)",
                fontSize: "10px",
              }}
            >
              Roles utilizados por el equipo del restaurante.
            </p>
          </div>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/roles/new`}
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
            Nuevo rol
          </Link>
        </header>

        <nav
          aria-label="Acceso"
          style={{
            display: "flex",
            gap: "5px",
            overflowX: "auto",
            marginBottom: "9px",
            paddingBottom: "1px",
          }}
        >
          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/users`}
            style={{
              flexShrink: 0,
              textDecoration: "none",
              color: "rgba(255,255,255,.48)",
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(255,255,255,.05)",
              borderRadius: "7px",
              padding: "6px 9px",
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Usuarios
          </Link>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/roles`}
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
            Roles operativos
          </Link>
        </nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "8px",
            color: "rgba(255,255,255,.34)",
            fontSize: "9px",
          }}
        >
          <strong style={{ color: "#ddd", fontSize: "11px" }}>
            {roles.length}
          </strong>
          <span>roles</span>
          <span style={{ color: "#f97316" }}>●</span>
          <span>{roles.reduce((total, role) => total + role.users, 0)} usuarios asignados</span>
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
            <div
              style={{
                padding: "30px 15px",
                textAlign: "center",
                color: "rgba(255,255,255,.4)",
                fontSize: "10px",
              }}
            >
              Cargando roles...
            </div>
          ) : roles.length === 0 ? (
            <div
              style={{
                padding: "35px 15px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  margin: "0 auto 8px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "9px",
                  background: "rgba(249,115,22,.07)",
                  color: "#f97316",
                  fontSize: "15px",
                }}
              >
                🛡
              </div>

              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 750,
                  marginBottom: "3px",
                }}
              >
                No hay roles operativos
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.35)",
                  fontSize: "9px",
                }}
              >
                Crea el primer rol operativo del restaurante.
              </div>
            </div>
          ) : (
            roles.map((role, index) => (
              <article
                key={role.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) auto",
                  gap: "8px",
                  padding: "9px 10px",
                  borderBottom:
                    index === roles.length - 1
                      ? "none"
                      : "1px solid rgba(255,255,255,.045)",
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "29px",
                      height: "29px",
                      minWidth: "29px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "8px",
                      background: "rgba(249,115,22,.09)",
                      color: "#f97316",
                      fontSize: "12px",
                    }}
                  >
                    🛡
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#ddd",
                        fontSize: "10px",
                        fontWeight: 750,
                      }}
                    >
                      {role.name}
                    </div>

                    {role.code && (
                      <div
                        style={{
                          marginTop: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "rgba(255,255,255,.27)",
                          fontSize: "8px",
                        }}
                      >
                        {role.code}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "3px",
                        color: "rgba(255,255,255,.36)",
                        fontSize: "8px",
                      }}
                    >
                      <strong style={{ color: "#f97316" }}>{role.users}</strong>{" "}
                      {role.users === 1 ? "usuario" : "usuarios"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/super-admin/restaurants/${restaurantId}/access/roles/edit/${role.id}`}
                  aria-label={`Editar ${role.name}`}
                  style={{
                    alignSelf: "center",
                    display: "grid",
                    placeItems: "center",
                    minWidth: "42px",
                    height: "28px",
                    boxSizing: "border-box",
                    padding: "0 8px",
                    textDecoration: "none",
                    color: "rgba(255,255,255,.58)",
                    background: "rgba(255,255,255,.035)",
                    border: "1px solid rgba(255,255,255,.055)",
                    borderRadius: "7px",
                    fontSize: "8px",
                    fontWeight: 750,
                  }}
                >
                  Editar
                </Link>
              </article>
            ))
          )}
        </section>

        <div
          style={{
            marginTop: "9px",
            color: "rgba(255,255,255,.25)",
            fontSize: "8px",
            lineHeight: 1.5,
          }}
        >
          Los permisos de cada rol se administran desde la sección de permisos.
          Los restaurantes trabajan únicamente con roles operativos.
        </div>

        <style jsx>{`
          @media (max-width: 430px) {
            .roles-header {
              align-items: flex-start !important;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}