"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/super-admin/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const productId = params.productId as string;

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        background: "radial-gradient(circle at top right, #240b00 0%, #050505 60%)",
        padding: "clamp(12px, 3vw, 40px) clamp(8px, 2vw, 24px)",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* 🛠️ Estilos globales blindados para inputs, selects y formularios hijos */}
      <style jsx global>{`
        *, *:before, *:after {
          box-sizing: border-box !important;
        }
        select, option, input, textarea {
          background-color: #0d0d0d !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          transition: all 0.2s ease !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        input[type="checkbox"], input[type="radio"] {
          width: auto !important;
        }
        select:focus, input:focus, textarea:focus {
          outline: none !important;
          border-color: #f97316 !important;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15) !important;
        }
        select option {
          background: #0d0d0d !important;
          color: #fff !important;
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* HEADER RESPONSIVO Y PREMIUM */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: "20px",
          marginBottom: "35px",
          paddingBottom: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ width: "100%", maxWidth: "700px" }}>
            <h1 style={{ 
              margin: "0 0 8px 0", 
              color: "#fff", 
              fontSize: "clamp(24px, 5vw, 46px)", 
              fontWeight: "950",
              letterSpacing: "-0.5px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              wordBreak: "break-word"
            }}>
              <span style={{ filter: "drop-shadow(0 0 10px rgba(249,115,22,0.3))" }}>✏️</span> Editar Producto
            </h1>
            <p style={{ color: "#9ca3af", margin: 0, fontSize: "clamp(13px, 2vw, 16px)", fontWeight: "400", wordBreak: "break-word" }}>
              Modifica información, imágenes, precios y configuración del producto en tiempo real.
            </p>
          </div>

          <div style={{ 
            background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.03) 100%)", 
            color: "#f97316", 
            padding: "10px 22px", 
            borderRadius: "100px", 
            fontSize: "12px", 
            fontWeight: "800",
            letterSpacing: "1.5px",
            border: "1px solid rgba(249,115,22,0.2)",
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          }}>
            Wolf Ordering
          </div>
        </div>

        {/* CONTENEDOR DE TARJETAS DE INFORMACIÓN (RESPONSIVO EN GRID) */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
          gap: "16px", 
          marginBottom: "35px",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <InfoCard icon="✏️" title="Acción" value="Editar" color="#f59e0b" />
          <InfoCard icon="📦" title="Producto" value="Activo" color="#10b981" />
          <InfoCard icon="🖼️" title="Imagen" value="Disponible" color="#3b82f6" />
          <InfoCard icon="⚡" title="Estado" value="Online" color="#10b981" />
        </div>

        {/* CONTENEDOR DEL FORMULARIO CON GLASSMORPHISM PREMIUM */}
        <div style={{ 
          background: "linear-gradient(135deg, rgba(15, 15, 15, 0.7) 0%, rgba(5, 5, 5, 0.85) 100%)", 
          border: "1px solid rgba(255, 255, 255, 0.05)", 
          borderRadius: "28px", 
          padding: "clamp(12px, 3vw, 35px)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.03)",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden"
        }}>
          {/* Conservamos la lógica e IDs originales intactos */}
          <ProductForm
            mode="edit"
            restaurantId={restaurantId}
            productId={productId}
          />
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
      padding: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      minWidth: 0
    }}>
      {/* Sutil halo de luz en la esquina */}
      <div style={{
        position: "absolute",
        right: "-20px",
        top: "-20px",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: `${color}05`,
        filter: "blur(15px)"
      }} />

      <div style={{
        fontSize: "20px",
        background: "rgba(255,255,255,0.03)",
        width: "42px",
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.03)",
        zIndex: 1,
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ zIndex: 1, minWidth: 0, overflow: "hidden" }}>
        <p style={{ 
          color: "#8e9196", 
          margin: "0 0 2px 0", 
          fontSize: "10px", 
          fontWeight: "700", 
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {title}
        </p>
        <h2 style={{ 
          margin: 0, 
          color: color, 
          fontSize: "14px", 
          fontWeight: "800",
          letterSpacing: "-0.2px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {value}
        </h2>
      </div>
    </div>
  );
}