"use client";

export default function SettingsFooter() {
  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: 50,
        borderRadius: 24,
        padding: "28px 32px",
        background: "linear-gradient(180deg,#151515,#0b0b0b)",
        border: "1px solid rgba(255,255,255,.07)",
        boxShadow: "0 15px 40px rgba(0,0,0,.20)",
        boxSizing: "border-box",
      }}
    >
      {/* Glow decorativo sutil */}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(249,115,22,.06)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {/* Información principal */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div
            style={{
              color: "#f97316",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Wolf Platform
          </div>

          <h3
            style={{
              margin: 0,
              color: "#fff",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: "-0.5px",
            }}
          >
            🐺 Wolf Ordering SaaS
          </h3>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b95",
              fontSize: 13,
              lineHeight: 1.6,
              maxWidth: 500,
            }}
          >
            Centro unificado para administrar la configuración completa del restaurante de forma fluida y centralizada.
          </p>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <MiniInfo label="Estado" value="Online" />
            <MiniInfo label="Panel" value="Restaurant Center" />
            <MiniInfo label="Versión" value="v2" />
          </div>
        </div>

        {/* Badges de Estado */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            maxWidth: 360,
            justifyContent: "flex-start",
          }}
        >
          <Badge color="#22c55e" text="🟢 Sistema Operativo" />
          <Badge color="#3b82f6" text="🏪 Multi Restaurant" />
          <Badge color="#f97316" text="⚙ Configuración Premium" />
          <Badge color="#8b5cf6" text="🚀 Wolf OS" />
        </div>
      </div>

      {/* Línea inferior */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 24,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          color: "#707070",
          fontSize: 12,
        }}
      >
        <span>© {new Date().getFullYear()} Wolf Ordering SaaS. Todos los derechos reservados.</span>
        <span style={{ color: "#a1a1aa", fontWeight: 600 }}>Restaurant Settings Center</span>
      </div>
    </footer>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          color: "#6b7280",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 2,
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 99,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color,
        fontWeight: 700,
        fontSize: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {text}
    </div>
  );
}