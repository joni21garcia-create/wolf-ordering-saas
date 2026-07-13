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

export default function DashboardHero({
  user,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 60,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",

          gap: 24,

          flexWrap: "wrap",

          marginBottom: 40,
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

              marginBottom: 18,
            }}
          >
            WOLF RESTAURANT OS
          </span>

          <h1
            style={{
              margin: 0,

              color: "#fff",

              fontSize: "clamp(42px,6vw,72px)",

              lineHeight: 1,

              fontWeight: 900,
            }}
          >
            Bienvenido
            <br />
            {user.full_name || "Usuario"}
          </h1>

          <p
            style={{
              marginTop: 22,

              color: "#9a9a9a",

              maxWidth: 760,

              lineHeight: 1.9,

              fontSize: 17,
            }}
          >
            Administra la operación diaria de tu restaurante
            desde un único lugar. Accede rápidamente a los
            pedidos y a la configuración autorizada para tu
            rol.
          </p>

          <div
            style={{
              marginTop: 28,
            }}
          >
            <PermissionBadges
              role={user.role?.name}
              permissions={
                user.permissions?.length ?? 0
              }
            />
          </div>
        </div>

        <LogoutButton />
      </div>

      {/* Panel superior */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",

          gap: 22,
        }}
      >
                {/* Centro Operativo */}

        <div
          style={{
            position: "relative",

            overflow: "hidden",

            borderRadius: 30,

            padding: 30,

            background:
              "linear-gradient(180deg,#1a1a1a,#141414)",

            border:
              "1px solid rgba(255,255,255,.06)",

            boxShadow:
              "0 20px 60px rgba(0,0,0,.22)",
          }}
        >
          {/* Glow */}

          <div
            style={{
              position: "absolute",

              top: -70,

              right: -70,

              width: 180,

              height: 180,

              borderRadius: "50%",

              background:
                "rgba(249,115,22,.16)",

              filter: "blur(40px)",
            }}
          />

          <div
            style={{
              position: "relative",

              zIndex: 2,
            }}
          >
            <span
              style={{
                color: "#f97316",

                fontWeight: 800,

                letterSpacing: 1,
              }}
            >
              CENTRO OPERATIVO
            </span>

            <h2
              style={{
                marginTop: 16,

                marginBottom: 12,

                color: "#fff",

                fontSize: 30,

                fontWeight: 800,
              }}
            >
              Todo listo para comenzar
            </h2>

            <p
              style={{
                color: "#9b9b9b",

                lineHeight: 1.8,

                marginBottom: 28,
              }}
            >
              Tu panel ya está preparado según los permisos
              asignados a tu usuario. Desde aquí podrás acceder
              rápidamente a la operación diaria del restaurante.
            </p>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(2,minmax(120px,1fr))",

                gap: 18,
              }}
            >
              <InfoCard
                title="Rol"
                value={
                  user.role?.name ??
                  "Sin rol"
                }
              />

              <InfoCard
                title="Módulos"
                value={`${user.permissions?.length ?? 0}`}
              />

              <InfoCard
                title="Estado"
                value="Online"
                color="#22c55e"
              />

              <InfoCard
                title="Sistema"
                value="Activo"
                color="#3b82f6"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  title,
  value,
  color = "#f97316",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: 18,

        borderRadius: 18,

        background:
          "rgba(255,255,255,.04)",

        border:
          "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          color: "#8f8f8f",

          fontSize: 13,

          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 8,
        }}
      >
        <span
          style={{
            width: 10,

            height: 10,

            borderRadius: "50%",

            background: color,

            boxShadow: `0 0 10px ${color}`,
          }}
        />

        <span
          style={{
            color: "#fff",

            fontSize: 18,

            fontWeight: 700,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}