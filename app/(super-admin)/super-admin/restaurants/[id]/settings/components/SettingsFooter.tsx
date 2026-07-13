"use client";

export default function SettingsFooter() {
  return (
    <footer
      style={{
        position: "relative",

        overflow: "hidden",

        marginTop: 70,

        borderRadius: 30,

        padding: "34px",

        background:
          "linear-gradient(180deg,#171717,#0b0b0b)",

        border:
          "1px solid rgba(255,255,255,.07)",

        boxShadow:
          "0 20px 60px rgba(0,0,0,.20)",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",

          right: -80,

          top: -80,

          width: 220,

          height: 220,

          borderRadius: "50%",

          background:
            "rgba(249,115,22,.08)",

          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 30,
        }}
      >
        {/* Información */}

        <div>
          <div
            style={{
              color: "#f97316",

              fontSize: 13,

              fontWeight: 800,

              letterSpacing: 2,

              textTransform: "uppercase",

              marginBottom: 10,
            }}
          >
            Wolf Platform
          </div>

          <h3
            style={{
              margin: 0,

              color: "#fff",

              fontWeight: 900,

              fontSize: 28,
            }}
          >
            🐺 Wolf Ordering SaaS
          </h3>

          <p
            style={{
              marginTop: 12,

              color: "#8b8b95",

              lineHeight: 1.8,

              maxWidth: 620,
            }}
          >
            Centro unificado para administrar
            la configuración completa del
            restaurante. Todo el sistema se
            encuentra centralizado desde este
            panel.
          </p>

          <div
            style={{
              marginTop: 18,

              display: "flex",

              gap: 14,

              flexWrap: "wrap",
            }}
          >
            <MiniInfo
              label="Estado"
              value="Online"
            />

            <MiniInfo
              label="Panel"
              value="Restaurant Center"
            />

            <MiniInfo
              label="Versión"
              value="v2"
            />
          </div>
        </div>

        {/* Estado */}

        <div
          style={{
            minWidth: 320,

            display: "grid",

            gap: 14,
          }}
        >
          <Badge
            color="#22c55e"
            text="🟢 Sistema Operativo"
          />

          <Badge
            color="#3b82f6"
            text="🏪 Multi Restaurant"
          />

          <Badge
            color="#f97316"
            text="⚙ Configuración Premium"
          />

          <Badge
            color="#8b5cf6"
            text="🚀 Wolf OS"
          />
        </div>
      </div>

      {/* Línea inferior */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          marginTop: 34,

          paddingTop: 22,

          borderTop:
            "1px solid rgba(255,255,255,.06)",

          display: "flex",

          justifyContent:
            "space-between",

          flexWrap: "wrap",

          gap: 16,

          color: "#707070",

          fontSize: 13,
        }}
      >
        <span>
          © {new Date().getFullYear()} Wolf
          Ordering SaaS.
        </span>

        <span>
          Restaurant Settings Center
        </span>
      </div>
    </footer>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          color: "#6b7280",

          fontSize: 12,

          fontWeight: 700,

          textTransform: "uppercase",

          letterSpacing: 1,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,

          color: "#fff",

          fontWeight: 700,
        }}
      >
        {value}
      </div>
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
        padding: "12px 18px",

        borderRadius: 999,

        background: `${color}18`,

        border: `1px solid ${color}35`,

        color,

        fontWeight: 700,

        fontSize: 13,

        display: "inline-flex",

        alignItems: "center",

        gap: 8,
      }}
    >
      {text}
    </div>
  );
}