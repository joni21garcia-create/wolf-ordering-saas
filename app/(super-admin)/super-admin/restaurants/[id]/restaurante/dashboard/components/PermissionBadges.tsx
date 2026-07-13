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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
      }}
    >
      <Badge
        color="#f97316"
        text={role || "Sin rol"}
      />

      <Badge
        color="#22c55e"
        text={`${permissions} módulos habilitados`}
      />

      <Badge
        color="#3b82f6"
        text="Sistema Online"
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
    <div
      style={{
        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,

        padding: "10px 18px",

        borderRadius: 999,

        background: `${color}18`,

        border: `1px solid ${color}35`,

        backdropFilter: "blur(12px)",

        whiteSpace: "nowrap",

        transition: ".25s",
      }}
    >
      <span
        style={{
          width: 10,

          height: 10,

          borderRadius: "50%",

          background: color,

          boxShadow: `0 0 12px ${color}`,
        }}
      />

      <span
        style={{
          color,

          fontWeight: 700,

          fontSize: 14,
        }}
      >
        {text}
      </span>
    </div>
  );
}