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
          boxShadow: "0 20px 45px rgba(0,0,0,.25)",
        }}
      >
        {/* Header */}

        <div
          style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background:
              "linear-gradient(180deg,#1f2937,#111827)",
          }}
        >
          {logoUrl ? (
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 22,
                background: "#ffffff",
                padding: 8,
                marginBottom: 20,
              }}
            >
              <img
                src={logoUrl}
                alt={restaurantName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 22,
                background:
                  "linear-gradient(135deg,#f97316,#ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
              }}
            >
              🍽️
            </div>
          )}

          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {restaurantName}
          </h2>

          <div
            style={{
              marginTop: 16,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(249,115,22,.15)",
              color: "#f97316",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            MENÚ DIGITAL
          </div>
        </div>

        {/* QR */}

        <div
          style={{
            padding: 32,
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
                "0 12px 40px rgba(0,0,0,.18)",
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

          <h3
            style={{
              marginTop: 28,
              marginBottom: 8,
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Escanea para ordenar
          </h3>

          <p
            style={{
              margin: 0,
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

          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "rgba(255,255,255,.08)",
              margin: "24px 0",
            }}
          />

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: 12,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {url}
          </p>
        </div>
      </div>
    </div>
  );
}