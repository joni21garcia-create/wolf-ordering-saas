"use client";

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

type AppType = "restaurant" | "manager";
type Section = "info" | "appearance" | "logo" | "advanced";

export default function PWASettingsForm({ restaurantId }: Props) {
  const [appType, setAppType] = useState<AppType>("restaurant");
  const [section, setSection] = useState<Section>("info");
  const [showPreview, setShowPreview] = useState(false);

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
    setSaving: setManagerSaving,
  } = useManagerPWASettings();

  const current =
    appType === "restaurant" ? settings : managerSettings;

  function selectAppType(type: AppType) {
    setAppType(type);
    setSection("info");
  }

  function updateCurrentField(field: string, value: any) {
    if (appType === "restaurant") {
      updateField(field as any, value);
      return;
    }

    setManagerSettings((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function saveCurrentSettings() {
    if (appType === "restaurant") {
      await saveSettings();
      return;
    }

    try {
      setManagerSaving(true);

      const response = await fetch(
        "/api/pwa/save-manager-settings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(managerSettings),
        }
      );

      const json = await response.json();

      if (!json.success) {
        throw new Error(
          json.error ?? "No fue posible guardar."
        );
      }

      setManagerSettings(json.settings);
      alert(
        "Configuración del Manager guardada correctamente."
      );
    } catch (error: any) {
      alert(
        error.message ?? "Error guardando configuración."
      );
    } finally {
      setManagerSaving(false);
    }
  }

  if (loading || managerLoading || !current) {
    return (
      <div className="loading">
        <style jsx>{`
          .loading {
            min-height: 160px;
            display: grid;
            place-items: center;
            color: #a1a1aa;
            font-size: 12px;
          }
        `}</style>
        Cargando configuración...
      </div>
    );
  }

  const previewSettings =
    appType === "restaurant"
      ? settings
      : {
          ...managerSettings,
          restaurant_id: "",
          theme_color:
            managerSettings.theme_color || "#ffffff",
          background_color:
            managerSettings.background_color || "#000000",
          display:
            (managerSettings as any).display ||
            "standalone",
          orientation:
            (managerSettings as any).orientation ||
            "portrait",
          app_logo: managerSettings.app_logo ?? null,
        };

  const tabs: {
    id: Section;
    label: string;
    icon: string;
  }[] = [
    { id: "info", label: "Información", icon: "✦" },
    { id: "appearance", label: "Apariencia", icon: "◐" },
    { id: "logo", label: "Logo", icon: "▣" },
    { id: "advanced", label: "Avanzado", icon: "⚙" },
  ];

  return (
    <main className="page">
      <style jsx>{`
        .page {
          --accent: ${appType === "restaurant"
            ? "#f97316"
            : "#22c55e"};
          --accent-soft: ${appType === "restaurant"
            ? "rgba(249,115,22,.12)"
            : "rgba(34,197,94,.11)"};

          width: 100%;
          min-width: 0;
          color: #fff;
          box-sizing: border-box;
        }

        .shell {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(270px, 330px);
          gap: 18px;
          align-items: start;
        }

        .workspace {
          min-width: 0;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .app-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 4px;
          width: min(100%, 420px);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 13px;
          background: rgba(255,255,255,.025);
        }

        .switch-button {
          min-height: 40px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #71717a;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .18s ease;
        }

        .switch-button.active {
          color: #fff;
          background: var(--accent-soft);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent);
        }

        .preview-button {
          display: none;
          min-height: 40px;
          padding: 0 12px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px;
          background: rgba(255,255,255,.035);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }

        .tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 2px 0 9px;
          scrollbar-width: none;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          flex: 0 0 auto;
          min-height: 36px;
          padding: 0 12px;
          border: 1px solid rgba(255,255,255,.065);
          border-radius: 999px;
          background: rgba(255,255,255,.025);
          color: #777;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          transition: .18s ease;
        }

        .tab.active {
          color: #fff;
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          background: var(--accent-soft);
        }

        .panel {
          min-width: 0;
          border: 1px solid rgba(255,255,255,.065);
          border-radius: 16px;
          background: rgba(255,255,255,.018);
          overflow: hidden;
        }

        .panel-head {
          padding: 14px 15px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .panel-title {
          font-size: 13px;
          font-weight: 850;
        }

        .panel-subtitle {
          margin-top: 3px;
          color: #71717a;
          font-size: 10px;
        }

        .panel-body {
          padding: 14px;
        }

        .fields {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .field-label {
          display: block;
          margin-bottom: 6px;
          color: #d4d4d8;
          font-size: 10px;
          font-weight: 750;
        }

        input,
        textarea,
        select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #303035;
          border-radius: 11px;
          background: #171719;
          color: #fff;
          outline: none;
          font-size: 12px;
        }

        input,
        select {
          height: 42px;
          padding: 0 12px;
        }

        textarea {
          min-height: 105px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.45;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: color-mix(in srgb, var(--accent) 48%, #303035);
        }

        .two-col {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .help {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: #8b8b94;
          font-size: 10px;
          line-height: 1.55;
        }

        .help strong {
          color: #e4e4e7;
        }

        .preview-panel {
          position: sticky;
          top: 16px;
          min-width: 0;
          border: 1px solid rgba(255,255,255,.065);
          border-radius: 18px;
          background: rgba(255,255,255,.018);
          overflow: hidden;
        }

        .preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 13px 14px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .preview-title {
          font-size: 11px;
          font-weight: 850;
        }

        .live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #71717a;
          font-size: 9px;
          font-weight: 800;
        }

        .live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
        }

        .preview-body {
          padding: 8px;
        }

        .error {
          margin-top: 10px;
          padding: 11px 12px;
          border: 1px solid rgba(220,38,38,.35);
          border-radius: 11px;
          background: rgba(127,29,29,.28);
          color: #fecaca;
          font-size: 10px;
        }

        .save-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .mobile-sheet {
          display: none;
        }

        @media (max-width: 850px) {
          .shell {
            grid-template-columns: 1fr;
          }

          .preview-panel {
            display: none;
          }

          .preview-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 560px) {
          .topbar {
            align-items: stretch;
            flex-direction: column;
          }

          .app-switch {
            width: 100%;
          }

          .switch-button {
            min-height: 38px;
          }

          .panel {
            border-radius: 14px;
          }

          .panel-body {
            padding: 11px;
          }

          .two-col {
            grid-template-columns: 1fr;
          }

          .preview-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="shell">
        <div className="workspace">
          <div className="topbar">
            <div className="app-switch" aria-label="Tipo de aplicación">
              <button
                type="button"
                className={`switch-button ${
                  appType === "restaurant" ? "active" : ""
                }`}
                onClick={() => selectAppType("restaurant")}
                aria-pressed={appType === "restaurant"}
              >
                🌐 Restaurante
              </button>

              <button
                type="button"
                className={`switch-button ${
                  appType === "manager" ? "active" : ""
                }`}
                onClick={() => selectAppType("manager")}
                aria-pressed={appType === "manager"}
              >
                🐺 Wolf Manager
              </button>
            </div>

            <button
              type="button"
              className="preview-button"
              onClick={() => setShowPreview(true)}
            >
              👁 Vista previa
            </button>
          </div>

          <nav className="tabs" aria-label="Configuración PWA">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab ${
                  section === tab.id ? "active" : ""
                }`}
                onClick={() => setSection(tab.id)}
                aria-current={
                  section === tab.id ? "page" : undefined
                }
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          <div className="panel">
            {section === "info" && (
              <>
                <div className="panel-head">
                  <div className="panel-title">
                    Información
                  </div>
                  <div className="panel-subtitle">
                    Nombre, nombre corto y descripción de la aplicación.
                  </div>
                </div>

                <div className="panel-body">
                  <div className="fields">
                    <div>
                      <label className="field-label">
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
                      />
                    </div>

                    <div>
                      <label className="field-label">
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
                      />
                    </div>

                    <div>
                      <label className="field-label">
                        Descripción
                      </label>
                      <textarea
                        rows={4}
                        value={current.description}
                        onChange={(e) =>
                          updateCurrentField(
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe brevemente la aplicación."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {section === "appearance" && (
              <>
                <div className="panel-head">
                  <div className="panel-title">
                    Apariencia
                  </div>
                  <div className="panel-subtitle">
                    Define los colores principales de la PWA.
                  </div>
                </div>

                <div className="panel-body">
                  <div className="two-col">
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
                </div>
              </>
            )}

            {section === "logo" && (
              <>
                <div className="panel-head">
                  <div className="panel-title">
                    {appType === "restaurant"
                      ? "Logo del restaurante"
                      : "Logo de Wolf Manager"}
                  </div>
                  <div className="panel-subtitle">
                    Identidad visual de la aplicación instalada.
                  </div>
                </div>

                <div className="panel-body">
                  {appType === "restaurant" ? (
                    <RestaurantLogoUploader
                      restaurantId={restaurantId}
                      value={settings.app_logo}
                      onChange={(url) =>
                        updateField("app_logo", url)
                      }
                    />
                  ) : (
                    <ManagerLogoUploader
                      value={managerSettings.app_logo ?? null}
                      onChange={(newSettings) =>
                        setManagerSettings((prev: any) => ({
                          ...prev,
                          ...newSettings,
                        }))
                      }
                    />
                  )}
                </div>
              </>
            )}

            {section === "advanced" && (
              <>
                <div className="panel-head">
                  <div className="panel-title">
                    Configuración avanzada
                  </div>
                  <div className="panel-subtitle">
                    Manifest, display y orientación de la PWA.
                  </div>
                </div>

                <div className="panel-body">
                  <div className="fields">
                    <div className="two-col">
                      <div>
                        <label className="field-label">
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
                        <label className="field-label">
                          Orientación
                        </label>
                        <select
                          value={(current as any).orientation}
                          onChange={(e) =>
                            updateCurrentField(
                              "orientation",
                              e.target.value
                            )
                          }
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
                    </div>

                    <div className="help">
                      <strong>Display:</strong> Standalone abre la
                      PWA como aplicación instalada; Fullscreen ocupa
                      toda la pantalla; Browser mantiene la experiencia
                      web.
                      <br />
                      <br />
                      <strong>Orientación:</strong> Portrait fuerza
                      vertical, Landscape fuerza horizontal y Any
                      permite ambas.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {error && appType === "restaurant" && (
            <div className="error">{error}</div>
          )}

          <div className="save-row">
            <SaveButton
              loading={
                appType === "restaurant"
                  ? saving
                  : managerSaving
              }
              onClick={saveCurrentSettings}
            />
          </div>
        </div>

        <aside className="preview-panel">
          <div className="preview-head">
            <div className="preview-title">
              Vista previa
            </div>

            <div className="live">
              <span className="live-dot" />
              En vivo
            </div>
          </div>

          <div className="preview-body">
            <PhonePreview settings={previewSettings} />
          </div>
        </aside>
      </div>

      {showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa PWA"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(0,0,0,.58)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              width: "min(92vw, 360px)",
              height: "100%",
              overflowY: "auto",
              background: "#0b0b0c",
              borderLeft:
                "1px solid rgba(255,255,255,.08)",
              padding: "12px 10px 20px",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong
                style={{
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                Vista previa
              </strong>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                aria-label="Cerrar vista previa"
                style={{
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: 10,
                  background: "rgba(255,255,255,.06)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ×
              </button>
            </div>

            <PhonePreview settings={previewSettings} />
          </div>
        </div>
      )}
    </main>
  );
}