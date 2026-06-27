import { getRestaurant } from "@/lib/restaurants/getRestaurant";

import OrderClient from "@/components/restaurant/order/OrderClient";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrderPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const restaurant =
    await getRestaurant(slug);

  if (!restaurant) {
    return (
      <main
        style={{
          padding: "40px",
        }}
      >
        <h1>
          Restaurante no encontrado
        </h1>
      </main>
    );
  }

  if (!restaurant.is_open) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "650px",
            width: "100%",
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            padding: "40px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "70px",
              marginBottom: "20px",
            }}
          >
            🔒
          </div>

          <h1
            style={{
              fontSize: "42px",
              marginBottom: "15px",
            }}
          >
            Restaurante Cerrado
          </h1>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
            En este momento no estamos
            recibiendo pedidos.
          </p>

          <div
            style={{
              marginTop: "25px",
              display: "inline-block",
              padding: "14px 24px",
              borderRadius: "999px",
              background:
                "rgba(239,68,68,.12)",
              border:
                "1px solid rgba(239,68,68,.25)",
              color: "#ef4444",
              fontWeight: "700",
            }}
          >
            Horario de hoy:
            {" "}
            {restaurant.today_open}
            {" - "}
            {restaurant.today_close}
          </div>

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <a
              href={`/${restaurant.slug}`}
              style={{
                display:
                  "inline-block",
                background:
                  restaurant.primary_color,
                color: "#fff",
                padding:
                  "16px 30px",
                borderRadius:
                  "16px",
                textDecoration:
                  "none",
                fontWeight: "700",
              }}
            >
              ← Volver al restaurante
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <OrderClient
      restaurant={restaurant}
    />
  );
}