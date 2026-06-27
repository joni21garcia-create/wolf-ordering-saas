"use client";

import { useState } from "react";
import { supabase }
from "@/lib/supabase/client";


interface Props {
  restaurantId: string;
  initialMode?: string;
  initialType?: string;
  initialPercentage?: number;
  initialActive?: boolean;
}

export default function FinancialSettings({
  restaurantId,
  initialMode = "global",
  initialType = "customer",
  initialPercentage = 5,
  initialActive = false,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [commissionMode, setCommissionMode] =
    useState(initialMode);

  const [commissionType, setCommissionType] =
    useState(initialType);

  const [
    commissionPercentage,
    setCommissionPercentage,
  ] = useState(initialPercentage);

  const [commissionActive, setCommissionActive] =
    useState(initialActive);

  const saveSettings = async () => {
    try {
      setLoading(true);

     const {
  data: { session },
} =
  await supabase.auth.getSession();

if (!session) {
  alert(
    "Sesión expirada"
  );

  return;
}

const response =
  await fetch(
    "/api/restaurants/update-financial",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${session.access_token}`,
      },

      body: JSON.stringify({
        restaurantId,
        commissionMode,
        commissionType,
        commissionPercentage,
        commissionActive,
      }),
    }
  );

      const result =
        await response.json();

      if (!result.success) {
        alert(
          result.error ||
            "Error guardando configuración"
        );
        return;
      }

      alert(
        "Configuración financiera guardada"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error guardando configuración"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          marginBottom: "25px",
        }}
      >
        Configuración Financiera
      </h1>

      <div
        style={{
          background: "#111",
          padding: "25px",
          borderRadius: "20px",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <p
            style={{
              color: "#fff",
              marginBottom: "10px",
            }}
          >
            Modo de Comisión
          </p>

          <select
            value={commissionMode}
            onChange={(e) =>
              setCommissionMode(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
            }}
          >
            <option value="global">
              Usar Configuración Global Wolf
            </option>

            <option value="custom">
              Configuración Personalizada
            </option>
          </select>
        </div>

        {commissionMode === "global" && (
          <div
            style={{
              background:
                "rgba(249,115,22,.08)",
              border:
                "1px solid rgba(249,115,22,.3)",
              padding: "15px",
              borderRadius: "12px",
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            Este restaurante utilizará
            la configuración global
            definida por Wolf.
          </div>
        )}

        {commissionMode === "custom" && (
          <>
            <label
              style={{
                color: "#fff",
                display: "block",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={
                  commissionActive
                }
                onChange={(e) =>
                  setCommissionActive(
                    e.target.checked
                  )
                }
              />

              {" "}
              Activar comisión Wolf
            </label>

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color: "#fff",
                }}
              >
                ¿Quién paga la comisión?
              </p>

              <select
                value={
                  commissionType
                }
                onChange={(e) =>
                  setCommissionType(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                }}
              >
                <option value="customer">
                  Cliente paga comisión
                </option>

                <option value="restaurant">
                  Restaurante paga comisión
                </option>
              </select>
            </div>

            <div>
              <p
                style={{
                  color: "#fff",
                }}
              >
                Porcentaje
              </p>

              <select
                value={
                  commissionPercentage
                }
                onChange={(e) =>
                  setCommissionPercentage(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                }}
              >
                <option value={3}>3%</option>
                <option value={4}>4%</option>
                <option value={5}>5%</option>
                <option value={6}>6%</option>
                <option value={7}>7%</option>
                <option value={8}>8%</option>
                <option value={10}>10%</option>
                <option value={15}>15%</option>
              </select>
            </div>
          </>
        )}

        <button
          onClick={saveSettings}
          disabled={loading}
          style={{
            marginTop: "25px",
            background: "#f97316",
            color: "#fff",
            border: "none",
            padding:
              "14px 24px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Guardando..."
            : "Guardar Configuración"}
        </button>
      </div>
    </div>
  );
}