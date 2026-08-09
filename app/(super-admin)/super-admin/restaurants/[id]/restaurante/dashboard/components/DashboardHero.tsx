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
  const moduleCount = user.permissions?.length ?? 0;
  const firstName = user.full_name?.trim()?.split(" ")[0] || "Usuario";

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <div style={identityStyle}>
          <div style={eyebrowStyle}>Wolf Restaurant OS</div>

          <div style={titleRowStyle}>
            <h1 style={titleStyle}>
              Hola, <span style={accentStyle}>{firstName}</span>
            </h1>

            <span style={onlinePillStyle}>
              <span style={onlineDotStyle} />
              Online
            </span>
          </div>

          <p style={descriptionStyle}>
            Opera tu restaurante desde un solo lugar.
          </p>

          <PermissionBadges
            role={user.role?.name}
            permissions={moduleCount}
          />
        </div>

        <div style={logoutWrapStyle}>
          <LogoutButton />
        </div>
      </div>

      <div style={statusBarStyle}>
        <div style={statusCopyStyle}>
          <span style={statusKickerStyle}>Centro operativo</span>
          <span style={statusTitleStyle}>Todo listo para comenzar</span>
        </div>

        <div style={moduleStatusStyle}>
          <span style={moduleStatusDotStyle} />
          <strong>{moduleCount}</strong>
          <span>{moduleCount === 1 ? "módulo activo" : "módulos activos"}</span>
        </div>
      </div>
    </section>
  );
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 20,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  padding: "2px 0 16px",
};

const identityStyle: React.CSSProperties = {
  minWidth: 0,
  flex: 1,
};

const eyebrowStyle: React.CSSProperties = {
  marginBottom: 6,
  color: "rgba(255,255,255,.24)",
  fontSize: 8.5,
  fontWeight: 800,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
};

const titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 9,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#fff",
  fontSize: "clamp(25px, 6vw, 34px)",
  lineHeight: 1,
  fontWeight: 850,
  letterSpacing: "-.9px",
};

const accentStyle: React.CSSProperties = {
  color: "#f97316",
};

const onlinePillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 8px",
  borderRadius: 999,
  background: "rgba(34,197,94,.055)",
  border: "1px solid rgba(34,197,94,.13)",
  color: "rgba(34,197,94,.82)",
  fontSize: 8.5,
  fontWeight: 800,
  letterSpacing: ".55px",
  textTransform: "uppercase",
};

const onlineDotStyle: React.CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "#22c55e",
};

const descriptionStyle: React.CSSProperties = {
  margin: "7px 0 10px",
  color: "rgba(255,255,255,.3)",
  fontSize: 10.5,
  lineHeight: 1.4,
};

const logoutWrapStyle: React.CSSProperties = {
  flexShrink: 0,
  paddingTop: 5,
};

const statusBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 56,
  padding: "9px 12px",
  boxSizing: "border-box",
  borderRadius: 14,
  background: "rgba(255,255,255,.018)",
  border: "1px solid rgba(255,255,255,.055)",
};

const statusCopyStyle: React.CSSProperties = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const statusKickerStyle: React.CSSProperties = {
  color: "#f97316",
  fontSize: 7.5,
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const statusTitleStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.7)",
  fontSize: 11,
  fontWeight: 650,
};

const moduleStatusStyle: React.CSSProperties = {
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "6px 8px",
  borderRadius: 9,
  background: "rgba(34,197,94,.045)",
  border: "1px solid rgba(34,197,94,.11)",
  color: "rgba(255,255,255,.48)",
  fontSize: 8.5,
  whiteSpace: "nowrap",
};

const moduleStatusDotStyle: React.CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "#22c55e",
};