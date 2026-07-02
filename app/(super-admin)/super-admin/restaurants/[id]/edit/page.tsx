"use client";

import { useParams } from "next/navigation";
import RestaurantForm from "@/components/super-admin/restaurants/RestaurantForm";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function EditRestaurantPage() {
  const params = useParams();
  // Blindaje: nos aseguramos de que el id sea un string o una cadena vacía
  const restaurantId = (params?.id as string) || "";

  // Blindaje preventivo: si no hay ID, no renderizamos el formulario para evitar errores de consulta
  if (!restaurantId) {
    return (
      <div style={{ color: "#fff", padding: "40px", textAlign: "center" }}>
        Cargando información del restaurante...
      </div>
    );
  }

  return (
    <PermissionGuard permission="restaurants">
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg,#050505 0%,#0f172a 100%)",
          padding: "clamp(20px, 5vw, 60px) clamp(15px, 3vw, 30px)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: "rgba(59,130,246,.12)",
                border: "1px solid rgba(59,130,246,.2)",
                color: "#60a5fa",
                fontWeight: "700",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              ✏️ Editar Restaurante
            </div>

            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(2rem, 8vw, 4rem)",
                fontWeight: "900",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Editar Restaurante
            </h1>

            <p
              style={{
                color: "#94a3b8",
                maxWidth: "600px",
                margin: "20px auto 0 auto",
                lineHeight: 1.6,
                fontSize: "clamp(1rem, 2vw, 1.125rem)",
              }}
            >
              Actualiza la información principal del restaurante. Branding, ubicación y datos de contacto.
            </p>
          </div>

          {/* FORMULARIO */}
          <div
            style={{
              background: "rgba(17,17,17,.92)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "24px",
              padding: "clamp(20px, 4vw, 40px)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 40px rgba(0,0,0,.4)",
            }}
          >
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "1.5rem" }}>
                Datos Generales
              </h2>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>
                Configuración principal del establecimiento.
              </p>
            </div>

            <RestaurantForm
              mode="edit"
              restaurantId={restaurantId}
            />
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}