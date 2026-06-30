"use client";
import { RestaurantPWASettings, UploadResult } from "@/types/pwa";
import { useState } from "react";

import { usePWASettings } from "@/hooks/usePWASettings";
import { useManagerPWASettings } from "@/hooks/useManagerPWASettings";

import SectionCard from "./SectionCard";
import PhonePreview from "./PhonePreview";
import ColorPicker from "./ColorPicker";
import SaveButton from "./SaveButton";
import RestaurantLogoUploader from "./RestaurantLogoUploader";
import ManagerLogoUploader from "./ManagerLogoUploader";

interface Props {
  restaurantId: string;
}

export default function PWASettingsForm({
  restaurantId,
}: Props) {

  /*
  =====================================================
  TIPO DE APLICACIÓN
  =====================================================
  */

  const [
    appType,
    setAppType,
  ] = useState<"restaurant" | "manager">(
    "restaurant"
  );

  /*
  =====================================================
  CONFIGURACIÓN RESTAURANTE
  =====================================================
  */

  const {
    settings,
    loading,
    saving,
    error,
    updateField,
    saveSettings,
  } = usePWASettings(
    restaurantId
  );

  /*
  =====================================================
  CONFIGURACIÓN MANAGER
  =====================================================
  */

  const {
    settings: managerSettings,
    setSettings: setManagerSettings,
    loading: managerLoading,
    saving: managerSaving,
    setSaving: setManagerSaving,
  } = useManagerPWASettings();

  /*
  =====================================================
  CONFIGURACIÓN ACTIVA
  =====================================================
  */

  const current =
    appType === "restaurant"
      ? settings
      : managerSettings;
console.log("Restaurant logo:", settings.app_logo);
console.log("Manager logo:", managerSettings.app_logo);
  /*
  =====================================================
  ACTUALIZAR CAMPOS
  =====================================================
  */

  function updateCurrentField(
    field: string,
    value: any
  ) {

    if (
      appType === "restaurant"
    ) {

      updateField(
        field as any,
        value
      );

      return;

    }

    setManagerSettings(
      (prev: any) => ({
        ...prev,
        [field]: value,
      })
    );

  }

  /*
  =====================================================
  GUARDAR
  =====================================================
  */

  async function saveCurrentSettings() {

    if (
      appType === "restaurant"
    ) {

      await saveSettings();

      return;

    }

    try {

      setManagerSaving(true);

      const response =
        await fetch(
          "/api/pwa/save-manager-settings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              managerSettings
            ),
          }
        );

      const json =
        await response.json();

      if (!json.success) {

        throw new Error(
          json.error ??
          "No fue posible guardar."
        );

      }

      setManagerSettings(
        json.settings
      );

      alert(
        "Configuración del Manager guardada correctamente."
      );

    } catch (error: any) {

      alert(
        error.message ??
        "Error guardando configuración."
      );

    } finally {

      setManagerSaving(false);

    }

  }

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (
    loading ||
    managerLoading
  ) {

    console.log("Restaurant:", settings.app_logo);

console.log("Manager:", managerSettings.app_logo);

    return (

      <div
        style={{
          padding: 40,
          color: "#fff",
        }}
      >
        Cargando configuración...
      </div>

    );

  }
   /*
  =====================================================
  RENDER
  =====================================================
  */

  return (

    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >

      {/* ===========================================
          CABECERA
      =========================================== */}

      <SectionCard
        title="Configuración PWA"
        subtitle={
          appType === "restaurant"
            ? "Personaliza la aplicación que instalarán los clientes del restaurante."
            : "Configura la aplicación oficial de administración de Wolf Ordering."
        }
      >


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",
            gap: 18,
          }}
        >

          <button
            type="button"
            onClick={() =>
              setAppType("restaurant")
            }
            style={{
              height: 94,
              borderRadius: 22,
              boxShadow:
                appType === "restaurant"
                 ? "0 0 0 1px rgba(249,115,22,.25), 0 18px 40px rgba(249,115,22,.12)"
                 : "none",
              background:
                appType === "restaurant"
                  ? "#cc6220"
                  : "#18181b",
              color: "#fff",
              cursor: "pointer",
              transition: ".25s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >

            <span
              style={{
                fontSize: 30,
              }}
            >
              🌐
            </span>

            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Restaurante
            </span>

            <span
              style={{
                color: "#a1a1aa",
                fontSize: 13,
              }}
            >
              Aplicación para clientes
            </span>

          </button>

          <button
            type="button"
            onClick={() =>
              setAppType("manager")
            }
            style={{
              height: 94,
              borderRadius: 22,
              boxShadow:
                appType === "manager"
                ? "0 0 0 1px rgba(249,115,22,.25), 0 18px 40px rgba(249,115,22,.12)"
                 : "none",
              background:
                appType === "manager"
                  ? "#cc6220"
                  : "#18181b",
              color: "#fff",
              cursor: "pointer",
              transition: ".25s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >

            <span
              style={{
                fontSize: 30,
              }}
            >
              🐺
            </span>

            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Wolf Manager
            </span>

            <span
              style={{
                color: "#a1a1aa",
                fontSize: 13,
              }}
            >
              Aplicación administrativa
            </span>

            

          </button>

        </div>

      </SectionCard>

      {/* ===========================================
          GRID PRINCIPAL
      =========================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0,1fr) 420px",
          gap: 32,
          alignItems: "start",
        }}
      >

        {/* =======================================
            COLUMNA IZQUIERDA
        ======================================= */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
            {/* ===========================================
    INFORMACIÓN GENERAL
=========================================== */}

<SectionCard
  title="Información"
  subtitle="Define la información principal de la aplicación."
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
    }}
  >

    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Nombre de la aplicación
      </label>

      <input
        type="text"
        value={current.app_name}
        onChange={(e) =>
          updateCurrentField(
            "app_name",
            e.target.value
          )
        }
        placeholder="Ej: Wolf Burger"
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          border: "1px solid #3f3f46",
          background: "#27272a",
          color: "#fff",
          padding: "0 16px",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Nombre corto
      </label>

      <input
        type="text"
        value={current.short_name}
        onChange={(e) =>
          updateCurrentField(
            "short_name",
            e.target.value
          )
        }
        placeholder="Ej: Wolf"
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          border: "1px solid #3f3f46",
          background: "#27272a",
          color: "#fff",
          padding: "0 16px",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Descripción
      </label>

      <textarea
        rows={5}
        value={current.description}
        onChange={(e) =>
          updateCurrentField(
            "description",
            e.target.value
          )
        }
        placeholder="Describe brevemente la aplicación."
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid #3f3f46",
          background: "#27272a",
          color: "#fff",
          padding: 16,
          resize: "vertical",
        }}
      />
    </div>

  </div>
</SectionCard>

{/* ===========================================
    APARIENCIA
=========================================== */}

<SectionCard
  title="Apariencia"
  subtitle="Personaliza los colores principales."
>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 26,
    }}
  >

    <ColorPicker
      label="Color principal"
     value={current.theme_color || ""}
      onChange={(color) =>
        updateCurrentField(
          "theme_color",
          color
        )
      }
    />

    <ColorPicker
      label="Color de fondo"
     value={current.background_color || ""}
      onChange={(color) =>
        updateCurrentField(
          "background_color",
          color
        )
      }
    />

  </div>

