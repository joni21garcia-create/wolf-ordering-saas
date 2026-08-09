"use client";

type Props = {
  role?: string;
  permissions?: number;
};

export default function PermissionBadges({
  role,
  permissions = 0,
}: Props) {
  return (
    <div style={containerStyle} aria-label="Información de acceso">
      <Badge
        color="#f97316"
        text={role || "Sin rol"}
      />

      <span style={separatorStyle}>·</span>

      <Badge
        color="#22c55e"
        text={`${permissions} ${
          permissions === 1 ? "módulo habilitado" : "módulos habilitados"
        }`}
      />
    </div>
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
    <span
      style={{
        ...badgeStyle,
        color,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          ...dotStyle,
          background: color,
        }}
      />
      {text}
    </span>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 6,
  minHeight: 20,
};

const separatorStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.16)",
  fontSize: 12,
  userSelect: "none",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  minWidth: 0,
  padding: "3px 0",
  background: "transparent",
  fontSize: 9.5,
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: ".15px",
  whiteSpace: "nowrap",
};

const dotStyle: React.CSSProperties = {
  width: 5,
  height: 5,
  flexShrink: 0,
  borderRadius: "50%",
};