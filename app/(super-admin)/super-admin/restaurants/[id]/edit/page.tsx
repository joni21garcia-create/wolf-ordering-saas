"use client";

import { useParams } from "next/navigation";
import RestaurantForm from "@/components/super-admin/restaurants/RestaurantForm";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function EditRestaurantPage() {
  const params = useParams();

  const restaurantId = params.id as string;

  return (
    <PermissionGuard permission="restaurants">
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg,#050505 0%,#0f172a 100%)",
          padding: "60px 30px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "999px",
              background:
                "rgba(59,130,246,.12)",
              border:
                "1px solid rgba(59,130,246,.2)",
              color: "#60a5fa",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            ✏️ Editar Restaurante
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "64px",
              fontWeight: "900",
              margin: 0,
            }}
          >
            Editar Restaurante
          </h1>

          <p
            style={{
              color: "#94a3b8",
              maxWidth: "700px",
              margin:
                "20px auto 0 auto",
              lineHeight: 1.8,
              fontSize: "18px",
            }}
          >
            Actualiza la información
            principal del restaurante.
            Hero, productos, pagos,
            horarios y módulos se
            administran desde
            Configuración Restaurante.
          </p>
        </div>

        {/* FORMULARIO */}

        <div
          style={{
            background:
              "rgba(17,17,17,.92)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "32px",
            padding: "40px",
            backdropFilter:
              "blur(20px)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <h2
              style={{
                color: "#fff",
                marginBottom:
                  "10px",
              }}
            >
              Datos del Restaurante
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Modifica nombre,
              propietario, ubicación,
              branding e información
              principal.
            </p>
          </div>

          <RestaurantForm
            mode="edit"
            restaurantId={
              restaurantId
            }
          />
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
}