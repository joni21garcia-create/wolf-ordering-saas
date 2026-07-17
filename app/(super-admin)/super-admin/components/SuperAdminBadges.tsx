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
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: `${color}10`,
        border: `1px solid ${color}25`,
        color,
        fontWeight: 700,
        fontSize: 11,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
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
        gap: 8,
        marginTop: 16,
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