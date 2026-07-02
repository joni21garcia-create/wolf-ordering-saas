"use client";

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
  
  // Estilo de inputs optimizado para móvil (fontSize 16px evita zoom en iOS)
  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.05)",
    color: "#fff",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box" as const,
  };

  const nameError = customerData.name && customerData.name.trim().length < 3;
  const phoneError = customerData.phone && customerData.phone.replace(/\D/g, "").length < 10;
  const addressError = orderType === "delivery" && customerData.address && customerData.address.trim().length < 5;
  const zoneError = orderType === "delivery" && customerData.zone && customerData.zone.trim().length < 2;

  if (!orderType) return null;

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "24px", // Reducido para mejor ajuste en móvil
        borderRadius: "24px",
        background: "rgba(255,255,255,.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "8px", fontSize: "20px" }}>
        {orderType === "delivery" ? "🚚 Datos de Entrega" : "🛍️ Datos para Retiro"}
      </h2>

      <p style={{ color: "rgba(255,255,255,.65)", marginBottom: "25px", fontSize: "14px" }}>
        {orderType === "delivery" 
          ? "Completa la información para la entrega." 
          : "Completa tus datos para retirar en local."}
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        {/* Nombre */}
        <input
          placeholder="Nombre completo *"
          value={customerData.name || ""}
          onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
          style={{ ...inputStyle, border: nameError ? "1px solid #ef4444" : inputStyle.border }}
        />
        {nameError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Ingresa un nombre válido</span>}

        {/* Teléfono */}
        <input
          placeholder="Teléfono *"
          type="tel"
          inputMode="numeric"
          value={customerData.phone || ""}
          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
          style={{ ...inputStyle, border: phoneError ? "1px solid #ef4444" : inputStyle.border }}
        />
        {phoneError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Teléfono inválido</span>}

        {/* Correo */}
        <input
          placeholder="Correo electrónico (opcional)"
          type="email"
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
            {addressError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Dirección muy corta</span>}

            <input
              placeholder="Sector *"
              value={customerData.zone || ""}
              onChange={(e) => setCustomerData({ ...customerData, zone: e.target.value })}
              style={{ ...inputStyle, border: zoneError ? "1px solid #ef4444" : inputStyle.border }}
            />
            {zoneError && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "-10px" }}>❌ Sector obligatorio</span>}

            <textarea
              placeholder="Referencia (Ej: Casa blanca...)"
              value={customerData.reference || ""}
              onChange={(e) => setCustomerData({ ...customerData, reference: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            />

            <textarea
              placeholder="Instrucciones (Ej: Tocar timbre...)"
              value={customerData.instructions || ""}
              onChange={(e) => setCustomerData({ ...customerData, instructions: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            />
          </>
        )}
      </div>
    </div>
  );
}