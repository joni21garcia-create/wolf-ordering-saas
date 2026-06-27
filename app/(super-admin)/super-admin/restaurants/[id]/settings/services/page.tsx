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
          .single();

      setSettings(data);

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
        }}
      >
        Cargando...
      </main>
    );
  }

return (
  <PermissionGuard permission="services">
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px",
          color: "#fff",
        }}
      >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            color: "#777",
            marginBottom: "10px",
          }}
        >
            <BackToSettings
  restaurantId={restaurantId}
/>
          Configuración /
          Servicios
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          Delivery & Pickup
        </h1>

        <p
          style={{
            color: "#999",
            maxWidth: "700px",
            marginTop: "12px",
            lineHeight: 1.7,
          }}
        >
          Configura los servicios
          disponibles para los
          clientes.
        </p>
      </div>
            {/* TOGGLES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px",
          marginBottom: "30px",
        }}
      >
        {/* DELIVERY */}

        <div
          style={{
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "28px",
            padding: "28px",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            🚚
          </div>

          <h2>
            Delivery
          </h2>

          <p
            style={{
              color: "#888",
              marginBottom: "25px",
            }}
          >
            Permite pedidos a domicilio.
          </p>

          <label
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                settings.delivery_enabled
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  delivery_enabled:
                    e.target.checked,
                })
              }
            />

            <span>
              {settings.delivery_enabled
                ? "Activado"
                : "Desactivado"}
            </span>
          </label>
        </div>

        {/* PICKUP */}

        <div
          style={{
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "28px",
            padding: "28px",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            🏪
          </div>

          <h2>
            Pickup
          </h2>

          <p
            style={{
              color: "#888",
              marginBottom: "25px",
            }}
          >
            Retiro en local.
          </p>

          <label
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                settings.pickup_enabled
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  pickup_enabled:
                    e.target.checked,
                })
              }
            />

            <span>
              {settings.pickup_enabled
                ? "Activado"
                : "Desactivado"}
            </span>
          </label>
        </div>
      </div>

      {/* CONFIGURACIÓN */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          Configuración Delivery
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <InputCard
            label="Radio de entrega (km)"
            value={
              settings.delivery_radius_km
            }
            onChange={(value: string) =>
              setSettings({
                ...settings,
                delivery_radius_km:
                  value,
              })
            }
          />

          <InputCard
            label="Costo Delivery"
            value={
              settings.delivery_fee
            }
            onChange={(value: string) =>
              setSettings({
                ...settings,
                delivery_fee:
                  value,
              })
            }
          />

          <InputCard
            label="Pedido mínimo"
            value={
              settings.minimum_order
            }
            onChange={(value: string) =>
              setSettings({
                ...settings,
                minimum_order:
                  value,
              })
            }
          />

          <InputCard
            label="Tiempo preparación"
            value={
              settings.preparation_time
            }
            onChange={(value: string) =>
              setSettings({
                ...settings,
                preparation_time:
                  value,
              })
            }
          />

          <InputCard
            label="Tiempo entrega"
            value={
              settings.delivery_time
            }
            onChange={(value: string) =>
              setSettings({
                ...settings,
                delivery_time:
                  value,
              })
            }
          />
        </div>
      </div>

      {/* DELIVERY GRATIS */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h2>
          🎁 Delivery Gratis
        </h2>

        <label
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <input
            type="checkbox"
            checked={
              settings.free_delivery_enabled
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                free_delivery_enabled:
                  e.target.checked,
              })
            }
          />

          Activar delivery gratis
        </label>

        {settings.free_delivery_enabled && (
          <InputCard
            label="Monto mínimo"
            value={
              settings.free_delivery_minimum
            }
            onChange={(value: string) =>
              setSettings({
                ...settings,
                free_delivery_minimum:
                  value,
              })
            }
          />
        )}
      </div>

      {/* PREVIEW */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#111,#181818)",
          border:
            "1px solid rgba(249,115,22,.15)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "35px",
        }}
      >
        <h2>
          Vista previa
        </h2>

        <p>
          🚚 Delivery:
          {" "}
          {settings.delivery_enabled
            ? "Disponible"
            : "No disponible"}
        </p>

        <p>
          🏪 Pickup:
          {" "}
          {settings.pickup_enabled
            ? "Disponible"
            : "No disponible"}
        </p>

        <p>
          💰 Delivery:
          $
          {settings.delivery_fee}
        </p>

        <p>
          📍 Radio:
          {" "}
          {settings.delivery_radius_km}
          km
        </p>

        {settings.free_delivery_enabled && (
          <p>
            🎁 Gratis desde $
            {
              settings.free_delivery_minimum
            }
          </p>
        )}
      </div>

      {/* BOTÓN */}

      <button
        onClick={
          saveSettings
        }
        disabled={saving}
        style={{
          background:
            "#f97316",
          color: "#fff",
          border: "none",
          padding:
            "18px 40px",
          borderRadius: "18px",
          fontWeight: "800",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow:
            "0 20px 50px rgba(249,115,22,.35)",
        }}
      >
        {saving
          ? "Guardando..."
          : "💾 Guardar Configuración"}
      </button>
     </main>
  </PermissionGuard>
)
}

function InputCard({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          color: "#aaa",
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
          background:
            "rgba(255,255,255,.04)",
          border:
            "1px solid rgba(255,255,255,.08)",
          color: "#fff",
          padding: "14px",
          borderRadius: "14px",
        }}
      />
    </div>
  );
}