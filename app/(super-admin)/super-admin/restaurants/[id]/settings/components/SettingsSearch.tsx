"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SettingsSearch({ value, onChange }: Props) {
  return (
    <section
      style={{
        marginBottom: 24,
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        {/* ICONO DE BÚSQUEDA */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 18,
            pointerEvents: "none",
            filter: "grayscale(100%) opacity(0.6)",
          }}
        >
          🔍
        </div>

        {/* INPUT */}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar módulos, configuración, pedidos, finanzas, marketing..."
          style={{
            width: "100%",
            height: 50,
            paddingLeft: 50,
            paddingRight: 20,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,.06)",
            background: "linear-gradient(180deg,#171717,#0b0b0b)",
            color: "#fff",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            boxShadow: "0 8px 20px rgba(0,0,0,.1)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
        />
      </div>

      {/* AYUDA / DESCRIPCIÓN */}
      <div
        style={{
          marginTop: 6,
          marginLeft: 4,
          color: "#8b8b95",
          fontSize: 12,
        }}
      >
        Busca por nombre del módulo o descripción.
      </div>
    </section>
  );
}