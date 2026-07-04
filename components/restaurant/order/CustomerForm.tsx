"use client";

interface Props {
  orderType:
    | "delivery"
    | "pickup"
    | null;

  customerData: any;

  setCustomerData: (
    data: any
  ) => void;

  primaryColor?: string;
}

export default function CustomerForm({
  orderType,
  customerData,
  setCustomerData,
  primaryColor = "#f97316",
}: Props) {

  const nameError =
    customerData.name &&
    customerData.name.trim().length < 3;

  const phoneError =
    customerData.phone &&
    customerData.phone.replace(
      /\D/g,
      ""
    ).length < 10;

  const addressError =
    orderType === "delivery" &&
    customerData.address &&
    customerData.address.trim().length < 5;

  const zoneError =
    orderType === "delivery" &&
    customerData.zone &&
    customerData.zone.trim().length < 2;


  if (!orderType) return null;

  // Estilo base dinámico y elástico interno para evitar desbordamientos
  const dynamicInputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    background: "rgba(255,255,255,.05)",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "24px",
        borderRadius: "24px",
        background: "rgba(255,255,255,.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.08)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* ESTILOS DE RESPONSIVIDAD COMPLEMENTARIOS */}
      <style>{`
        .wolf-form-container {
          display: grid;
          gap: 16px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .wolf-form-container {
            gap: 20px;
          }
        }
      `}</style>

      <h2
        style={{
          color: "#fff",
          fontSize: "clamp(20px, 4vw, 24px)",
          fontWeight: "700",
          marginBottom: "8px",
          marginTop: 0
        }}
      >
        {orderType === "delivery"
          ? "🚚 Datos de Entrega"
          : "🛍️ Datos para Retiro"}
      </h2>

      <p
        style={{
          color: "rgba(255,255,255,.65)",
          fontSize: "14px",
          lineHeight: "1.5",
          marginBottom: "24px",
          marginTop: 0
        }}
      >
        {orderType === "delivery"
          ? "Completa la información para que podamos entregar tu pedido."
          : "Completa tus datos para retirar tu pedido en el local."}
      </p>

      <div className="wolf-form-container">
        <div>
          <input
            placeholder="Nombre completo *"
            value={customerData.name || ""}
            onChange={(e) =>
              setCustomerData({
                ...customerData,
                name: e.target.value,
              })
            }
            style={{
              ...dynamicInputStyle,
              border: nameError
                ? "1px solid #ef4444"
                : "1px solid rgba(255,255,255,.08)",
            }}
          />
          {nameError && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "12px",
                marginTop: "6px",
                paddingLeft: "4px"
              }}
            >
              ❌ Ingresa un nombre válido
            </div>
          )}
        </div>

        <div>
          <input
            placeholder="Teléfono *"
            value={customerData.phone || ""}
            onChange={(e) =>
              setCustomerData({
                ...customerData,
                phone: e.target.value,
              })
            }
            style={{
              ...dynamicInputStyle,
              border: phoneError
                ? "1px solid #ef4444"
                : "1px solid rgba(255,255,255,.08)",
            }}
          />
          {phoneError && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "12px",
                marginTop: "6px",
                paddingLeft: "4px"
              }}
            >
              ❌ Teléfono inválido
            </div>
          )}
        </div>

        <input
          placeholder="Correo electrónico (opcional)"
          value={customerData.email || ""}
          onChange={(e) =>
            setCustomerData({
              ...customerData,
              email: e.target.value,
            })
          }
          style={{
            ...dynamicInputStyle,
            border: "1px solid rgba(255,255,255,.08)"
          }}
        />

        {orderType === "delivery" && (
          <>
            <div>
              <input
                placeholder="Dirección *"
                value={customerData.address || ""}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    address: e.target.value,
                  })
                }
                style={{
                  ...dynamicInputStyle,
                  border: addressError
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,.08)",
                }}
              />
              {addressError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "6px",
                    paddingLeft: "4px"
                  }}
                >
                  ❌ Ingresa una dirección válida
                </div>
              )}
            </div>

            <div>
              <input
                placeholder="Sector *"
                value={customerData.zone || ""}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    zone: e.target.value,
                  })
                }
                style={{
                  ...dynamicInputStyle,
                  border: zoneError
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,.08)",
                }}
              />
              {zoneError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "6px",
                    paddingLeft: "4px"
                  }}
                >
                  ❌ Ingresa un sector válido
                </div>
              )}
            </div>

            <textarea
              placeholder="Notas de Referencia (Ej: Casa blanca junto a la farmacia)"
              value={customerData.reference || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  reference: e.target.value,
                })
              }
              style={{
                ...dynamicInputStyle,
                border: "1px solid rgba(255,255,255,.08)",
                minHeight: "90px",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />

            <textarea
              placeholder="Instrucciones de entrega (Ej: Tocar timbre, entregar en portería...)"
              value={customerData.instructions || ""}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  instructions: e.target.value,
                })
              }
              style={{
                ...dynamicInputStyle,
                border: "1px solid rgba(255,255,255,.08)",
                minHeight: "90px",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}