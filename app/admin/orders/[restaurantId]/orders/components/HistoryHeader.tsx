"use client";

import Link from "next/link";

interface Props {
  restaurantId: string;

  title: string;

  subtitle: string;

  color?: string;

  backUrl?: string;
}

export default function HistoryHeader({
  restaurantId,
  title,
  subtitle,
  color = "#f97316",
  backUrl,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 34,
      }}
    >
      <div>
        <Link
          href={
            backUrl ??
            `/admin/orders/${restaurantId}/orders`
          }
          style={{
            color,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          ← Volver al panel
        </Link>

        <div
          style={{
            marginTop: 22,
            color: "#777",
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Centro de pedidos
        </div>

        <h1
          style={{
            margin: "10px 0 8px",
            color: "#fff",
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            color: "#8b8b8b",
            fontSize: 17,
            maxWidth: 760,
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "12px 18px",
            borderRadius: 14,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.06)",
            color: "#999",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Historial Inteligente
        </div>

        <div
          style={{
            padding: "12px 18px",
            borderRadius: 14,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            color,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Wolf Ordering
        </div>
      </div>
    </div>
  );
}