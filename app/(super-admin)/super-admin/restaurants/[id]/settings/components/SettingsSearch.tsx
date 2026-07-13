"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SettingsSearch({
  value,
  onChange,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 30,
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 22,
            pointerEvents: "none",
          }}
        >
          🔍
        </div>

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Buscar módulos, configuración, pedidos, finanzas, marketing..."
          style={{
            width: "100%",

            height: 66,

            paddingLeft: 62,

            paddingRight: 24,

            borderRadius: 20,

            border:
              "1px solid rgba(255,255,255,.08)",

            background:
              "linear-gradient(180deg,#141414,#0d0d0d)",

            color: "#fff",

            fontSize: 16,

            outline: "none",

            boxSizing: "border-box",

            transition: ".25s",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 10,

          color: "#7b7b84",

          fontSize: 13,
        }}
      >
        Busca por nombre del módulo o descripción.
      </div>
    </section>
  );
}