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

  // Mantenemos tu lógica de validación igual
  const nameError = customerData.name && customerData.name.trim().length < 3;
  const phoneError = customerData.phone && customerData.phone.replace(/\D/g, "").length < 10;
  const addressError = orderType === "delivery" && customerData.address && customerData.address.trim().length < 5;
  const zoneError = orderType === "delivery" && customerData.zone && customerData.zone.trim().length < 2;

  if (!orderType) return null;

  // Estilos base ajustables
  const inputStyle = {
    width: "100%",
    padding: isMobile ? "14px" : "18px", // Padding ligeramente menor en móvil
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.05)",
    color: "#fff",
    outline: "none",
    fontSize: "16px", // Asegura 16px para evitar zoom automático de iOS en inputs
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: isMobile ? "20px" : "40px", // Padding más compacto en móvil
        borderRadius: "24px",
        background: "rgba(255,255,255,.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "10px", fontSize: isMobile ? "22px" : "28px" }}>
        {orderType === "delivery" ? "🚚 Datos de Entrega" : "🛍️ Datos para Retiro"}
      </h2>

      <p style={{ color: "rgba(255,255,255,.65)", marginBottom: "25px", fontSize: "14px" }}>
        {orderType === "delivery"
          ? "Completa la información para recibir tu pedido."
          : "Completa tus datos para retirar en el local."}
      </p>

      <div style={{ display: "grid", gap: "15px" }}>
        {/* Nombre */}
        <input
          placeholder="Nombre completo *"
          value={customerData.name || ""}
          onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
          style={{ ...inputStyle, border: nameError ? "1px solid #ef4444" : inputStyle.border }}
        />
        {nameError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Nombre inválido</span>}

        {/* Teléfono */}
        <input
          type="tel"
          placeholder="Teléfono *"
          value={customerData.phone || ""}
          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
          style={{ ...inputStyle, border: phoneError ? "1px solid #ef4444" : inputStyle.border }}
        />
        {phoneError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Teléfono inválido</span>}

        {/* Correo */}
        <input
          type="email"
          placeholder="Correo electrónico (opcional)"
          value={customerData.email || ""}
          onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
          style={inputStyle}
        />

        {orderType === "delivery" && (
          <>
            <input
              placeholder="Dirección *"
              value={customerData.address || ""}
              onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
              style={{ ...inputStyle, border: addressError ? "1px solid #ef4444" : inputStyle.border }}
            />
            {addressError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Dirección inválida</span>}

            <input
              placeholder="Sector *"
              value={customerData.zone || ""}
              onChange={(e) => setCustomerData({ ...customerData, zone: e.target.value })}
              style={{ ...inputStyle, border: zoneError ? "1px solid #ef4444" : inputStyle.border }}
            />
            {zoneError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Sector inválido</span>}

            <textarea
              placeholder="Referencia: Casa blanca junto a la farmacia"
              value={customerData.reference || ""}
              onChange={(e) => setCustomerData({ ...customerData, reference: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
            <textarea
              placeholder="Instrucciones: Tocar timbre..."
              value={customerData.instructions || ""}
              onChange={(e) => setCustomerData({ ...customerData, instructions: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
          </>
        )}
      </div>
    </div>
  );
}