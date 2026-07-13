"use client";

type Props = {
  active: boolean;
};

export default function RestaurantStatus({
  active,
}: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        gap: 10,

        padding: "8px 16px",

        borderRadius: 999,

        background: active
          ? "rgba(34,197,94,.12)"
          : "rgba(239,68,68,.12)",

        border: active
          ? "1px solid rgba(34,197,94,.20)"
          : "1px solid rgba(239,68,68,.20)",

        backdropFilter: "blur(8px)",
      }}
    >
      {/* Indicador */}

      <span
        style={{
          width: 10,
          height: 10,

          borderRadius: "50%",

          background: active
            ? "#22c55e"
            : "#ef4444",

          boxShadow: active
            ? "0 0 12px rgba(34,197,94,.60)"
            : "0 0 12px rgba(239,68,68,.60)",

          flexShrink: 0,
        }}
      />

      {/* Texto */}

      <span
        style={{
          color: active
            ? "#22c55e"
            : "#ef4444",

          fontWeight: 700,

          fontSize: 13,

          letterSpacing: ".3px",

          whiteSpace: "nowrap",
        }}
      >
        {active
          ? "Restaurante Activo"
          : "Restaurante Inactivo"}
      </span>
    </div>
  );
}