</SectionCard>

{/* ===========================================
    LOGO
=========================================== */}

<SectionCard
  title="Logo"
  subtitle="Selecciona el logo de la aplicación."
>

  {appType === "restaurant" ? (

    <RestaurantLogoUploader
      restaurantId={restaurantId}
      value={settings.app_logo}
      onChange={(url) =>
        updateField(
          "app_logo",
          url
        )
      }
    />

  ) : (

    <ManagerLogoUploader
      value={managerSettings.app_logo ?? null}
      onChange={(url) =>
       setManagerSettings((prev: any) => ({
          ...prev,
          app_logo: url,
        }))
      }
    />

  )}

</SectionCard>

{/* ===========================================
    CONFIGURACIÓN AVANZADA
=========================================== */}

<SectionCard
  title="Configuración avanzada"
  subtitle="Opciones del manifiesto PWA."
>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 24,
    }}
  >

    <div>

      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Display
      </label>

      <select
      value={(current as any).display}
        onChange={(e) =>
          updateCurrentField(
            "display",
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          border: "1px solid #3f3f46",
          background: "#27272a",
          color: "#fff",
          padding: "0 14px",
        }}
      >
        <option value="standalone">
          Standalone
        </option>

        <option value="fullscreen">
          Fullscreen
        </option>

        <option value="minimal-ui">
          Minimal UI
        </option>

        <option value="browser">
          Browser
        </option>

      </select>

    </div>

    <div>

      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Orientación
      </label>

      <select
        value={(current as any).orientation}
        onChange={(e) =>
          updateCurrentField(
            "orientation" as any,
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          border: "1px solid #3f3f46",
          background: "#27272a",
          color: "#fff",
          padding: "0 14px",
        }}
      >
        <option value="portrait">
          Portrait
        </option>

        <option value="landscape">
          Landscape
        </option>

        <option value="any">
          Any
        </option>

      </select>

    </div>

    <div
      style={{
        background: "#27272a",
        border: "1px solid #3f3f46",
        borderRadius: 12,
        padding: 18,
        color: "#a1a1aa",
        fontSize: 14,
        lineHeight: 1.7,
      }}
    >
      <strong
        style={{
          color: "#fff",
        }}
      >
        ¿Qué significa esto?
      </strong>

      <br />
      <br />

      • <b>Standalone:</b> abre como una aplicación instalada.

      <br />

      • <b>Fullscreen:</b> ocupa toda la pantalla.

      <br />

      • <b>Browser:</b> abre como una página web.

      <br />

      • <b>Portrait:</b> solo orientación vertical.

      <br />

      • <b>Landscape:</b> solo orientación horizontal.

    </div>

  </div>

