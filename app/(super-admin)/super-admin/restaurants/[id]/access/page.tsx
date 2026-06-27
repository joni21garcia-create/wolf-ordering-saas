"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AccessPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const modules = [
    {
      title: "Usuarios",
      description:
        "Gestiona las cuentas que pueden acceder al restaurante.",
      icon: "👥",
      href: `/super-admin/restaurants/${restaurantId}/access/users`,
      color: "#3b82f6",
    },

    {
      title: "Roles",
      description:
        "Define cargos, niveles y responsabilidades.",
      icon: "🛡️",
      href: `/super-admin/restaurants/${restaurantId}/access/roles`,
      color: "#f97316",
    },

    {
      title: "Permisos",
      description:
        "Controla qué módulos puede visualizar cada rol.",
      icon: "🔐",
      href: `/super-admin/restaurants/${restaurantId}/access/permissions`,
      color: "#10b981",
    },
  ];

  return (
    <main
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            color: "#666",
            marginBottom: "10px",
          }}
        >
          Wolf Ordering /
          Seguridad /
          Accesos
        </p>

        <h1
          style={{
            fontSize: "54px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          🛡️ Acceso y Seguridad
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "15px",
            maxWidth: "700px",
            lineHeight: 1.8,
          }}
        >
          Administra usuarios,
          roles y permisos del
          restaurante desde un
          único lugar.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px",
        }}
      >
        {modules.map(
          (module) => (
            <Link
              key={module.title}
              href={module.href}
              style={{
                textDecoration:
                  "none",
              }}
            >
              <div
                style={{
                  background:
                    "rgba(17,17,17,.95)",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius:
                    "28px",
                  padding: "30px",
                  backdropFilter:
                    "blur(20px)",
                  height: "100%",
                  transition:
                    ".25s",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "58px",
                    marginBottom:
                      "20px",
                  }}
                >
                  {module.icon}
                </div>

                <h2
                  style={{
                    color:
                      "#fff",
                    marginBottom:
                      "10px",
                  }}
                >
                  {module.title}
                </h2>

                <p
                  style={{
                    color:
                      "#888",
                    lineHeight:
                      1.7,
                    marginBottom:
                      "25px",
                  }}
                >
                  {
                    module.description
                  }
                </p>

                <div
                  style={{
                    color:
                      module.color,
                    fontWeight:
                      "700",
                  }}
                >
                  Abrir módulo →
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      <div
        style={{
          marginTop: "40px",
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "25px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Seguridad Wolf
        </h3>

        <p
          style={{
            color: "#888",
            lineHeight: 1.8,
          }}
        >
          Los permisos se aplican
          por rol. Los usuarios
          heredan automáticamente
          los accesos asignados
          a su cargo.
        </p>
      </div>
    </main>
  );
}