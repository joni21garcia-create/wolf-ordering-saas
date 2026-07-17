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
        background: "radial-gradient(circle at top right, #240b00 0%, #050505 60%)",
        padding: "clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px)",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* 🛠️ Estilos globales inyectados para inputs y selects más premium */}
      <style jsx global>{`
        select, option, input, textarea {
          background-color: #0d0d0d !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          transition: all 0.2s ease !important;
        }
        select:focus, input:focus, textarea:focus {
          outline: none !important;
          border-color: #f97316 !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
        }
        /* Estilizar el dropdown del select en navegadores */
        select option {
          background: #0d0d0d !important;
          color: #fff !important;
        }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* HEADER RESPONSIVO Y PREMIUM */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "16px", 
          marginBottom: "35px",
          paddingBottom: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            flexWrap: "wrap", 
            gap: "14px" 
          }}>
            <BackToSettings restaurantId={restaurantId} />
            <div style={{ 
              background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.03) 100%)", 
              color: "#f97316", 
              padding: "8px 18px", 
              borderRadius: "100px", 
              fontSize: "11px", 
              fontWeight: "800",
              letterSpacing: "1.5px",
              border: "1px solid rgba(249,115,22,0.2)",
              textTransform: "uppercase"
            }}>
              ✨ Wolf Ordering Creator
            </div>
          </div>
          
          <div style={{ marginTop: "8px" }}>
            <h1 style={{ 
              margin: "0 0 8px 0", 
              color: "#fff", 
              fontSize: "clamp(24px, 5vw, 42px)", 
              fontWeight: "950",
              letterSpacing: "-0.5px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{ filter: "drop-shadow(0 0 10px rgba(249,115,22,0.3))" }}>🍔</span> Nuevo Producto
            </h1>
            <p style={{ color: "#9ca3af", margin: 0, fontSize: "clamp(14px, 2vw, 16px)", fontWeight: "400" }}>
              Diseña, configura y lanza un nuevo plato directamente en tu menú digital.
            </p>
          </div>
        </div>

        {/* CONTENEDOR DE TARJETAS DE INFORMACIÓN (RESPONSIVO EN GRID) */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "16px", 
          marginBottom: "35px" 
        }}>
          <InfoCard icon="📦" title="Inventario" value="Disponible" color="#10b981" />
          <InfoCard icon="🖼️" title="Imagen" value="Requerida" color="#f59e0b" />
          <InfoCard icon="📁" title="Categoría" value="Asignar" color="#3b82f6" />
          <InfoCard icon="⚡" title="Estado" value="Visible" color="#10b981" />
        </div>

        {/* CONTENEDOR DEL FORMULARIO CON GLASSMORPHISM PREMIUM */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(15, 15, 15, 0.7) 0%, rgba(5, 5, 5, 0.85) 100%)", 
          border: "1px solid rgba(255, 255, 255, 0.05)", 
          borderRadius: "28px", 
          padding: "clamp(16px, 4vw, 35px)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.03)"
        }}>
          {/* Conservamos intacta la llamada a tu componente y props originales */}
          <ProductForm mode="create" restaurantId={restaurantId} />
        </div>
      </div>
    </main>
  );
}

interface InfoCardProps {
  icon: string;
  title: string;
  value: string;
  color?: string;
}

function InfoCard({ icon, title, value, color = "#fff" }: InfoCardProps) {
  return (
    <div style={{ 
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.03) 100%)", 
      border: "1px solid rgba(255, 255, 255, 0.04)", 
      borderRadius: "20px", 
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
    }}>
      <div style={{
        fontSize: "24px",
        background: "rgba(255,255,255,0.03)",
        width: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.03)"
      }}>
        {icon}
      </div>
      <div>
        <p style={{ 
          color: "#8e9196", 
          margin: "0 0 4px 0", 
          fontSize: "11px", 
          fontWeight: "700", 
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          {title}
        </p>
        <h2 style={{ 
          margin: 0, 
          color: color, 
          fontSize: "16px", 
          fontWeight: "800",
          letterSpacing: "-0.2px"
        }}>
          {value}
        </h2>
      </div>
    </div>
  );
}