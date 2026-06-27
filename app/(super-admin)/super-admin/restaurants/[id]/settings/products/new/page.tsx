"use client";

import { useParams } from "next/navigation";

import ProductForm from "@/components/super-admin/products/ProductForm";

export default function NewProductPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right,#331300 0%,#050505 45%)",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "52px",
                fontWeight: "900",
              }}
            >
              🍔 Nuevo Producto
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "10px",
                fontSize: "18px",
              }}
            >
              Agrega productos al menú
              digital del restaurante.
            </p>
          </div>

          <div
            style={{
              background:
                "rgba(249,115,22,.15)",
              color:
                "#f97316",
              padding:
                "12px 20px",
              borderRadius:
                "999px",
              border:
                "1px solid rgba(249,115,22,.25)",
              fontWeight:
                "700",
            }}
          >
            Wolf Ordering
          </div>
        </div>

        {/* Stats */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <InfoCard
            title="📦 Inventario"
            value="Nuevo Item"
          />

          <InfoCard
            title="📸 Imagen"
            value="Requerida"
          />

          <InfoCard
            title="🏷 Categoría"
            value="Asignar"
          />

          <InfoCard
            title="🟢 Estado"
            value="Activo"
          />
        </div>

        {/* Form */}

        <div
          style={{
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius:
              "30px",
            padding: "30px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,.45)",
          }}
        >
          <ProductForm
            mode="create"
            restaurantId={
              restaurantId
            }
          />
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  value,
}: any) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#141414,#090909)",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius:
          "24px",
        padding: "24px",
        boxShadow:
          "0 15px 40px rgba(0,0,0,.35)",
      }}
    >
      <p
        style={{
          color: "#9ca3af",
          marginBottom: "12px",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          color: "#fff",
          fontSize: "30px",
          fontWeight: "800",
        }}
      >
        {value}
      </h2>
    </div>
  );
}