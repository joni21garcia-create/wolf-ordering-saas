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
      .select(`
        id,
        commission_percentage,
        commission_mode,
        commission_type,
        commission_active
      `)
      .eq("id", id)
      .maybeSingle();

  if (!restaurant) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          background: "#0b0b0b",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Restaurante no encontrado
      </div>
    );
  }

  const examplePrice = 10;

 const commission =
restaurant.commission_active
    ? Number(
        restaurant.commission_percentage
      ) || 0
    : 0;

  const customerPrice =
    Number(
      (
        examplePrice *
        (1 + commission / 100)
      ).toFixed(2)
    );

  const wolfAmount =
    Number(
      (
        examplePrice *
        (commission / 100)
      ).toFixed(2)
    );

  return (
    <PermissionGuard permission="financial">
      <main
        style={{
          minHeight: "100vh",
          padding: "clamp(16px, 4vw, 40px)",
          background:
            "linear-gradient(180deg,#0b0b0b 0%,#111111 100%)",
          fontFamily: "system-ui, sans-serif",
          colorScheme: "dark", // Por seguridad, fuerza herencia de modo oscuro en toda la página
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* HEADER SECTION */}
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
                padding: "8px 14px",
                borderRadius: "999px",
                background: "rgba(249,115,22,.12)",
                border: "1px solid rgba(249,115,22,.25)",
                color: "#f97316",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              🐺 Wolf Financial Engine
            </div>

            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(2rem, 5vw, 2.6rem)",
                fontWeight: "800",
                marginBottom: "12px",
                lineHeight: "1.2",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <BackToSettings
                restaurantId={id}
              />
              <span>Configuración Financiera</span>
            </h1>

            <p
              style={{
                color: "#9ca3af",
                maxWidth: "800px",
                lineHeight: "1.7",
                fontSize: "clamp(14px, 2vw, 15px)",
              }}
            >
              Controla cómo se calculan las comisiones de Wolf, quién las paga y cómo se
              reflejan en el menú, pedidos, reportes y facturación mensual.
            </p>
          </div>

          {/* STATS CARDS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* CARD 1: COMISIÓN ACTUAL */}
            <div
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "20px",
                padding: "24px",
                boxSizing: "border-box",
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
                  color: "#888",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Comisión Actual
              </h3>
              <p
                style={{
                  color: "#f97316",
                  fontSize: "32px",
                  fontWeight: "800",
                  margin: 0,
                }}
              >
                {
                   restaurant.commission_active
                    ? `${restaurant.commission_percentage}%`
                        : "Desactivada"
                        }
              </p>
            </div>

            {/* CARD 2: MODO */}
            <div
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "20px",
                padding: "24px",
                boxSizing: "border-box",
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
                  color: "#888",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Modo
              </h3>
              <p
                style={{
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                {restaurant.commission_mode === "global"
                  ? "Global Wolf"
                  : "Personalizado"}
              </p>
            </div>

            {/* CARD 3: PAGADO POR */}
            <div
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "20px",
                padding: "24px",
                boxSizing: "border-box",
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
                  color: "#888",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                Comisión Pagada Por
              </h3>
              <p
                style={{
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                {restaurant.commission_type === "customer"
                  ? "Cliente"
                  : "Restaurante"}
              </p>
            </div>
          </div>

          {/* MAIN SETTINGS CONTAINER */}
          <div
            style={{
              background: "rgba(17,17,17,.95)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "28px",
              padding: "clamp(20px, 4vw, 35px)",
              backdropFilter: "blur(20px)",
              marginBottom: "30px",
              boxSizing: "border-box",
            }}
          >
            <FinancialSettings
              restaurantId={restaurant.id}
              initialMode={restaurant.commission_mode || "global"}
              initialType={restaurant.commission_type || "customer"}
              initialPercentage={restaurant.commission_percentage || 5}
              initialActive={restaurant.commission_active || false}
            />
          </div>

          {/* PREVIEW BOX */}
          <div
            style={{
              background: "rgba(249,115,22,.05)",
              border: "1px solid rgba(249,115,22,.15)",
              borderRadius: "24px",
              padding: "clamp(20px, 4vw, 30px)",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📊 Vista previa financiera
            </h3>

            <div
              style={{
                color: "#d1d5db",
                lineHeight: "1.8",
                fontSize: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div>
                Producto ejemplo:{" "}
                <strong style={{ color: "#fff", fontSize: "15px" }}>
                  {`$${examplePrice.toFixed(2)}`}
                </strong>
              </div>

              <div style={{ height: "1px", background: "rgba(255,255,255,.06)", margin: "4px 0" }} />

              <div>
                Si el cliente paga una comisión del {commission}% verá:{" "}
                <strong style={{ color: "#f97316", fontSize: "15px" }}>
                  {`$${customerPrice.toFixed(2)}`}
                </strong>
              </div>

              <div>
                Si el restaurante paga la comisión del {commission}% el cliente verá:{" "}
                <strong style={{ color: "#fff", fontSize: "15px" }}>
                  {`$${examplePrice.toFixed(2)}`}
                </strong>
              </div>

              <div style={{ height: "1px", background: "rgba(255,255,255,.06)", margin: "4px 0" }} />

              <div>
                Wolf recibiría:{" "}
                <strong style={{ color: "#22c55e", fontSize: "15px", fontWeight: "700" }}>
                  {`$${wolfAmount.toFixed(2)}`}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}