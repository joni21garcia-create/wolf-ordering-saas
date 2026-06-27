"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

const THEMES = [
  {
    id: "wolf",
    name: "Wolf Orange",
    primary: "#f97316",
    secondary: "#fb923c",
    background: "#050505",
  },

  {
    id: "fire",
    name: "Fire Red",
    primary: "#dc2626",
    secondary: "#ef4444",
    background: "#080808",
  },

  {
    id: "ocean",
    name: "Ocean Blue",
    primary: "#2563eb",
    secondary: "#3b82f6",
    background: "#030712",
  },

  {
    id: "forest",
    name: "Forest Green",
    primary: "#16a34a",
    secondary: "#22c55e",
    background: "#03110a",
  },

  {
    id: "royal",
    name: "Royal Purple",
    primary: "#7c3aed",
    secondary: "#8b5cf6",
    background: "#0f061f",
  },

  {
    id: "gold",
    name: "Golden Luxury",
    primary: "#d4af37",
    secondary: "#f4d03f",
    background: "#050505",
  },

  {
    id: "coffee",
    name: "Coffee House",
    primary: "#8b5e3c",
    secondary: "#b08968",
    background: "#120d08",
  },

  {
    id: "sunset",
    name: "Sunset",
    primary: "#ff5f6d",
    secondary: "#ffc371",
    background: "#100505",
  },

  {
    id: "midnight",
    name: "Midnight Black",
    primary: "#ffffff",
    secondary: "#999999",
    background: "#000000",
  },

  {
    id: "emerald",
    name: "Emerald Premium",
    primary: "#10b981",
    secondary: "#34d399",
    background: "#04130f",
  },
];

const BUTTON_STYLES = [
  "rounded",
  "square",
  "pill",
  "premium",
  "luxury",
];

const FONTS = [
  "Poppins",
  "Inter",
  "Montserrat",
  "Roboto",
  "Oswald",
  "Playfair Display",
];

const CARD_STYLES = [
  "glass",
  "solid",
  "premium",
  "minimal",
];

