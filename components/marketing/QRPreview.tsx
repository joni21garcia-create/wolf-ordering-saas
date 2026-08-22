"use client";

interface Props {
  restaurantName: string;
  qrImage: string;
  url: string;
  logoUrl?: string;
}

export default function QRPreview({
  restaurantName,
  qrImage,
  url,
  logoUrl,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 28,
          overflow: "hidden",
          background: "#111827",
          border: "1px solid rgba(255,255,255,.08)",
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
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background:
              "linear-gradient(145deg,#111827 0%,#1f2937 55%,#111827 100%)",
          }}
        >
          {/* Glow */}

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
                marginBottom: 20,
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
              fontSize: 28,
              lineHeight: 1.15,
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: "-0.4px",
            }}
          >
            {restaurantName}
          </h2>

          {/* Badge */}

          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: 16,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(249,115,22,.15)",
              border: "1px solid rgba(249,115,22,.28)",
              color: "#fb923c",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            MENÚ DIGITAL
          </div>
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
          <div
            style={{
              background: "#ffffff",
              padding: 18,
              borderRadius: 24,
              boxShadow:
                "0 16px 45px rgba(0,0,0,.18)",
            }}
          >
            <img
              src={qrImage}
              alt="Código QR"
              style={{
                width: 270,
                height: 270,
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
              gap: 9,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f97316",
              }}
            />

            <h3
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.3px",
              }}
            >
              Escanea para ordenar
            </h3>

            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f97316",
              }}
            />
          </div>

          <p
            style={{
              margin: "10px 0 0",
              color: "#9ca3af",
              fontSize: 14,
              lineHeight: 1.6,
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            Abre el menú digital y realiza tu pedido
            en segundos.
          </p>

          {/* URL */}

          <div
            style={{
              width: "100%",
              marginTop: 24,
              paddingTop: 20,
              borderTop:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: 11,
                lineHeight: 1.5,
                textAlign: "center",
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
            background: "#0b1220",
            color: "#ffffff",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 3,
              borderRadius: 999,
              background: "#f97316",
              margin: "0 auto 12px",
            }}
          />

          <strong
            style={{
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            Wolf Ordering
          </strong>

          <div
            style={{
              marginTop: 7,
              color: "#6b7280",
              fontSize: 12,
            }}
          >
            Menú Digital • Pedidos Online
          </div>
        </div>
      </div>
    </div>
  );
}