"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import PermissionBadges from "./PermissionBadges";

type Props = {
  user: {
    full_name?: string;
    role?: {
      name?: string;
    };
    permissions?: string[];
  };
};

export default function DashboardHero({ user }: Props) {
  return (
    <section
      style={{
        marginBottom: 32, // Reducido de 60 para evitar espacio muerto vertical
      }}
    >
      {/* Header General */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 28, // Reducido de 40
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 280,
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "#f97316",
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: 12,
              marginBottom: 10, // Reducido de 18
            }}
          >
            WOLF RESTAURANT OS
          </span>

          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(32px, 5vw, 48px)", // Más estilizado y menos colosal que 72px
              lineHeight: 1.1,
              fontWeight: 900,
            }}
          >
            Bienvenido,
            <br />
            <span style={{ color: "#f97316" }}>{user.full_name || "Usuario"}</span>
          </h1>

          <p
            style={{
              marginTop: 14, // Reducido de 22
              color: "#8a8a8a",
              maxWidth: 680,
              lineHeight: 1.6,
              fontSize: 15, // Reducido de 17 para un look más "dashboard clean"
            }}
          >
            Administra la operación diaria de tu restaurante desde un único lugar. Accede rápidamente a los pedidos y a la configuración autorizada para tu rol.
          </p>

          <div
            style={{
              marginTop: 18, // Reducido de 28
            }}
          >
            <PermissionBadges
              role={user.role?.name}
              permissions={user.permissions?.length ?? 0}
            />
          </div>
        </div>

        <LogoutButton />
      </div>

      {/* Banner de Inicio (Reemplaza el panel gigante anterior por una barra minimalista ultra-estética) */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20, // Reducido de 30 para mejor consistencia
          padding: "20px 24px", // Compactado para evitar que coma pantalla
          background: "linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(20,20,20,0.8) 100%)",
          border: "1px solid rgba(255,255,255,.04)",
          boxShadow: "0 12px 40px rgba(0,0,0,.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* Glow de ambientación naranja sutil */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(249,115,22,.08)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        {/* Textos del Banner */}
        <div style={{ position: "relative", zIndex: 2, flex: 1, minWidth: 260 }}>
          <span
            style={{
              color: "#f97316",
              fontWeight: 800,
              letterSpacing: 1.5,
              fontSize: 10,
              display: "block",
              marginBottom: 4,
            }}
          >
            CENTRO OPERATIVO
          </span>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 18, // Más elegante, menos intrusivo
              fontWeight: 800,
            }}
          >
            Todo listo para comenzar
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: "#8a8a8a",
              fontSize: 12.5,
              lineHeight: 1.5,
              maxWidth: 680,
            }}
          >
            Tu panel ya está preparado según los permisos asignados. Accede de inmediato a los módulos de trabajo activos en tiempo real.
          </p>
        </div>

        {/* Pequeño Badge Premium de Estado del Sistema en Línea (Sustituye de forma limpia las InfoCards redundantes) */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255, 255, 255, .03)",
            border: "1px solid rgba(255, 255, 255, .05)",
            padding: "10px 16px",
            borderRadius: 12,
          }}
        >
          <div style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
            <span
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#22c55e",
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
          </div>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
            {user.permissions?.length ?? 0} Módulos Activos
          </span>
        </div>

        {/* Inyección CSS para animar el pulso verde de conexión estable */}
        <style jsx global>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </section>
  );
}