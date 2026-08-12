"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Layers3,
  Eye,
  Info,
  Save,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";
import { DISCOVER_BADGES } from "@/modules/discover/config/discoverBadges";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

type StatusMessage = {
  type: "success" | "error";
  text: string;
};

const BADGE_OPTIONS = [
  { value: "none", label: "Sin distintivo" },
  { value: "wolf", label: "Recomendado por Wolf Ordering" },
  { value: "featured", label: "Restaurante destacado" },
  { value: "discover", label: "Destacado en Discover" },
  { value: "premium", label: "Restaurante Premium" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "Nuevo" },
  { value: "promoted", label: "Impulsado" },
] as const;

const styles = `
  .discover-settings-page {
    min-height: 100dvh;
    color: #fff;
    background:
      radial-gradient(circle at 50% -10%, rgba(249,115,22,.12), transparent 34%),
      #050505;
  }

  .discover-settings-shell {
    width: min(920px, calc(100% - 32px));
    margin: 0 auto;
    padding: 28px 0 64px;
  }

  .discover-settings-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
  }

  .discover-settings-heading {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 26px;
  }

  .discover-settings-heading-icon {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(249,115,22,.24);
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(249,115,22,.16), rgba(249,115,22,.04));
    color: #fb923c;
    box-shadow: 0 0 30px rgba(249,115,22,.08), inset 0 1px 0 rgba(255,255,255,.06);
  }

  .discover-settings-title {
    margin: 0;
    font-size: clamp(27px, 4vw, 36px);
    line-height: 1.05;
    letter-spacing: -.045em;
    font-weight: 850;
  }

  .discover-settings-subtitle {
    max-width: 620px;
    margin: 8px 0 0;
    color: rgba(255,255,255,.48);
    font-size: 14px;
    line-height: 1.55;
  }

  .discover-settings-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 26px;
    background:
      linear-gradient(145deg, rgba(20,20,20,.98), rgba(9,9,9,.98));
    box-shadow:
      0 24px 70px rgba(0,0,0,.34),
      inset 0 1px 0 rgba(255,255,255,.035);
  }

  .discover-settings-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 100% 0%, rgba(249,115,22,.075), transparent 30%);
  }

  .discover-settings-card-inner {
    position: relative;
    z-index: 1;
    padding: 28px;
  }

  .discover-settings-card-title {
    margin: 0 0 22px;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -.02em;
  }

  .discover-settings-section {
    padding: 22px 0;
  }

  .discover-settings-section:first-of-type {
    padding-top: 0;
  }

  .discover-settings-section + .discover-settings-section {
    border-top: 1px solid rgba(255,255,255,.065);
  }

  .discover-settings-section-head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .discover-settings-section-icon {
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,.075);
    border-radius: 12px;
    background: rgba(255,255,255,.035);
    color: rgba(255,255,255,.72);
  }

  .discover-settings-section h3 {
    margin: 0;
    color: #fff;
    font-size: 15px;
    line-height: 1.2;
    font-weight: 800;
  }

  .discover-settings-section p {
    margin: 5px 0 0;
    color: rgba(255,255,255,.38);
    font-size: 12px;
    line-height: 1.45;
  }

  .discover-settings-control {
    border: 1px solid rgba(255,255,255,.075);
    border-radius: 18px;
    background: rgba(255,255,255,.025);
  }

  .discover-settings-switch {
    width: 100%;
    min-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border: 0;
    border-radius: inherit;
    background: transparent;
    color: #fff;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .discover-settings-switch-copy {
    min-width: 0;
  }

  .discover-settings-switch-label {
    display: block;
    font-size: 14px;
    line-height: 1.25;
    font-weight: 750;
  }

  .discover-settings-switch-description {
    display: block;
    margin-top: 4px;
    color: rgba(255,255,255,.38);
    font-size: 11px;
  }

  .discover-settings-switch-track {
    position: relative;
    width: 46px;
    height: 28px;
    flex: 0 0 46px;
    border-radius: 999px;
    background: rgba(255,255,255,.10);
    border: 1px solid rgba(255,255,255,.08);
    transition: background .2s ease, border-color .2s ease;
  }

  .discover-settings-switch:disabled {
    opacity: .48;
    cursor: not-allowed;
  }

  .discover-settings-switch:disabled .discover-settings-switch-track {
    filter: saturate(.55);
  }

  .discover-settings-switch-track[data-active="true"] {
    background: rgba(249,115,22,.88);
    border-color: rgba(249,115,22,.95);
  }

  .discover-settings-switch-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 7px rgba(0,0,0,.35);
    transition: transform .2s cubic-bezier(.2,.8,.2,1);
  }

  .discover-settings-switch-track[data-active="true"] .discover-settings-switch-thumb {
    transform: translateX(18px);
  }

  .discover-settings-field {
    display: grid;
    gap: 8px;
  }

  .discover-settings-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: rgba(255,255,255,.72);
    font-size: 12px;
    font-weight: 700;
  }

  .discover-settings-input,
  .discover-settings-select {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 14px;
    outline: none;
    background: rgba(0,0,0,.34);
    color: #fff;
    font: inherit;
    font-size: 14px;
    transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .discover-settings-select {
    appearance: none;
    padding-right: 42px;
    cursor: pointer;
  }

  .discover-settings-input::placeholder {
    color: rgba(255,255,255,.25);
  }

  .discover-settings-input:focus,
  .discover-settings-select:focus {
    border-color: rgba(249,115,22,.48);
    box-shadow: 0 0 0 4px rgba(249,115,22,.08);
    background: rgba(0,0,0,.48);
  }

  .discover-settings-select-wrap {
    position: relative;
  }

  .discover-settings-select-chevron {
    position: absolute;
    top: 50%;
    right: 13px;
    transform: translateY(-50%);
    pointer-events: none;
    color: rgba(255,255,255,.42);
  }

  .discover-settings-badge-preview {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 12px;
    padding: 12px 13px;
    border: 1px solid rgba(249,115,22,.14);
    border-radius: 14px;
    background: rgba(249,115,22,.055);
  }

  .discover-settings-badge-icon {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: rgba(249,115,22,.11);
    color: #fb923c;
  }

  .discover-settings-badge-copy strong {
    display: block;
    color: rgba(255,255,255,.86);
    font-size: 11px;
    font-weight: 750;
  }

  .discover-settings-badge-copy span {
    display: block;
    margin-top: 2px;
    color: rgba(255,255,255,.35);
    font-size: 10px;
  }

  .discover-settings-help {
    display: grid;
    grid-template-columns: 32px minmax(0,1fr);
    gap: 11px;
    margin-top: 18px;
    padding: 14px;
    border: 1px solid rgba(249,115,22,.13);
    border-radius: 16px;
    background: rgba(249,115,22,.045);
  }

  .discover-settings-help-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    color: #fb923c;
    background: rgba(249,115,22,.10);
  }

  .discover-settings-help strong {
    display: block;
    color: rgba(255,255,255,.86);
    font-size: 12px;
  }

  .discover-settings-help ul {
    margin: 7px 0 0;
    padding-left: 17px;
    color: rgba(255,255,255,.42);
    font-size: 11px;
    line-height: 1.65;
  }

  .discover-settings-status {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 18px;
    padding: 12px 13px;
    border-radius: 14px;
    font-size: 12px;
    line-height: 1.4;
  }

  .discover-settings-status[data-type="success"] {
    border: 1px solid rgba(34,197,94,.18);
    background: rgba(34,197,94,.07);
    color: rgba(187,247,208,.88);
  }

  .discover-settings-status[data-type="error"] {
    border: 1px solid rgba(239,68,68,.20);
    background: rgba(239,68,68,.07);
    color: rgba(254,202,202,.9);
  }

  .discover-settings-error {
    color: #fca5a5;
    font-size: 11px;
    line-height: 1.4;
  }

  .discover-settings-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid rgba(255,255,255,.065);
  }

  .discover-settings-save {
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 20px;
    border: 1px solid rgba(249,115,22,.62);
    border-radius: 14px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    box-shadow: 0 10px 26px rgba(249,115,22,.16), inset 0 1px 0 rgba(255,255,255,.16);
    cursor: pointer;
    transition: transform .16s ease, filter .16s ease, opacity .16s ease;
  }

  .discover-settings-save:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .discover-settings-save:active {
    transform: scale(.98);
  }

  .discover-settings-save:disabled {
    opacity: .55;
    cursor: wait;
    transform: none;
  }

  .discover-settings-loading {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: 24px;
    background: #050505;
    color: rgba(255,255,255,.55);
  }

  .discover-settings-loading-card {
    width: min(360px, 100%);
    padding: 22px;
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 20px;
    background: rgba(15,15,15,.94);
    text-align: center;
  }

  .discover-settings-loading-dot {
    width: 28px;
    height: 28px;
    margin: 0 auto 12px;
    border: 2px solid rgba(249,115,22,.18);
    border-top-color: #f97316;
    border-radius: 50%;
    animation: discoverSettingsSpin .8s linear infinite;
  }

  @keyframes discoverSettingsSpin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .discover-settings-shell {
      width: min(100% - 20px, 560px);
      padding: 16px 0 34px;
    }

    .discover-settings-topbar {
      margin-bottom: 18px;
    }

    .discover-settings-heading {
      gap: 11px;
      margin-bottom: 18px;
    }

    .discover-settings-heading-icon {
      width: 42px;
      height: 42px;
      flex-basis: 42px;
      border-radius: 14px;
    }

    .discover-settings-title {
      font-size: 28px;
    }

    .discover-settings-subtitle {
      font-size: 12px;
      line-height: 1.5;
    }

    .discover-settings-card {
      border-radius: 22px;
    }

    .discover-settings-card-inner {
      padding: 18px;
    }

    .discover-settings-card-title {
      margin-bottom: 16px;
      font-size: 17px;
    }

    .discover-settings-section {
      padding: 18px 0;
    }

    .discover-settings-section-head {
      margin-bottom: 13px;
    }

    .discover-settings-footer {
      position: sticky;
      bottom: 0;
      z-index: 5;
      margin-left: -18px;
      margin-right: -18px;
      margin-bottom: -18px;
      padding: 13px 18px calc(13px + env(safe-area-inset-bottom));
      background: rgba(7,7,7,.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .discover-settings-save {
      width: 100%;
    }
  }

  @media (max-width: 380px) {
    .discover-settings-shell {
      width: min(100% - 14px, 560px);
    }

    .discover-settings-card-inner {
      padding: 15px;
    }

    .discover-settings-footer {
      margin-left: -15px;
      margin-right: -15px;
      margin-bottom: -15px;
      padding-left: 15px;
      padding-right: 15px;
    }

    .discover-settings-title {
      font-size: 25px;
    }

    .discover-settings-switch {
      padding: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .discover-settings-save,
    .discover-settings-loading-dot {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default function DiscoverSettingsPage() {
  const params = useParams();

  const rawRestaurantId = params?.id;
  const restaurantId = Array.isArray(rawRestaurantId)
    ? rawRestaurantId[0]
    : rawRestaurantId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [discoverVisible, setDiscoverVisible] = useState(false);
  const [featuredVisible, setFeaturedVisible] = useState(true);
  const [featuredType, setFeaturedType] = useState("none");
  const [featuredOrder, setFeaturedOrder] = useState(1);

  const [category, setCategory] = useState("restaurant");
  const [customCategory, setCustomCategory] = useState("");

  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      setLoadError("No se encontró el restaurante.");
      return;
    }

    void loadData();
    // restaurantId is the only route-dependent value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  async function loadData() {
    if (!restaurantId) return;

    setLoading(true);
    setLoadError(null);
    setStatus(null);

    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select(`
          discover_visible,
          featured_visible,
          category,
          featured_type,
          featured_order
        `)
        .eq("id", restaurantId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setLoadError("No encontramos la configuración de este restaurante.");
        return;
      }

      setDiscoverVisible(data.discover_visible ?? false);
      setFeaturedVisible(data.featured_visible ?? true);
      setFeaturedType(data.featured_type ?? "none");
      setFeaturedOrder(
        Number.isFinite(data.featured_order)
          ? Math.max(1, Math.floor(data.featured_order))
          : 1,
      );

      const currentCategory = data.category ?? "restaurant";

      const exists = DISCOVER_CATEGORIES.some(
        (item) => item.id === currentCategory,
      );

      if (exists) {
        setCategory(currentCategory);
        setCustomCategory("");
      } else {
        setCategory("custom");
        setCustomCategory(currentCategory);
      }
    } catch (error) {
      console.error("[DISCOVER SETTINGS LOAD]", error);
      setLoadError(
        "No fue posible cargar la configuración. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedBadge = useMemo(() => {
    if (featuredType === "none") return null;
    return DISCOVER_BADGES[featuredType] ?? null;
  }, [featuredType]);

  const SelectedBadgeIcon = selectedBadge?.icon;

  function validateForm() {
    const normalizedCustomCategory = customCategory.trim();

    if (category === "custom" && !normalizedCustomCategory) {
      return "Escribe una categoría personalizada.";
    }

    if (category === "custom" && normalizedCustomCategory.length > 80) {
      return "La categoría personalizada no puede superar 80 caracteres.";
    }

    if (featuredVisible && featuredType !== "none") {
      if (!Number.isFinite(featuredOrder)) {
        return "El orden de prioridad no es válido.";
      }

      if (!Number.isInteger(featuredOrder) || featuredOrder < 1) {
        return "El orden de prioridad debe ser un número entero mayor que cero.";
      }
    }

    return null;
  }

  async function saveData() {
    if (!restaurantId || saving) return;

    setStatus(null);

    const errorMessage = validateForm();

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    setValidationError(null);

    const finalCategory =
      category === "custom"
        ? customCategory.trim()
        : category;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("restaurants")
        .update({
          discover_visible: discoverVisible,
          featured_visible: featuredVisible,
          category: finalCategory,
          featured_type: featuredType,
          featured_order:
            !featuredVisible || featuredType === "none"
              ? null
              : featuredOrder,
        })
        .eq("id", restaurantId);

      if (error) throw error;

      setStatus({
        type: "success",
        text: "Configuración guardada correctamente.",
      });
    } catch (error) {
      console.error("[DISCOVER SETTINGS SAVE]", error);

      setStatus({
        type: "error",
        text: "No fue posible guardar la configuración. Intenta nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="discover-settings-loading">
        <div className="discover-settings-loading-card">
          <div className="discover-settings-loading-dot" />
          <strong>Cargando Discover</strong>
          <p
            style={{
              margin: "6px 0 0",
              color: "rgba(255,255,255,.35)",
              fontSize: 12,
            }}
          >
            Preparando la configuración del restaurante...
          </p>
        </div>
        <style>{styles}</style>
      </main>
    );
  }

  if (loadError) {
    return (
      <>
        <style>{styles}</style>

        <main className="discover-settings-loading">
          <div className="discover-settings-loading-card">
            <div
              style={{
                width: 42,
                height: 42,
                margin: "0 auto 14px",
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.16)",
                color: "#fca5a5",
              }}
            >
              <X size={20} />
            </div>

            <strong>No pudimos cargar Discover</strong>

            <p
              style={{
                margin: "7px 0 16px",
                color: "rgba(255,255,255,.38)",
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              {loadError}
            </p>

            <button
              type="button"
              onClick={() => void loadData()}
              className="discover-settings-save"
              style={{ width: "100%" }}
            >
              Intentar nuevamente
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <PermissionGuard permission="discover">
      <style>{styles}</style>

      <main className="discover-settings-page">
        <div className="discover-settings-shell">
          <div className="discover-settings-topbar">
            {restaurantId ? (
              <BackToSettings restaurantId={restaurantId} />
            ) : null}
          </div>

          <header className="discover-settings-heading">
            <div className="discover-settings-heading-icon">
              <Eye size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="discover-settings-title">
                Discover
              </h1>

              <p className="discover-settings-subtitle">
                Controla cómo aparece este restaurante en el
                Discover de Wolf Ordering.
              </p>
            </div>
          </header>

          <section className="discover-settings-card">
            <div className="discover-settings-card-inner">
              <h2 className="discover-settings-card-title">
                Configuración
              </h2>

              {/* VISIBILIDAD */}
              <section className="discover-settings-section">
                <div className="discover-settings-section-head">
                  <div className="discover-settings-section-icon">
                    <Eye size={17} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3>Visibilidad</h3>
                    <p>
                      Decide si el restaurante puede aparecer en Discover.
                    </p>
                  </div>
                </div>

                <div className="discover-settings-control">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={discoverVisible}
                    className="discover-settings-switch"
                    onClick={() => setDiscoverVisible((value) => !value)}
                  >
                    <span className="discover-settings-switch-copy">
                      <span className="discover-settings-switch-label">
                        Mostrar restaurante en Discover
                      </span>

                      <span className="discover-settings-switch-description">
                        {discoverVisible
                          ? "Visible para los clientes."
                          : "Oculto para los clientes."}
                      </span>
                    </span>

                    <span
                      className="discover-settings-switch-track"
                      data-active={discoverVisible}
                      aria-hidden="true"
                    >
                      <span className="discover-settings-switch-thumb" />
                    </span>
                  </button>
                </div>
              </section>

              {/* DESTACADOS */}
              <section className="discover-settings-section">
                <div className="discover-settings-section-head">
                  <div className="discover-settings-section-icon">
                    <Layers3 size={17} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3>Destacados</h3>
                    <p>
                      Controla si este restaurante puede formar parte del carrusel de Destacados.
                    </p>
                  </div>
                </div>

                <div className="discover-settings-control">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={featuredVisible}
                    className="discover-settings-switch"
                    onClick={() => setFeaturedVisible((value) => !value)}
                    disabled={!discoverVisible}
                  >
                    <span className="discover-settings-switch-copy">
                      <span className="discover-settings-switch-label">
                        Mostrar en Destacados
                      </span>
                      <span className="discover-settings-switch-description">
                        {!discoverVisible
                          ? "Activa Discover primero para habilitar esta sección."
                          : featuredVisible
                            ? "Puede aparecer en Destacados según su prioridad."
                            : "No aparecerá en el carrusel de Destacados."}
                      </span>
                    </span>
                    <span
                      className="discover-settings-switch-track"
                      data-active={featuredVisible && discoverVisible}
                      aria-hidden="true"
                    >
                      <span className="discover-settings-switch-thumb" />
                    </span>
                  </button>
                </div>
              </section>

              {/* CATEGORÍA */}
              <section className="discover-settings-section">
                <div className="discover-settings-section-head">
                  <div className="discover-settings-section-icon">
                    <Tag size={17} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3>Clasificación</h3>
                    <p>
                      Define la categoría principal usada por Discover y sus filtros.
                    </p>
                  </div>
                </div>

                <SelectField
                  label="Categoría principal"
                  value={category}
                  onChange={(value) => {
                    setCategory(value);
                    setValidationError(null);
                  }}
                  options={[
                    ...DISCOVER_CATEGORIES.map((item) => ({
                      value: item.id,
                      label: item.label,
                    })),
                    {
                      value: "custom",
                      label: "Otra categoría...",
                    },
                  ]}
                />

                {category === "custom" ? (
                  <div
                    className="discover-settings-field"
                    style={{ marginTop: 14 }}
                  >
                    <label
                      className="discover-settings-label"
                      htmlFor="custom-category"
                    >
                      <span>Categoría personalizada</span>
                      <span>{customCategory.length}/80</span>
                    </label>

                    <input
                      id="custom-category"
                      className="discover-settings-input"
                      type="text"
                      maxLength={80}
                      value={customCategory}
                      onChange={(event) => {
                        setCustomCategory(event.target.value);
                        setValidationError(null);
                      }}
                      placeholder="Ej: Arepas, Sushi, Brunch..."
                    />
                  </div>
                ) : null}
              </section>

              {/* DISTINTIVO */}
              <section className="discover-settings-section">
                <div className="discover-settings-section-head">
                  <div className="discover-settings-section-icon">
                    <Sparkles size={17} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3>Distintivo</h3>
                    <p>
                      Resalta el restaurante con una insignia comercial dentro de Discover.
                    </p>
                  </div>
                </div>

                <SelectField
                  label="Distintivo en Discover"
                  value={featuredType}
                  onChange={(value) => {
                    setFeaturedType(value);
                    setValidationError(null);
                  }}
                  options={[...BADGE_OPTIONS]}
                />

                {selectedBadge && SelectedBadgeIcon ? (
                  <div className="discover-settings-badge-preview">
                    <div className="discover-settings-badge-icon">
                      <SelectedBadgeIcon
                        size={15}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="discover-settings-badge-copy">
                      <strong>{selectedBadge.label}</strong>
                      <span>
                        Esta será la insignia visible en la tarjeta del restaurante.
                      </span>
                    </div>
                  </div>
                ) : null}

                {featuredVisible && featuredType !== "none" ? (
                  <div
                    className="discover-settings-field"
                    style={{ marginTop: 14 }}
                  >
                    <label
                      className="discover-settings-label"
                      htmlFor="featured-order"
                    >
                      <span>Orden de prioridad</span>
                      <span>1 = mayor prioridad</span>
                    </label>

                    <input
                      id="featured-order"
                      className="discover-settings-input"
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      value={featuredOrder}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setFeaturedOrder(
                          Number.isFinite(value) ? value : 1,
                        );
                        setValidationError(null);
                      }}
                    />
                  </div>
                ) : null}
              </section>

              {/* AYUDA */}
              <div className="discover-settings-help">
                <div className="discover-settings-help-icon">
                  <Info size={15} strokeWidth={1.9} />
                </div>

                <div>
                  <strong>Cómo funciona Discover</strong>

                  <ul>
                    <li>
                      Activa Discover para permitir que el restaurante aparezca.
                    </li>
                    <li>
                      La categoría ayuda a organizar y filtrar restaurantes.
                    </li>
                    <li>
                      El distintivo resalta la tarjeta sin cambiar la lógica del restaurante.
                    </li>
                    <li>
                      Destacados es independiente de la cercanía: la distancia se calcula con la ubicación del cliente.
                    </li>
                    <li>
                      El orden define la prioridad entre los restaurantes habilitados para Destacados.
                    </li>
                  </ul>
                </div>
              </div>

              {validationError ? (
                <div
                  className="discover-settings-status"
                  data-type="error"
                  role="alert"
                >
                  <X size={16} />
                  <span>{validationError}</span>
                </div>
              ) : null}

              {status ? (
                <div
                  className="discover-settings-status"
                  data-type={status.type}
                  role={status.type === "error" ? "alert" : "status"}
                >
                  {status.type === "success" ? (
                    <Check size={16} />
                  ) : (
                    <X size={16} />
                  )}

                  <span>{status.text}</span>
                </div>
              ) : null}

              <div className="discover-settings-footer">
                <button
                  type="button"
                  className="discover-settings-save"
                  onClick={() => void saveData()}
                  disabled={saving}
                >
                  <Save size={16} strokeWidth={1.9} />
                  {saving ? "Guardando..." : "Guardar configuración"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PermissionGuard>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div className="discover-settings-field">
      <label className="discover-settings-label">
        <span>{label}</span>
      </label>

      <div className="discover-settings-select-wrap">
        <select
          className="discover-settings-select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="discover-settings-select-chevron">
          <ChevronDown size={16} strokeWidth={1.8} />
        </span>
      </div>
    </div>
  );
}