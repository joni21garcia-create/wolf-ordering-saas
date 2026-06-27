import { createClient } from "@supabase/supabase-js";

import FinancialSettings from "@/components/super-admin/restaurants/FinancialSettings";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinancialPage({
  params,
}: Props) {
  const { id } = await params;

  const { data: restaurant } =
    await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();

  if (!restaurant) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        Restaurante no encontrado
      </div>
    );
  }

return (
  <PermissionGuard permission="financial">
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(180deg,#0b0b0b 0%,#111111 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding:
                "8px 14px",
              borderRadius: "999px",
              background:
                "rgba(249,115,22,.12)",
              border:
                "1px solid rgba(249,115,22,.25)",
              color: "#f97316",
              fontWeight: "600",
              marginBottom: "15px",
            }}
          >
            🐺 Wolf Financial Engine
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "42px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >

            <BackToSettings
              restaurantId={id}
            />
            Configuración Financiera
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "800px",
              lineHeight: "1.8",
            }}
          >
            Controla cómo se calculan
            las comisiones de Wolf,
            quién las paga y cómo se
            reflejan en el menú,
            pedidos, reportes y
            facturación mensual.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#111",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              💰
            </div>

            <h3
              style={{
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              Comisión Actual
            </h3>

            <p
              style={{
                color: "#f97316",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {
                restaurant.commission_percentage
              }
              %
            </p>
          </div>

          <div
            style={{
              background: "#111",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              ⚙️
            </div>

            <h3
              style={{
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              Modo
            </h3>

            <p
              style={{
                color: "#fff",
                fontWeight: "600",
              }}
            >
              {restaurant.commission_mode ===
              "global"
                ? "Global Wolf"
                : "Personalizado"}
            </p>
          </div>

          <div
            style={{
              background: "#111",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              👤
            </div>

            <h3
              style={{
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              Comisión Pagada Por
            </h3>

            <p
              style={{
                color: "#fff",
                fontWeight: "600",
              }}
            >
              {restaurant.commission_type ===
              "customer"
                ? "Cliente"
                : "Restaurante"}
            </p>
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "28px",
            padding: "35px",
            backdropFilter:
              "blur(20px)",
          }}
        >
          <FinancialSettings
            restaurantId={
              restaurant.id
            }
            initialMode={
              restaurant.commission_mode ||
              "global"
            }
            initialType={
              restaurant.commission_type ||
              "customer"
            }
            initialPercentage={
              restaurant.commission_percentage ||
              5
            }
            initialActive={
              restaurant.commission_active ||
              false
            }
          />
        </div>

        <div
          style={{
            marginTop: "30px",
            background:
              "rgba(249,115,22,.08)",
            border:
              "1px solid rgba(249,115,22,.2)",
            borderRadius: "20px",
            padding: "25px",
          }}
        >
          <h3
            style={{
              color: "#fff",
              marginBottom: "15px",
            }}
          >
            📊 Vista previa financiera
          </h3>

          <div
            style={{
              color: "#d1d5db",
              lineHeight: "2",
            }}
          >
            Producto ejemplo:
            <strong>
              {" "}
              $10.00
            </strong>

            <br />

            Si el cliente paga una
            comisión del 5% verá:
            <strong>
              {" "}
              $10.50
            </strong>

            <br />

            Si el restaurante paga la
            comisión del 5% el cliente
            verá:
            <strong>
              {" "}
              $10.00
            </strong>

            <br />

            Wolf recibiría:
            <strong>
              {" "}
              $0.50
            </strong>
          </div>
        </div>
      </div>
     </main>
  </PermissionGuard>
)
}