export default function ThemeSettingsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<any>({
      theme_style: "wolf",

      primary_color:
        "#f97316",

      secondary_color:
        "#fb923c",

      background_color:
        "#050505",

      text_color:
        "#ffffff",

      button_style:
        "rounded",

      font_family:
        "Poppins",

      card_style:
        "glass",

      hero_overlay:
        "dark",

      glow_effect: true,
    });

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const { data } =
      await supabase
        .from(
          "restaurant_theme_settings"
        )
        .select("*")
        .eq(
          "restaurant_id",
          restaurantId
        )
        .maybeSingle();

    if (data) {
      setForm(data);
    }

    setLoading(false);
  }

  async function saveTheme() {
    try {
      setSaving(true);

      await supabase
        .from(
          "restaurant_theme_settings"
        )
        .upsert({
          restaurant_id:
            restaurantId,

          ...form,
        });

      alert(
        "Tema actualizado correctamente"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error guardando configuración"
      );
    } finally {
      setSaving(false);
    }
  }

  function applyTheme(
    theme: any
  ) {
    setForm({
      ...form,

      theme_style:
        theme.id,

      primary_color:
        theme.primary,

      secondary_color:
        theme.secondary,

      background_color:
        theme.background,
    });
  }

  if (loading) {
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
  <PermissionGuard permission="themes">
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <main>
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          🎨 Apariencia Premium
        </h1>

    <p
      style={{
        color: "#888",
        marginBottom: "40px",
      }}
    >

        <BackToSettings
  restaurantId={restaurantId}
/>
      Configuración Themes
    </p>

    {/* TEMAS */}

    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      Temas Premium Wolf
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill,minmax(260px,1fr))",
        gap: "20px",
        marginBottom: "50px",
      }}
    >
      {THEMES.map((theme) => (
        <div
          key={theme.id}
          onClick={() =>
            applyTheme(theme)
          }
          style={{
            cursor: "pointer",

            border:
              form.theme_style ===
              theme.id
                ? `2px solid ${theme.primary}`
                : "1px solid rgba(255,255,255,.08)",

            borderRadius: "24px",

            overflow: "hidden",

            background:
              "#0b0b0b",
          }}
        >
          <div
            style={{
              height: "120px",

              background: `linear-gradient(
                135deg,
                ${theme.primary},
                ${theme.secondary}
              )`,
            }}
          />

          <div
            style={{
              padding: "20px",
            }}
          >
            <h3>{theme.name}</h3>

            <p
              style={{
                color: "#777",
              }}
            >
              {theme.id}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* COLORES */}

    <h2>
      🎨 Colores
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(4,1fr)",
        gap: "20px",
        marginTop: "20px",
        marginBottom: "50px",
      }}
    >
      <div>
        <label>
          Color Principal
        </label>

        <input
          type="color"
          value={
            form.primary_color
          }
          onChange={(e) =>
            setForm({
              ...form,
              primary_color:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>
          Color Secundario
        </label>

        <input
          type="color"
          value={
            form.secondary_color
          }
          onChange={(e) =>
            setForm({
              ...form,
              secondary_color:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>
          Fondo
        </label>

        <input
          type="color"
          value={
            form.background_color
          }
          onChange={(e) =>
            setForm({
              ...form,
              background_color:
                e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>
          Texto
        </label>

        <input
          type="color"
          value={
            form.text_color
          }
          onChange={(e) =>
            setForm({
              ...form,
              text_color:
                e.target.value,
            })
          }
        />
      </div>
    </div>

    {/* BOTONES */}

    <h2>
      🔘 Estilo Botones
    </h2>

    <select
      value={
        form.button_style
      }
      onChange={(e) =>
        setForm({
          ...form,
          button_style:
            e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "16px",
        marginTop: "15px",
        marginBottom: "40px",
      }}
    >
      {BUTTON_STYLES.map(
        (style) => (
          <option
            key={style}
            value={style}
          >
            {style}
          </option>
        )
      )}
    </select>

    {/* TIPOGRAFIA */}

    <h2>
      🔤 Tipografía
    </h2>

    <select
      value={
        form.font_family
      }
      onChange={(e) =>
        setForm({
          ...form,
          font_family:
            e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "16px",
        marginTop: "15px",
        marginBottom: "40px",
      }}
    >
      {FONTS.map(
        (font) => (
          <option
            key={font}
            value={font}
          >
            {font}
          </option>
        )
      )}
    </select>

    {/* CARDS */}

    <h2>
      🪟 Estilo Cards
    </h2>

    <select
      value={
        form.card_style
      }
      onChange={(e) =>
        setForm({
          ...form,
          card_style:
            e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "16px",
        marginTop: "15px",
        marginBottom: "40px",
      }}
    >
      {CARD_STYLES.map(
        (style) => (
          <option
            key={style}
            value={style}
          >
            {style}
          </option>
        )
      )}
    </select>

    {/* OVERLAY */}

    <h2>
      🌄 Overlay Hero
    </h2>

    <select
      value={
        form.hero_overlay
      }
      onChange={(e) =>
        setForm({
          ...form,
          hero_overlay:
            e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "16px",
        marginTop: "15px",
        marginBottom: "40px",
      }}
    >
      <option value="dark">
        Dark
      </option>

      <option value="light">
        Light
      </option>

      <option value="orange">
        Orange
      </option>

      <option value="premium">
        Premium
      </option>
    </select>

    {/* EFECTOS */}

    <div
      style={{
        marginBottom: "50px",
      }}
    >
      <label
        style={{
          display: "flex",
          gap: "10px",
          alignItems:
            "center",
        }}
      >
        <input
          type="checkbox"
          checked={
            form.glow_effect
          }
          onChange={(e) =>
            setForm({
              ...form,
              glow_effect:
                e.target.checked,
            })
          }
        />

        ✨ Activar Glow Premium
      </label>
    </div>

    {/* GUARDAR */}

    <button
      onClick={saveTheme}
      disabled={saving}
      style={{
        background:
          form.primary_color,

        color: "#fff",

        border: "none",

        padding:
          "18px 30px",

        borderRadius:
          "16px",

        fontSize: "18px",

        fontWeight: "700",

        cursor: "pointer",
      }}
    >
      {saving
        ? "Guardando..."
        : "💾 Guardar Configuración"}
    </button>
     </main>
    </div>
  </PermissionGuard>
)
}