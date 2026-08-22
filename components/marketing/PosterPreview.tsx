"use client";

interface Props {
  restaurantName: string;
  qrImage: string;
  url: string;
  logoUrl?: string;
}

export default function PosterPreview({
  restaurantName,
  qrImage,
  url,
  logoUrl,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,.25)",
      }}
    >
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg,#111827 0%,#1f2937 55%,#111827 100%)",
          padding: "34px 28px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Decorative glow */}

        <div
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(249,115,22,.12)",
            filter: "blur(35px)",
            top: -90,
            right: -50,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(249,115,22,.08)",
            filter: "blur(30px)",
            bottom: -90,
            left: -40,
            pointerEvents: "none",
          }}
        />

        {/* Logo */}

        {logoUrl && (
          <div
            style={{
              position: "relative",
              width: 94,
              height: 94,
              borderRadius: "50%",
              padding: 4,
              background:
                "linear-gradient(135deg,#f97316,#fb923c,#f97316)",
              boxShadow:
                "0 12px 35px rgba(0,0,0,.35), 0 0 0 6px rgba(249,115,22,.10)",
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ffffff",
              }}
            >
              <img
                src={logoUrl}
                alt={restaurantName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        )}

        {/* Restaurant */}

        <h2
          style={{
            position: "relative",
            zIndex: 1,
            margin: 0,
            color: "#ffffff",
            fontSize: 30,
            lineHeight: 1.15,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "-0.5px",
          }}
        >
          {restaurantName}
        </h2>

        {/* Badge */}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(249,115,22,.14)",
            border: "1px solid rgba(249,115,22,.28)",
            color: "#fb923c",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
          }}
        >
          MENÚ DIGITAL
        </div>

        <p
          style={{
            position: "relative",
            zIndex: 1,
            margin: 0,
            color: "rgba(255,255,255,.82)",
            textAlign: "center",
            fontSize: 14,
            lineHeight: 1.55,
            maxWidth: 300,
          }}
        >
          Escanea el código y realiza tu pedido
          <br />
          directamente desde tu celular.
        </p>
      </div>

      {/* =========================================================
          QR
      ========================================================= */}

      <div
        style={{
          padding: "34px 28px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* QR Card */}

        <div
          style={{
            background: "#ffffff",
            padding: 18,
            borderRadius: 24,
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 16px 45px rgba(17,24,39,.12)",
          }}
        >
          <img
            src={qrImage}
            alt="Código QR"
            style={{
              width: 250,
              height: 250,
              display: "block",
            }}
          />
        </div>

        {/* CTA */}

        <div
          style={{
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#f97316",
            }}
          />

          <h3
            style={{
              margin: 0,
              color: "#111827",
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: "-0.3px",
            }}
          >
            Escanéame
          </h3>

          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#f97316",
            }}
          />
        </div>

        <p
          style={{
            margin: "10px 0 0",
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 300,
            fontSize: 14,
          }}
        >
          Accede al menú digital, realiza tu pedido
          y disfruta una experiencia rápida y sencilla.
        </p>

        {/* URL */}

        <div
          style={{
            width: "100%",
            marginTop: 26,
            paddingTop: 20,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#9ca3af",
              textAlign: "center",
              fontSize: 11,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {url}
          </p>
        </div>
      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg,#111827,#1f2937)",
          color: "#ffffff",
          padding: "22px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 3,
            borderRadius: 999,
            background: "#f97316",
            margin: "0 auto 14px",
          }}
        />

        <strong
          style={{
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          Wolf Ordering
        </strong>

        <div
          style={{
            marginTop: 7,
            color: "#9ca3af",
            fontSize: 12,
          }}
        >
          Menú Digital • Pedidos Online
        </div>
      </div>
    </div>
  );
}