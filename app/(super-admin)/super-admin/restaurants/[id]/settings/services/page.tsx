"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ServicesPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [settings, setSettings] =
    useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings =
    async () => {
      const { data } =
        await supabase
          .from(
            "restaurant_delivery_settings"
          )
          .select("*")
          .eq(
            "restaurant_id",
            restaurantId
          )
          .maybeSingle();

      setSettings({
        delivery_mode: "fixed",
        ...data,
      });

      setLoading(false);
    };

  const saveSettings =
    async () => {
      try {
        setSaving(true);

        const { error } =
          await supabase
            .from(
              "restaurant_delivery_settings"
            )
            .update({
              delivery_enabled:
                settings.delivery_enabled,

              pickup_enabled:
                settings.pickup_enabled,

              delivery_mode:
                settings.delivery_mode,

              delivery_radius_km:
                settings.delivery_radius_km,

              delivery_fee:
                settings.delivery_fee,

              minimum_order:
                settings.minimum_order,

              free_delivery_enabled:
                settings.free_delivery_enabled,

              free_delivery_minimum:
                settings.free_delivery_minimum,

              preparation_time:
                settings.preparation_time,

              delivery_time:
                settings.delivery_time,
            })
            .eq(
              "restaurant_id",
              restaurantId
            );

        if (error) {
          console.error(error);

          alert(
            "Error guardando configuración"
          );

          return;
        }

        alert(
          "Configuración guardada"
        );
      } finally {
        setSaving(false);
      }
    };

  if (
    loading ||
    !settings
  ) {
    return (
      <main
        style={{
          padding: "40px",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          fontSize: "16px",
          fontWeight: 500,
        }}
      >
        Cargando configuración...
      </main>
    );
  }

  return (
    <PermissionGuard permission="services">
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 40px)",
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              marginBottom: "14px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            <BackToSettings restaurantId={restaurantId} />
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span>Servicios</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: "800",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Delivery & Pickup
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "600px",
              marginTop: "10px",
              lineHeight: 1.6,
              fontSize: "15px",
            }}
          >
            Configura las modalidades de entrega y despacho disponibles para tus clientes.
          </p>
        </div>

        {/* TOGGLES ACTIVACIÓN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* DELIVERY CARD */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              border: settings.delivery_enabled 
                ? "1px solid rgba(249,115,22,0.3)" 
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "24px",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🚚</div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px 0" }}>Delivery</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 20px 0" }}>
              Permite envíos directos al domicilio del cliente.
            </p>

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                cursor: "pointer",
                padding: "10px 14px",
                borderRadius: "12px",
                background: settings.delivery_enabled ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.03)",
                width: "fit-content",
                fontSize: "14px",
                fontWeight: 600,
                color: settings.delivery_enabled ? "#f97316" : "rgba(255,255,255,0.6)",
              }}
            >
              <input
                type="checkbox"
                checked={settings.delivery_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    delivery_enabled: e.target.checked,
                  })
                }
                style={{ accentColor: "#f97316", width: "16px", height: "16px" }}
              />
              <span>{settings.delivery_enabled ? "Activado" : "Desactivado"}</span>
            </label>
          </div>

          {/* PICKUP CARD */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              border: settings.pickup_enabled 
                ? "1px solid rgba(249,115,22,0.3)" 
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "24px",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏪</div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px 0" }}>Pickup</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 20px 0" }}>
              Habilita el retiro de pedidos directamente en tu local.
            </p>

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                cursor: "pointer",
                padding: "10px 14px",
                borderRadius: "12px",
                background: settings.pickup_enabled ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.03)",
                width: "fit-content",
                fontSize: "14px",
                fontWeight: 600,
                color: settings.pickup_enabled ? "#f97316" : "rgba(255,255,255,0.6)",
              }}
            >
              <input
                type="checkbox"
                checked={settings.pickup_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pickup_enabled: e.target.checked,
                  })
                }
                style={{ accentColor: "#f97316", width: "16px", height: "16px" }}
              />
              <span>{settings.pickup_enabled ? "Activado" : "Desactivado"}</span>
            </label>
          </div>
        </div>

        {/* PARÁMETROS GENERALES */}
        <div
          style={{
            background: "rgba(255,255,255,0.01)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "24px",
            padding: "clamp(18px, 4vw, 30px)",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginTop: 0, marginBottom: "20px", letterSpacing: "-0.01em" }}>
            Configuración de Tasas y Tiempos
          </h2>

          {/* MÉTODOS DE CÁLCULO */}
          <div
            style={{
              marginBottom: "24px",
              padding: "18px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "14px", fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              Método de cálculo del Delivery
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="deliveryMode"
                  checked={settings.delivery_mode === "fixed"}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      delivery_mode: "fixed",
                    })
                  }
                  style={{ accentColor: "#f97316", width: "16px", height: "16px" }}
                />
                <span>💰 Tarifa fija estándar</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="deliveryMode"
                  checked={settings.delivery_mode === "manual"}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      delivery_mode: "manual",
                    })
                  }
                  style={{ accentColor: "#f97316", width: "16px", height: "16px" }}
                />
                <span>📍 Delivery Manual coordinado por WhatsApp</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0.35, fontSize: "14px" }}>
                <input type="radio" disabled style={{ width: "16px", height: "16px" }} />
                <span>📏 Tarifa por distancia (Próximamente)</span>
              </label>
            </div>
          </div>

          {/* RETROALIMENTACIÓN DE MODO MANUAL */}
          {settings.delivery_mode === "manual" && (
            <div
              style={{
                background: "rgba(37,211,102,0.06)",
                border: "1px solid rgba(37,211,102,0.2)",
                borderRadius: "16px",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <h4 style={{ marginTop: 0, marginBottom: "6px", color: "#25D366", fontSize: "15px", fontWeight: 700 }}>
                📍 Modo Manual Activo
              </h4>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontSize: "13.5px", margin: 0 }}>
                El costo del envío se omitirá en el checkout inicial. El cliente compartirá su ubicación exacta mediante WhatsApp y el comercio le indicará la tasa final.
              </p>
            </div>
          )}

          {/* GRID DE ENTRADAS FORMULARIO */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {settings.delivery_mode === "fixed" && (
              <InputCard
                label="Costo Delivery ($)"
                value={settings.delivery_fee}
                onChange={(value: string) =>
                  setSettings({
                    ...settings,
                    delivery_fee: value,
                  })
                }
              />
            )}

            <InputCard
              label="Radio Cobertura (km)"
              value={settings.delivery_radius_km}
              onChange={(value: string) =>
                setSettings({
                  ...settings,
                  delivery_radius_km: value,
                })
              }
            />

            <InputCard
              label="Pedido mínimo ($)"
              value={settings.minimum_order}
              onChange={(value: string) =>
                setSettings({
                  ...settings,
                  minimum_order: value,
                })
              }
            />

            <InputCard
              label="Tiempo preparación (min)"
              value={settings.preparation_time}
              onChange={(value: string) =>
                setSettings({
                  ...settings,
                  preparation_time: value,
                })
              }
            />

            <InputCard
              label="Tiempo entrega (min)"
              value={settings.delivery_time}
              onChange={(value: string) =>
                setSettings({
                  ...settings,
                  delivery_time: value,
                })
              }
            />
          </div>
        </div>

        {/* DELIVERY GRATIS */}
        <div
          style={{
            background: "rgba(255,255,255,0.01)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "24px",
            padding: "clamp(18px, 4vw, 30px)",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginTop: 0, marginBottom: "14px" }}>
            🎁 Promoción Delivery Gratis
          </h2>

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: settings.free_delivery_enabled ? "20px" : "0px",
              cursor: "pointer",
              fontSize: "14px",
              color: "rgba(255,255,255,0.9)",
              width: "fit-content",
            }}
          >
            <input
              type="checkbox"
              checked={settings.free_delivery_enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  free_delivery_enabled: e.target.checked,
                })
              }
              style={{ accentColor: "#f97316", width: "16px", height: "16px" }}
            />
            Ofrecer envío gratuito por compras superiores a un monto mínimo
          </label>

          {settings.free_delivery_enabled && (
            <div style={{ maxWidth: "280px" }}>
              <InputCard
                label="Monto mínimo de compra ($)"
                value={settings.free_delivery_minimum}
                onChange={(value: string) =>
                  setSettings({
                    ...settings,
                    free_delivery_minimum: value,
                  })
                }
              />
            </div>
          )}
        </div>

        {/* VISTA PREVIA */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.04) 0%, rgba(0,0,0,0) 100%)",
            border: "1px solid rgba(249,115,22,0.15)",
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginTop: 0, marginBottom: "14px", color: "#f97316", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Vista previa del Checkout
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Delivery disponible:</span>
              <span style={{ fontWeight: 600 }}>{settings.delivery_enabled ? "✅ Sí" : "❌ No"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Pickup disponible:</span>
              <span style={{ fontWeight: 600 }}>{settings.pickup_enabled ? "✅ Sí" : "❌ No"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Costo de Envío:</span>
              <span style={{ fontWeight: 600, fontFamily: "monospace" }}>
                {settings.delivery_mode === "fixed" ? `$${settings.delivery_fee}` : "📍 Coordinación Manual"}
              </span>
            </div>

            {settings.free_delivery_enabled && (
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Envío Gratis:</span>
                <span style={{ fontWeight: 600, color: "#22c55e" }}>A partir de ${settings.free_delivery_minimum}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "2px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Radio de cobertura:</span>
              <span style={{ fontWeight: 600 }}>{settings.delivery_radius_km || "0"} km</span>
            </div>
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            background: "#f97316",
            color: "#fff",
            border: "none",
            padding: "16px 36px",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "none" : "0 12px 30px rgba(249,115,22,0.25)",
            transition: "all 0.2s ease",
            width: "100%",
            maxWidth: "320px",
            opacity: saving ? 0.6 : 1,
            display: "block",
          }}
        >
          {saving ? "Guardando..." : "💾 Guardar Configuración"}
        </button>
      </main>
    </PermissionGuard>
  );
}

function InputCard({
  label,
  value,
  onChange,
}: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <label
        style={{
          display: "block",
          fontSize: "13.5px",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 500,
        }}
      >
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
          padding: "12px 14px",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "monospace",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}