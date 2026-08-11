"use client";

import { useState } from "react";

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

  // CAMBIO ÚNICO:
  // Ambos formularios empiezan cerrados.
  const [openContact, setOpenContact] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);

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
        padding: "18px",
        borderRadius: "24px",
        background:
          "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.018))",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow:
          "0 20px 55px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.035)",
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

        .wolf-form-section {
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012));
          overflow: hidden;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.025),
            0 10px 28px rgba(0,0,0,.12);
        }

        .wolf-form-section-header {
          width: 100%;
          border: 0;
          background: transparent;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 17px;
          cursor: pointer;
          text-align: left;
        }

        .wolf-form-section-header:hover {
          background: rgba(255,255,255,.025);
        }

        .wolf-form-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .wolf-form-section-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(249,115,22,.10);
          border: 1px solid rgba(249,115,22,.14);
          flex: 0 0 auto;
        }

        .wolf-form-chevron {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #a1a1aa;
          background: rgba(255,255,255,.035);
          transition: transform .2s ease, color .2s ease, background .2s ease;
        }

        .wolf-form-chevron.open {
          transform: rotate(180deg);
          color: #f97316;
          background: rgba(249,115,22,.08);
        }

        .wolf-form-section-body {
          padding: 0 16px 16px;
          animation: wolfFormOpen .18s ease-out;
        }

        @keyframes wolfFormOpen {
          from {
            opacity: .35;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wolf-form-label {
          display: block;
          color: #a1a1aa;
          font-size: 11px;
          font-weight: 700;
          margin: 0 0 7px 3px;
          letter-spacing: .35px;
          text-transform: uppercase;
        }

        @media (max-width: 639px) {
          .wolf-form-section-body {
            padding: 0 13px 13px;
          }

          .wolf-form-section-header {
            padding: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wolf-form-section-body,
          .wolf-form-chevron {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <h2
        style={{
          color: "#fff",
          fontSize: "clamp(20px, 4vw, 24px)",
          fontWeight: "700",
          marginBottom: "8px",
          marginTop: 0,
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
          marginTop: 0,
        }}
      >
        {orderType === "delivery"
          ? "Completa la información para que podamos entregar tu pedido."
          : "Completa tus datos para retirar tu pedido en el local."}
      </p>

      <div className="wolf-form-container">
        <section className="wolf-form-section">
          <button
            type="button"
            className="wolf-form-section-header"
            onClick={() => setOpenContact((value) => !value)}
            aria-expanded={openContact}
          >
            <span className="wolf-form-section-title">
              <span className="wolf-form-section-icon">
                👤
              </span>

              <span>
                <strong style={{ display: "block", fontSize: 14 }}>
                  Datos personales
                </strong>

                <span style={{ color: "#71717a", fontSize: 11 }}>
                  Nombre, teléfono y correo
                </span>
              </span>
            </span>

            <span
              className={`wolf-form-chevron ${
                openContact ? "open" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {openContact && (
            <div className="wolf-form-section-body">
              <div className="wolf-form-container">
                <div>
                  <label className="wolf-form-label">
                    Nombre completo *
                  </label>

                  <input
                    placeholder="Ej. Juan Pérez"
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
                        fontSize: 12,
                        marginTop: 6,
                        paddingLeft: 4,
                      }}
                    >
                      ❌ Ingresa un nombre válido
                    </div>
                  )}
                </div>

                <div>
                  <label className="wolf-form-label">
                    Teléfono *
                  </label>

                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="Ej. 099 123 4567"
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
                        fontSize: 12,
                        marginTop: 6,
                        paddingLeft: 4,
                      }}
                    >
                      ❌ Teléfono inválido
                    </div>
                  )}
                </div>

                <div>
                  <label className="wolf-form-label">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    inputMode="email"
                    placeholder="Opcional"
                    value={customerData.email || ""}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        email: e.target.value,
                      })
                    }
                    style={{
                      ...dynamicInputStyle,
                      border: "1px solid rgba(255,255,255,.08)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {orderType === "delivery" && (
          <section className="wolf-form-section">
            <button
              type="button"
              className="wolf-form-section-header"
              onClick={() => setOpenDelivery((value) => !value)}
              aria-expanded={openDelivery}
            >
              <span className="wolf-form-section-title">
                <span className="wolf-form-section-icon">
                  🚚
                </span>

                <span>
                  <strong style={{ display: "block", fontSize: 14 }}>
                    Datos de entrega
                  </strong>

                  <span style={{ color: "#71717a", fontSize: 11 }}>
                    Dirección e indicaciones
                  </span>
                </span>
              </span>

              <span
                className={`wolf-form-chevron ${
                  openDelivery ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openDelivery && (
              <div className="wolf-form-section-body">
                <div className="wolf-form-container">
                  <div>
                    <label className="wolf-form-label">
                      Dirección *
                    </label>

                    <input
                      placeholder="Calle, número, edificio..."
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
                          fontSize: 12,
                          marginTop: 6,
                          paddingLeft: 4,
                        }}
                      >
                        ❌ Ingresa una dirección válida
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="wolf-form-label">
                      Sector *
                    </label>

                    <input
                      placeholder="Ej. Centro, Norte..."
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
                          fontSize: 12,
                          marginTop: 6,
                          paddingLeft: 4,
                        }}
                      >
                        ❌ Ingresa un sector válido
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="wolf-form-label">
                      Referencia
                    </label>

                    <textarea
                      placeholder="Casa blanca junto a la farmacia..."
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
                        minHeight: 80,
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  <div>
                    <label className="wolf-form-label">
                      Instrucciones
                    </label>

                    <textarea
                      placeholder="Tocar timbre, entregar en portería..."
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
                        minHeight: 80,
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {orderType === "pickup" && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: "rgba(249,115,22,.055)",
              border: "1px solid rgba(249,115,22,.12)",
              color: "#a1a1aa",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            🛍️ Para retiro solo necesitamos tus datos personales.
          </div>
        )}
      </div>
    </div>
  );
}