</SectionCard>
 </div>

        {/* =======================================
            COLUMNA DERECHA
        ======================================= */}

        <div
          style={{
            position: "sticky",
            top: 30,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            alignSelf: "start",
          }}
        >

          {/* ===================================
              VISTA PREVIA
          =================================== */}

<SectionCard
  title="Vista previa"
  subtitle="Así se verá la aplicación instalada."
>

  {appType === "restaurant" ? (

    <PhonePreview
      settings={settings}
    />

  ) : (

<PhonePreview
  settings={{
    ...managerSettings,
    restaurant_id: "",
    theme_color: managerSettings.theme_color || "#ffffff",
    background_color: managerSettings.background_color || "#000000",
    display: (managerSettings as any).display || "standalone",
    orientation: (managerSettings as any).orientation || "portrait",
    app_logo: managerSettings.app_logo ?? null, 
  }}
/>

  )}

</SectionCard>

          {/* ===================================
              ESTADO
          =================================== */}

          <SectionCard
            title="Estado"
            subtitle="Información del formulario."
          >

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#27272a",
                }}
              >

                <span
                  style={{
                    color: "#a1a1aa",
                  }}
                >
                  Aplicación
                </span>

                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {appType === "restaurant"
                    ? "Restaurante"
                    : "Wolf Manager"}
                </strong>

              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#27272a",
                }}
              >

                <span
                  style={{
                    color: "#a1a1aa",
                  }}
                >
                  Estado
                </span>

                <strong
                  style={{
                    color:
                      appType === "restaurant"
                        ? saving
                          ? "#f59e0b"
                          : "#22c55e"
                        : managerSaving
                          ? "#f59e0b"
                          : "#22c55e",
                  }}
                >
                  {appType === "restaurant"
                    ? saving
                      ? "Guardando..."
                      : "Listo"
                    : managerSaving
                      ? "Guardando..."
                      : "Listo"}
                </strong>

              </div>

            </div>

          </SectionCard>

          {/* ===================================
              ERROR
          =================================== */}

          {error &&
            appType === "restaurant" && (

            <div
              style={{
                background: "#7f1d1d",
                border: "1px solid #dc2626",
                color: "#fff",
                padding: 18,
                borderRadius: 12,
              }}
            >
              {error}
            </div>

          )}

          {/* ===================================
              GUARDAR
          =================================== */}

          <SectionCard
            title="Guardar cambios"
            subtitle={
              appType === "restaurant"
                ? "Los cambios se aplicarán únicamente a este restaurante."
                : "Los cambios actualizarán la aplicación Wolf Ordering Manager."
            }
          >

            <SaveButton
              loading={
                appType === "restaurant"
                  ? saving
                  : managerSaving
              }
              onClick={saveCurrentSettings}
            />

          </SectionCard>

        </div>

      </div>

    </main>

  );

}