"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AccessPage() {
  const params = useParams();

  const restaurantId = params.id as string;

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "28px 24px 60px",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            color: "#f97316",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Acceso
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          Usuarios
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "rgba(255,255,255,.48)",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          Administra el equipo y los roles operativos del restaurante.
        </p>
      </header>

      {/* NAVEGACIÓN */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "22px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          paddingBottom: "12px",
        }}
      >
        <Link
          href={`/super-admin/restaurants/${restaurantId}/access/users`}
          style={{
            textDecoration: "none",
            color: "#fff",
            background: "#f97316",
            borderRadius: "10px",
            padding: "9px 15px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          Usuarios
        </Link>

        <Link
          href={`/super-admin/restaurants/${restaurantId}/access/roles`}
          style={{
            textDecoration: "none",
            color: "rgba(255,255,255,.62)",
            background: "rgba(255,255,255,.045)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: "10px",
            padding: "9px 15px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          Roles operativos
        </Link>
      </div>

      {/* ACCESOS PRINCIPALES */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "12px",
        }}
      >
        {/* USUARIOS */}
        <Link
          href={`/super-admin/restaurants/${restaurantId}/access/users`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "16px",
              padding: "20px",
              transition: "transform .18s ease, border-color .18s ease",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: "rgba(249,115,22,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                marginBottom: "16px",
              }}
            >
              👤
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 750,
                  }}
                >
                  Usuarios
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "rgba(255,255,255,.45)",
                    fontSize: "13px",
                  }}
                >
                  Cuentas y acceso del equipo
                </p>
              </div>

              <span
                style={{
                  color: "#f97316",
                  fontSize: "18px",
                }}
              >
                →
              </span>
            </div>
          </div>
        </Link>

        {/* ROLES */}
        <Link
          href={`/super-admin/restaurants/${restaurantId}/access/roles`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "16px",
              padding: "20px",
              transition: "transform .18s ease, border-color .18s ease",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: "rgba(255,255,255,.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                marginBottom: "16px",
              }}
            >
              🛡
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 750,
                  }}
                >
                  Roles operativos
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "rgba(255,255,255,.45)",
                    fontSize: "13px",
                  }}
                >
                  Roles utilizados por el equipo
                </p>
              </div>

              <span
                style={{
                  color: "rgba(255,255,255,.45)",
                  fontSize: "18px",
                }}
              >
                →
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* INFORMACIÓN */}
      <div
        style={{
          marginTop: "18px",
          padding: "15px 16px",
          borderRadius: "13px",
          background: "rgba(255,255,255,.025)",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              opacity: 0.7,
            }}
          >
            ℹ
          </span>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,.42)",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            Los permisos y módulos del sistema son administrados desde
            Wolf. Los usuarios del restaurante trabajan únicamente con
            los roles operativos disponibles.
          </p>
        </div>
      </div>
    </main>
  );
}