"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/super-admin/products/ProductForm";
import BackToSettings from "@/components/admin/BackToSettings";

export default function NewProductPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top right, #331300 0%, #050505 45%)",
        padding: "20px",
      }}
    >
      {/* Estilos para corregir el comportamiento de los selectores en image_4a5972.jpg */}
      <style jsx global>{`
        select, option, input, textarea {
          background-color: #111 !important;
          color: #fff !important;
          border-color: #333 !important;
        }
        /* Esto asegura que al abrir el desplegable, el fondo sea oscuro */
        select:focus {
          outline: 2px solid #f97316 !important;
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "10px", 
          marginBottom: "40px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <BackToSettings restaurantId={restaurantId} />
            <div style={{ 
              background: "rgba(249,115,22,0.1)", 
              color: "#f97316", 
              padding: "6px 16px", 
              borderRadius: "50px", 
              fontSize: "12px", 
              fontWeight: "700",
              letterSpacing: "0.5px"
            }}>
              WOLF ORDERING
            </div>
          </div>
          
          <h1 style={{ margin: 0, color: "#fff", fontSize: "clamp(28px, 6vw, 48px)", fontWeight: "900" }}>
            🍔 Nuevo Producto
          </h1>
          <p style={{ color: "#9ca3af", margin: 0, fontSize: "16px" }}>
            Carga los detalles de tu nuevo plato al menú.
          </p>
        </div>

        {/* STATS */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "15px", 
          marginBottom: "40px" 
        }}>
          <InfoCard title="Inventario" value="Nuevo" />
          <InfoCard title="Imagen" value="Requerida" />
          <InfoCard title="Categoría" value="Seleccionar" />
          <InfoCard title="Estado" value="Activo" />
        </div>

        {/* FORM CONTAINER */}
        <div style={{ 
          background: "rgba(10, 10, 10, 0.6)", 
          border: "1px solid rgba(255, 255, 255, 0.05)", 
          borderRadius: "24px", 
          padding: "24px",
          backdropFilter: "blur(10px)"
        }}>
          <ProductForm mode="create" restaurantId={restaurantId} />
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ 
      background: "rgba(255, 255, 255, 0.02)", 
      border: "1px solid rgba(255, 255, 255, 0.05)", 
      borderRadius: "20px", 
      padding: "20px" 
    }}>
      <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
        {title}
      </p>
      <h2 style={{ margin: 0, color: "#fff", fontSize: "20px", fontWeight: "700" }}>
        {value}
      </h2>
    </div>
  );
}