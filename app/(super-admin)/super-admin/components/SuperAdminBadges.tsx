"use client";

type Props = {
  role?: string;
};

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
        display: "flex",

        alignItems: "center",

        gap: 10,

        padding: "10px 18px",

        borderRadius: 999,

        background: `${color}18`,

        border: `1px solid ${color}35`,

        color,

        fontWeight: 700,

        fontSize: 14,

        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 9,

          height: 9,

          borderRadius: "50%",

          background: color,

          boxShadow: `0 0 12px ${color}`,
        }}
      />

      {text}
    </div>
  );
}

export default function SuperAdminBadges({
  role,
}: Props) {
  return (
    <div
      style={{
        display: "flex",

        flexWrap: "wrap",

        gap: 14,

        marginTop: 28,
      }}
    >
      <Badge
        text={role || "Super Admin"}
        color="#f97316"
      />

      <Badge
        text="Producción"
        color="#22c55e"
      />

      <Badge
        text="Wolf SaaS"
        color="#3b82f6"
      />

      <Badge
        text="Sistema Online"
        color="#8b5cf6"
      />
    </div>
  );
}