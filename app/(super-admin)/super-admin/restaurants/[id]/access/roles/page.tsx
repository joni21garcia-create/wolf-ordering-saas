"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

type Role = {
  id: string;
  name: string;
  code?: string | null;
  users: number;
};

export default function RolesPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadRoles();
    }
  }, [restaurantId]);

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
      const operationalRoles = (data || []).filter((role) => {
        const name = String(role.name || "")
          .trim()
          .toLowerCase();

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
              }}
            >
              Roles operativos
            </h1>

            <p
              style={{
                margin: "7px 0 0",
                color: "rgba(255,255,255,.45)",
                fontSize: "13px",
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
            Nuevo rol
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
              color: "rgba(255,255,255,.52)",
              background: "rgba(255,255,255,.035)",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: "9px",
              padding: "8px 13px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Usuarios
          </Link>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/access/roles`}
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
            Roles operativos
          </Link>
        </div>

        {/* RESUMEN */}
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
            <strong style={{ color: "#fff" }}>
              {roles.length}
            </strong>{" "}
            roles
          </span>

          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#f97316",
            }}
          />

          <span>
            {roles.reduce((total, role) => total + role.users, 0)}{" "}
            usuarios asignados
          </span>
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
              Cargando roles...
            </div>
          ) : roles.length === 0 ? (
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
                {"\uD83D\uDEE1"}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "5px",
                }}
              >
                No hay roles operativos
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.4)",
                  fontSize: "12px",
                }}
              >
                Crea el primer rol operativo del restaurante.
              </div>
            </div>
          ) : (
            roles.map((role, index) => {

              return (
                <div
                  key={role.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    padding: "15px 16px",
                    borderBottom:
                      index === roles.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,.055)",
                  }}
                >
                  {/* ICONO + NOMBRE */}
                  <div
                    style={{
                      minWidth: 0,
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        minWidth: "36px",
                        borderRadius: "10px",
                        background: "rgba(249,115,22,.11)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                      }}
                    >
                      {"\uD83D\uDEE1"}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 750,
                          color: "#fff",
                        }}
                      >
                        {role.name}
                      </div>

                      {role.code && (
                        <div
                          style={{
                            marginTop: "3px",
                            color: "rgba(255,255,255,.32)",
                            fontSize: "10px",
                          }}
                        >
                          {role.code}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* USUARIOS */}
                  <div
                    style={{
                      minWidth: "90px",
                      color: "rgba(255,255,255,.48)",
                      fontSize: "11px",
                    }}
                  >
                    <strong
                      style={{
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      {role.users}
                    </strong>{" "}
                    {role.users === 1 ? "usuario" : "usuarios"}
                  </div>
                  {/* EDITAR */}
                  <Link
                    href={`/super-admin/restaurants/${restaurantId}/access/roles/edit/${role.id}`}
                    style={{
                      textDecoration: "none",
                      color: "rgba(255,255,255,.62)",
                      background: "rgba(255,255,255,.045)",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: "8px",
                      padding: "7px 10px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    Editar
                  </Link>
                </div>
              );
            })
          )}
        </section>

        {/* NOTA */}
        <div
          style={{
            marginTop: "14px",
            color: "rgba(255,255,255,.3)",
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          Los permisos de los roles son administrados desde Wolf.
          El restaurante trabaja únicamente con roles operativos.
        </div>
      </main>
    </PermissionGuard>
  );
}


