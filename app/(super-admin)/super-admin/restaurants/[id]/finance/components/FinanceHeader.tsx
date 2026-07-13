"use client";

import Link from "next/link";
import BackToSettings from "@/components/admin/BackToSettings";

interface Props {
  restaurant: {
    id: string;
    name: string;
  } | null;
}

export default function FinanceHeader({
  restaurant,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 36,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#8b8b8b",
              fontSize: 14,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            <BackToSettings
              restaurantId={
                restaurant?.id ?? ""
              }
            />

            <span>/</span>

            <span>
              Finance Center
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(32px,4vw,48px)",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            💰{" "}
            {restaurant?.name ??
              "Restaurante"}
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#888",
              maxWidth: 650,
              lineHeight: 1.6,
            }}
          >
            Centro financiero del
            restaurante. Aquí puedes
            administrar liquidaciones,
            invoices, ingresos,
            métricas y toda la
            información financiera del
            negocio.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <Link
            href={`/super-admin/restaurants/${restaurant?.id}/analytics`}
            style={{
              textDecoration:
                "none",
            }}
          >
            <Button
              background="#171717"
            >
              📈 Analytics
            </Button>
          </Link>

          <Link
            href={`/super-admin/restaurants/${restaurant?.id}/settings`}
            style={{
              textDecoration:
                "none",
            }}
          >
            <Button
              background="#f97316"
            >
              ⚙ Configuración
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Button({
  children,
  background,
}: {
  children: React.ReactNode;
  background: string;
}) {
  return (
    <div
      style={{
        background,
        color: "#fff",
        padding:
          "14px 20px",
        borderRadius: 14,
        fontWeight: 700,
        border:
          background === "#171717"
            ? "1px solid rgba(255,255,255,.08)"
            : "none",
        transition: ".25s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}