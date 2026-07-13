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
        maxWidth: 420,
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,.25)",
      }}
    >
      {/* Header */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#f97316,#ea580c)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {logoUrl && (
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: 20,
              background: "#ffffff",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
        )}

        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          {restaurantName}
        </h2>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,.9)",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          Escanea el código y realiza tu pedido
          desde tu celular.
        </p>
      </div>

      {/* QR */}

      <div
        style={{
          padding: 34,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: 18,
            borderRadius: 22,
            border: "1px solid #e5e7eb",
          }}
        >
          <img
            src={qrImage}
            alt="QR"
            style={{
              width: 250,
              height: 250,
              display: "block",
            }}
          />
        </div>

        <h3
          style={{
            marginTop: 28,
            marginBottom: 8,
            color: "#111827",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Escanéame
        </h3>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          Accede al menú digital, realiza tu pedido
          y disfruta una experiencia rápida y
          sencilla.
        </p>

        <div
          style={{
            width: "100%",
            height: 1,
            background: "#e5e7eb",
            margin: "28px 0",
          }}
        />

        <p
          style={{
            margin: 0,
            color: "#9ca3af",
            textAlign: "center",
            fontSize: 12,
            wordBreak: "break-word",
          }}
        >
          {url}
        </p>
      </div>

      {/* Footer */}

      <div
        style={{
          background: "#111827",
          color: "#ffffff",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <strong
          style={{
            color: "#f97316",
          }}
        >
          Wolf Ordering
        </strong>

        <div
          style={{
            marginTop: 8,
            color: "#9ca3af",
            fontSize: 13,
          }}
        >
          Menú Digital • Pedidos Online
        </div>
      </div>
    </div>
  );
}