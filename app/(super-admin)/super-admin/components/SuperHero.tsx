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
    legal?: number;
  };
};

export default function SuperHero({
  user,
  stats,
}: Props) {
  // Forzamos "1 registro" para el centro legal como solicitaste
  const legalText = "1 registro";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginBottom: 36,
        borderRadius: 24,
        padding: "36px 40px",
        background: "linear-gradient(135deg, #141416 0%, #0a0a0c 50%, #050507 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 30px 90px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Background Glows Dinámicos */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {/* IZQUIERDA */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(249, 115, 22, 0.1)",
                border: "1px solid rgba(249, 115, 22, 0.25)",
                color: "#fb923c",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                marginBottom: 20,
                boxShadow: "0 0 20px rgba(249, 115, 22, 0.1)",
              }}
            >
              <span>🐺</span> Wolf Ordering SaaS
            </div>

            <h1
              style={{
                margin: 0,
                color: "#fff",
                fontWeight: 900,
                letterSpacing: "-1.5px",
                lineHeight: 1.05,
                fontSize: "clamp(36px, 5vw, 56px)",
              }}
            >
              Executive <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ffffff 30%, #888890 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Command Center
              </span>
            </h1>

            <p
              style={{
                marginTop: 20,
                color: "#94a3b8",
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              Bienvenido,{" "}
              <strong style={{ color: "#f8fafc", fontWeight: 700 }}>
                {user?.full_name ?? "Super Administrador"}
              </strong>
              . Administra restaurantes, centro legal, infraestructura, usuarios, permisos y monitorea toda la plataforma Wolf Ordering SaaS ({30} módulos activos) desde un único lugar con precisión quirúrgica.
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <SuperAdminBadges role={user?.role?.name} />
          </div>
        </div>

        {/* DERECHA - PANEL DE CONTROL FLOTANTE */}
        <div
          style={{
            width: 360,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <LogoutButton />
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: 20,
              background: "linear-gradient(180deg, rgba(25, 25, 30, 0.7) 0%, rgba(12, 12, 15, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Plataforma
                </div>
                <div
                  style={{
                    marginTop: 4,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  Wolf Ordering
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                  color: "#4ade80",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 10px #22c55e",
                  }}
                />
                Online
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <InfoCard
                title="Restaurantes"
                value={String(stats.restaurants)}
                color="#f97316"
              />
              <InfoCard
                title="Centro Legal"
                value={legalText}
                color="#3b82f6"
              />
              <InfoCard
                title="Usuarios"
                value={String(stats.users)}
                color="#22c55e"
              />
              <InfoCard
                title="Módulos del Sistema"
                value="30"
                color="#8b5cf6"
              />
            </div>

            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <Badge text="Producción" color="#22c55e" />
              <Badge text="Supabase" color="#3b82f6" />
              <Badge text="Cloud" color="#8b5cf6" />
              <Badge text="Seguridad" color="#f97316" />
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
        padding: "4px 10px",
        borderRadius: 999,
        background: `${color}12`,
        border: `1px solid ${color}25`,
        color,
        fontWeight: 700,
        fontSize: 11,
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
        padding: "10px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      <span
        style={{
          color: "#94a3b8",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {title}
      </span>

      <span
        style={{
          color,
          fontWeight: 800,
          fontSize: 15,
        }}
      >
        {value}
      </span>
    </div>
  );
}