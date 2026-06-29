"use client";

import { useEffect, useState } from "react";

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
  // Estado para manejar responsividad con estilos en línea
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Configurar estado inicial
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nameError = customerData.name && customerData.name.trim().length < 3;
  const phoneError = customerData.phone && customerData.phone.replace(/\D/g, "").length < 10;
  const addressError = orderType === "delivery" && customerData.address && customerData.address.trim().length < 5;
  const zoneError = orderType === "delivery" && customerData.zone && customerData.zone.trim().length < 2;

  if (!orderType) return null;

  // Estilos dinámicos basados en el tamaño de pantalla
  const containerStyle = {
    marginTop: isMobile ? "20px" : "40px",
    padding: isMobile ? "20px 16px" : "40px",
    borderRadius: isMobile ? "20px" : "30px",
    background: "rgba(255,255,255,.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)", // Soporte para Safari en iOS
    border: "1px solid rgba(255,255,255,.08)",
  };

  const inputStyle = {
    width: "100%",
    padding: isMobile ? "14px 16px" : "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.05)",
    color: "#fff",
    outline: "none",
    fontSize: isMobile ? "15px" : "16px",
    boxSizing: "border-box" as const, // Evita que el padding desborde el input en móvil
  };

  return (
    <div style={containerStyle}>
      <h2
        style={{
          color: "#fff",
          fontSize: isMobile ? "1.4rem" : "1.8rem",
          marginBottom: "8px",
        }}
      >
        {orderType === "delivery" ? "🚚 Datos de Entrega" : "🛍️ Datos para Retiro"}
      </h2>

      <p
        style={{
          color: "rgba(255,255,255,.65)",
          fontSize: isMobile ? "14px" : "16px",
          lineHeight: "1.4",
          marginBottom: isMobile ? "20px" : "30px",
        }}
      >
        {orderType === "delivery"
          ? "Completa la información para que podamos entregar tu pedido."
          : "Completa tus datos para retirar tu pedido en el local."}
      </p>

      <div
        style={{
          display: "grid",
          gap: isMobile ? "14px" : "20px",
        }}
      >
        {/* Campo: Nombre */}
        <div>
          <input
            placeholder="Nombre completo *"
            value={customerData.name || ""}
            onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
            style={{
              ...inputStyle,
              border: nameError ? "1px solid #ef4444" : inputStyle.border,
            }}
          />
          {nameError && (
            <span style={{ color: "#ef4444", fontSize: "12px", display: "block", marginTop: "6px", marginLeft: "4px" }}>
              ❌ Ingresa un nombre válido
            </span>
          )}
        </div>

        {/* Campo: Teléfono */}
        <div>
          <input
            type="tel"
            placeholder="Teléfono *"
            value={customerData.phone || ""}
            onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
            style={{
              ...inputStyle,
              border: phoneError ? "1px solid #ef4444" : inputStyle.border,
            }}
          />
          {phoneError && (
            <span style={{ color: "#ef4444", fontSize: "12px", display: "block", marginTop: "6px", marginLeft: "4px" }}>
              ❌ Teléfono inválido (mínimo 10 dígitos)
            </span>
          )}
        </div>

        {/* Campo: Email */}
        <input
          type="email"
          placeholder="Correo electrónico (opcional)"
          value={customerData.email || ""}
          onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
          style={inputStyle}
        />

        {/* Campos condicionales para Delivery */}
        {orderType === "delivery" && (
          <>
            {/* Campo: Dirección */}
            <div>
              <input
                placeholder="Dirección *"
                value={customerData.address || ""}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                style={{
                  ...inputStyle,
                  border: addressError ? "1px solid #ef4444" : inputStyle.border,
                }}
              />
              {addressError && (
                <span style={{ color: "#ef4444", fontSize: "12px", display: "block", marginTop: "6px", marginLeft: "4px" }}>
                  ❌ Ingresa una dirección válida
                </span>
              )}
            </div>

            {/* Campo: Sector */}
            <div>
              <input
                placeholder="Sector *"
                value={customerData.zone || ""}
                onChange={(e) => setCustomerData({ ...customerData, zone: e.target.value })}
                style={{
                  ...inputStyle,
                  border: zoneError ? "1px solid #ef4444" : inputStyle.border,
                }}
              />
              {zoneError && (
                <span style={{ color: "#ef4444", fontSize: "12px", display: "block", marginTop: "6px", marginLeft: "4px" }}>
                  ❌ Ingresa un sector válido
                </span>
              )}
            </div>

            {/* Referencias */}
            <textarea
              placeholder="Referencias (Ej: Casa blanca junto a la farmacia)"
              value={customerData.reference || ""}
              onChange={(e) => setCustomerData({ ...customerData, reference: e.target.value })}
              style={{
                ...inputStyle,
                minHeight: isMobile ? "80px" : "100px",
                resize: "vertical",
              }}
            />

            {/* Instrucciones */}
            <textarea
              placeholder="Instrucciones (Ej: Tocar timbre, entregar en portería...)"
              value={customerData.instructions || ""}
              onChange={(e) => setCustomerData({ ...customerData, instructions: e.target.value })}
              style={{
                ...inputStyle,
                minHeight: isMobile ? "80px" : "100px",
                resize: "vertical",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}