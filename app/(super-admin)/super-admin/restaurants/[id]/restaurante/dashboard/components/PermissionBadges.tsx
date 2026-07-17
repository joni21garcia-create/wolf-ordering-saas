"use client";

type Props = {
  role?: string;
  permissions?: number; // Sigue siendo un número limpio
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
        gap: 8, // Separación más unificada y elegante
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
        gap: 6, // Gap ajustado
        padding: "4px 10px", // Reducción premium de tamaño (antes era 10px 18px)
        borderRadius: 999,
        background: `${color}08`, // Menos opacidad de fondo para mayor elegancia
        border: `1px solid ${color}20`, // Borde ultra sutil
        backdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
      }}
    >
      <span
        style={{
          width: 6, // Burbuja más pequeña y delicada (antes 10)
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />

      <span
        style={{
          color,
          fontWeight: 600,
          fontSize: 11, // Fuente reducida de 14 a 11 para un look "pro"
          letterSpacing: "0.3px",
        }}
      >
        {text}
      </span>
    </div>
  );
}