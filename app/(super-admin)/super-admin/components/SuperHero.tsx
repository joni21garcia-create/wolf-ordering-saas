"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import SuperAdminBadges from "./SuperAdminBadges";

type Props = {
  user?: {
    full_name?: string;
    role?: {
      name?: string;
    };
  };

  stats: {
    restaurants: number;
    users: number;
    legal: number;
  };
};

export default function SuperHero({
  user,
  stats,
}: Props) {
  return (
    <section
      style={{
        position: "relative",

        overflow: "hidden",

        marginBottom: 70,

        borderRadius: 34,

        padding: "48px",

        background:
          "linear-gradient(180deg,#191919 0%,#0c0c0c 100%)",

        border:
          "1px solid rgba(255,255,255,.07)",

        boxShadow:
          "0 25px 70px rgba(0,0,0,.28)",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",

          top: -120,

          right: -120,

          width: 320,

          height: 320,

          borderRadius: "50%",

          background:
            "rgba(249,115,22,.14)",

          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",

          gap: 40,

          flexWrap: "wrap",
        }}
      >
        {/* IZQUIERDA */}

        <div
          style={{
            flex: 1,

            minWidth: 340,
          }}
        >
          <div
            style={{
              display: "inline-flex",

              alignItems: "center",

              gap: 10,

              padding: "8px 18px",

              borderRadius: 999,

              background:
                "rgba(249,115,22,.12)",

              border:
                "1px solid rgba(249,115,22,.22)",

              color: "#f97316",

              fontWeight: 800,

              fontSize: 13,

              letterSpacing: 1.5,

              marginBottom: 24,
            }}
          >
            🐺 WOLF ORDERING SAAS
          </div>

          <h1
            style={{
              margin: 0,

              color: "#fff",

              fontWeight: 900,

              lineHeight: 1,

              fontSize:
                "clamp(54px,7vw,82px)",
            }}
          >
            Executive
            <br />
            Command Center
          </h1>

          <p
            style={{
              marginTop: 26,

              color: "#9d9d9d",

              fontSize: 17,

              lineHeight: 1.9,

              maxWidth: 760,
            }}
          >
            Bienvenido{" "}
            <strong
              style={{
                color: "#fff",
              }}
            >
              {user?.full_name ??
                "Super Administrador"}
            </strong>
            .
            <br />
            Administra restaurantes,
            Centro Legal,
            infraestructura,
            usuarios,
            permisos y monitorea
            toda la plataforma
            Wolf Ordering SaaS
            desde un único lugar.
          </p>

          <div
            style={{
              marginTop: 26,
            }}
          >
            <SuperAdminBadges
              role={user?.role?.name}
            />
          </div>
        </div>

        {/* DERECHA */}

        <div
          style={{
            width: 380,

            maxWidth: "100%",
          }}
        >
          <LogoutButton />
          <div
            style={{
              marginTop: 24,

              padding: 30,

              borderRadius: 30,

              background:
                "linear-gradient(180deg,#171717,#101010)",

              border:
                "1px solid rgba(255,255,255,.06)",

              boxShadow:
                "0 16px 40px rgba(0,0,0,.24)",
            }}
          >
            <div
              style={{
                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#8b8b95",

                    fontSize: 13,

                    fontWeight: 700,

                    letterSpacing: 1.5,

                    textTransform: "uppercase",
                  }}
                >
                  Plataforma
                </div>

                <div
                  style={{
                    marginTop: 8,

                    color: "#fff",

                    fontSize: 32,

                    fontWeight: 900,
                  }}
                >
                  Wolf Ordering
                </div>
              </div>

              <div
                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: 8,

                  padding: "8px 14px",

                  borderRadius: 999,

                  background:
                    "rgba(34,197,94,.12)",

                  border:
                    "1px solid rgba(34,197,94,.22)",

                  color: "#4ade80",

                  fontWeight: 700,

                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    width: 10,

                    height: 10,

                    borderRadius: "50%",

                    background: "#22c55e",
                  }}
                />

                Online
              </div>
            </div>

<InfoCard
  title="Restaurantes"
  value={String(stats.restaurants)}
  color="#f97316"
/>

<InfoCard
  title="Centro Legal"
  value={String(stats.legal)}
  color="#3b82f6"
/>

<InfoCard
  title="Usuarios"
  value={String(stats.users)}
  color="#22c55e"
/>

            <InfoCard
              title="Versión"
              value="v2"
              color="#8b5cf6"
            />

            <div
              style={{
                marginTop: 28,

                display: "flex",

                flexWrap: "wrap",

                gap: 12,
              }}
            >
              <Badge
                text="Producción"
                color="#22c55e"
              />

              <Badge
                text="Supabase"
                color="#3b82f6"
              />

              <Badge
                text="Cloud"
                color="#8b5cf6"
              />

              <Badge
                text="Seguridad"
                color="#f97316"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "10px 16px",

        borderRadius: 999,

        background: `${color}18`,

        border: `1px solid ${color}30`,

        color,

        fontWeight: 700,

        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}

function InfoCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        padding: "16px 0",

        borderBottom:
          "1px solid rgba(255,255,255,.06)",
      }}
    >
      <span
        style={{
          color: "#9a9a9a",

          fontSize: 15,
        }}
      >
        {title}
      </span>

      <span
        style={{
          color,

          fontWeight: 800,

          fontSize: 20,
        }}
      >
        {value}
      </span>
    </div>
  );
}