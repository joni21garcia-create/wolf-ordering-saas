"use client";

import { useState, useEffect } from "react";

interface Props {
  orderType: "delivery" | "pickup" | null;
  customerData: any;
  setCustomerData: (data: any) => void;
  primaryColor?: string;
}

export default function CustomerForm({
  orderType,
  customerData,
  setCustomerData,
  primaryColor = "#f97316",
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nameError = customerData.name && customerData.name.trim().length < 3;
  const phoneError = customerData.phone && customerData.phone.replace(/\D/g, "").length < 10;
  const addressError = orderType === "delivery" && customerData.address && customerData.address.trim().length < 5;
  const zoneError = orderType === "delivery" && customerData.zone && customerData.zone.trim().length < 2;

  if (!orderType) return null;

  const inputStyle = {
    width: "100%",
    padding: "12px", // Ligeramente más compacto
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.05)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        // MÁRGENES EN 0 para que el padre decida dónde colocarlo
        marginTop: "0",
        marginBottom: "0",
        padding: "20px",
        borderRadius: "16px", // Más compacto
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "8px", fontSize: "18px", fontWeight: "700" }}>
        {orderType === "delivery" ? "🚚 Datos de Entrega" : "🛍️ Datos para Retiro"}
      </h2>

      <p style={{ color: "rgba(255,255,255,.5)", marginBottom: "16px", fontSize: "12px" }}>
        {orderType === "delivery"
          ? "Completa la información para recibir tu pedido."
          : "Completa tus datos para retirar en el local."}
      </p>

      <div style={{ display: "grid", gap: "10px" }}>
        <input
          placeholder="Nombre completo *"
          value={customerData.name || ""}
          onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
          style={{ ...inputStyle, border: nameError ? "1px solid #ef4444" : inputStyle.border }}
        />
        <input
          type="tel"
          placeholder="Teléfono *"
          value={customerData.phone || ""}
          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
          style={{ ...inputStyle, border: phoneError ? "1px solid #ef4444" : inputStyle.border }}
        />
        
        {orderType === "delivery" && (
          <>
            <input
              placeholder="Dirección *"
              value={customerData.address || ""}
              onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
              style={{ ...inputStyle, border: addressError ? "1px solid #ef4444" : inputStyle.border }}
            />
            <input
              placeholder="Sector *"
              value={customerData.zone || ""}
              onChange={(e) => setCustomerData({ ...customerData, zone: e.target.value })}
              style={{ ...inputStyle, border: zoneError ? "1px solid #ef4444" : inputStyle.border }}
            />
            <textarea
              placeholder="Referencia (opcional)"
              value={customerData.reference || ""}
              onChange={(e) => setCustomerData({ ...customerData, reference: e.target.value })}
              style={{ ...inputStyle, minHeight: "50px", resize: "none" }}
            />
          </>
        )}
      </div>
    </div>
  );
}