"use client";

import Link from "next/link";

export default function FinanceFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 70,
        paddingTop: 30,
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            🐺 Wolf Ordering SaaS
          </div>

          <div
            style={{
              color: "#777",
              marginTop: 8,
              fontSize: 14,
            }}
          >
            Finance Center · {year}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="../analytics"
            style={{
              textDecoration: "none",
            }}
          >
            <Button>
              📈 Analytics
            </Button>
          </Link>

          <Link
            href="../settings"
            style={{
              textDecoration: "none",
            }}
          >
            <Button>
              ⚙ Configuración
            </Button>
          </Link>

          <Link
            href="../orders"
            style={{
              textDecoration: "none",
            }}
          >
            <Button>
              📦 Pedidos
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}

function Button({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "12px 18px",
        borderRadius: 14,
        background: "#171717",
        border:
          "1px solid rgba(255,255,255,.08)",
        color: "#fff",
        fontWeight: 700,
        transition: ".25s",
      }}
    >
      {children}
    </div>
  );
}