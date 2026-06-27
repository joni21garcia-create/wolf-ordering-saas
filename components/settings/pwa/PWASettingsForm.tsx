"use client";

import { usePWASettings } from "@/hooks/usePWASettings";
import ManagerPWAForm from "./ManagerPWAForm";
import { useState } from "react";
import { useManagerPWASettings } from "@/hooks/useManagerPWASettings";

import PhonePreview from "./PhonePreview";
import SectionCard from "./SectionCard";
import LogoUploader from "./LogoUploader";
import ColorPicker from "./ColorPicker";
import SaveButton from "./SaveButton";

interface Props {
  restaurantId: string;
}

export default function PWASettingsForm({
  restaurantId,
}: Props) {

    const [appType, setAppType] = useState<
  "restaurant" | "manager"
>("restaurant");

const {
  settings,
  loading,
  saving,
  error,
  updateField,
  saveSettings,
} = usePWASettings(restaurantId);

const {
  settings: managerSettings,
  setSettings: setManagerSettings,
  loading: managerLoading,
  saving: managerSaving,
} = useManagerPWASettings();


const current =
  appType === "restaurant"
    ? settings
    : managerSettings;

    function updateCurrentField(field: string, value: any) {

  if (appType === "restaurant") {
    updateField(field as any, value);
    return;
  }

  setManagerSettings((prev) => ({
    ...prev,
    [field]: value,
  }));

}


  if (loading) {
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



async function saveCurrentSettings() {

    console.log("APP TYPE:", appType);

console.log("SETTINGS RESTAURANTE:", settings);

console.log("MANAGER SETTINGS:", managerSettings);

  if (appType === "restaurant") {
    await saveSettings();
    return;
  }

  const response = await fetch(
    "/api/pwa/save-manager-settings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(managerSettings),
    }
  );

  const json = await response.json();

  if (!json.success) {
    alert("No fue posible guardar la configuración.");
    return;
  }

  setManagerSettings(json.settings);

  alert("Configuración del Manager guardada correctamente.");

}



  return (


    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(700px,1fr) 360px",
        gap: 35,
        alignItems: "start",
      }}
    >

      {/* COLUMNA IZQUIERDA */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >


<SectionCard
  title="Tipo de aplicación"
  subtitle="Selecciona qué aplicación deseas configurar."
>

  <div
    style={{
      display: "flex",
      gap: 16,
    }}
  >
    <button
      type="button"
      onClick={() =>
        setAppType("restaurant")
      }
      style={{
        flex: 1,
        padding: "16px",
        borderRadius: 12,
        border:
          appType === "restaurant"
            ? "2px solid #f97316"
            : "1px solid #3f3f46",
        background:
          appType === "restaurant"
            ? "#2a1608"
            : "#18181b",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      🌐 Web Restaurante
    </button>

    <button
      type="button"
      onClick={() =>
        setAppType("manager")
      }
      style={{
        flex: 1,
        padding: "16px",
        borderRadius: 12,
        border:
          appType === "manager"
            ? "2px solid #f97316"
            : "1px solid #3f3f46",
        background:
          appType === "manager"
            ? "#2a1608"
            : "#18181b",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      🐺 Wolf Ordering Manager
    </button>
  </div>

</SectionCard>
        <SectionCard
          title="Información"
          subtitle="Información principal de la aplicación instalada por el cliente."
        >

         <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 22,
  }}
>
  {/* Nombre App */}

  <div>
    <label
      style={{
        display: "block",
        color: "#fff",
        marginBottom: 8,
        fontWeight: 600,
        fontSize: 15,
      }}
    >
      Nombre de la aplicación
    </label>

    <input
      type="text"
      placeholder="Ej: Wolf Ordering"
      value={current.app_name}
      onChange={(e) =>
        updateCurrentField(
          "app_name",
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
        padding: "0 16px",
        fontSize: 15,
        outline: "none",
      }}
    />
  </div>

  {/* Nombre corto */}

  <div>
    <label
      style={{
        display: "block",
        color: "#fff",
        marginBottom: 8,
        fontWeight: 600,
        fontSize: 15,
      }}
    >
      Nombre corto
    </label>

    <input
      type="text"
      placeholder="Ej: WO"
      value={current.short_name}
      onChange={(e) =>
        updateCurrentField(
          "short_name",
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
        padding: "0 16px",
        fontSize: 15,
        outline: "none",
      }}
    />
  </div>

  {/* Descripción */}

  <div>
    <label
      style={{
        display: "block",
        color: "#fff",
        marginBottom: 8,
        fontWeight: 600,
        fontSize: 15,
      }}
    >
      Descripción
    </label>

    <textarea
      rows={5}
      placeholder="Describe tu aplicación..."
      value={current.description}
      onChange={(e) =>
        updateCurrentField(
          "description",
          e.target.value
        )
      }
      style={{
        width: "100%",
        borderRadius: 12,
        border: "1px solid #3f3f46",
        background: "#27272a",
        color: "#fff",
        padding: 16,
        resize: "vertical",
        fontSize: 15,
        outline: "none",
      }}
    />
  </div>
</div>

        </SectionCard>

        <SectionCard
  title="Apariencia"
  subtitle="Personaliza colores e identidad visual."
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 28,
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          color: "#fff",
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        Color principal
      </label>

      <ColorPicker
        label=""
        value={current.theme_color}
        onChange={(color) =>
          updateCurrentField("theme_color", color)
        }
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          color: "#fff",
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        Color de fondo
      </label>

      <ColorPicker
        label=""
        value={current.background_color}
        onChange={(color) =>
          updateCurrentField("background_color", color)
        }
      />
    </div>

    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "#27272a",
        color: "#a1a1aa",
        fontSize: 14,
        lineHeight: 1.6,
        border: "1px solid #3f3f46",
      }}
    >
      Estos colores se utilizarán en:
      <br />
      • Pantalla de carga (Splash)
      <br />
      • Barra superior de la PWA
      <br />
      • Manifest dinámico
      <br />
      • Instalación de la aplicación
    </div>
  </div>
</SectionCard>

<SectionCard
  title="Logo"
  subtitle="Logo utilizado por la PWA y el acceso directo."
>
<LogoUploader
  restaurantId={restaurantId}
  value={current.app_logo}
    onChange={(url) =>
      updateCurrentField("app_logo", url)
    }
  />
</SectionCard>

       
       <SectionCard
  title="Configuración avanzada"
  subtitle="Cómo se abrirá la aplicación instalada."
>
  <div
    style={{
      display: "grid",
      gap: 24,
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 10,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Tipo de visualización
      </label>

      <select
        value={current.display}
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
          background: "#18181b",
          color: "#fff",
          border: "1px solid #3f3f46",
          padding: "0 16px",
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
          marginBottom: 10,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Orientación
      </label>

      <select
        value={current.orientation}
        onChange={(e) =>
          updateCurrentField(
            "orientation",
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          background: "#18181b",
          color: "#fff",
          border: "1px solid #3f3f46",
          padding: "0 16px",
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
        lineHeight: 1.6,
      }}
    >
      <strong style={{ color: "#fff" }}>
        ¿Qué significa esto?
      </strong>

      <br />
      <br />

      • <b>Standalone</b>: la aplicación se abre como una app normal.

      <br />

      • <b>Fullscreen</b>: ocupa toda la pantalla.

      <br />

      • <b>Browser</b>: se abre como una página web.

      <br />

      • <b>Portrait</b>: sólo vertical.

      <br />

      • <b>Landscape</b>: sólo horizontal.
    </div>
  </div>
</SectionCard>

      </div>

      {/* PREVIEW */}

      <div
        style={{
          position: "sticky",
          top: 30,
        }}
      >

        <SectionCard
          title="Vista previa"
          subtitle="Así verán la aplicación tus clientes."
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
    }}
  />
)}

        </SectionCard>

        <SectionCard
  title="Guardar cambios"
  subtitle="La configuración quedará disponible inmediatamente para este restaurante."
>
  {error && (
    <div
      style={{
        background: "#7f1d1d",
        border: "1px solid #dc2626",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      {error}
    </div>
  )}

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

  );

}