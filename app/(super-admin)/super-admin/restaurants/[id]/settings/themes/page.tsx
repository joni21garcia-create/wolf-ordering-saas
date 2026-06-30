"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

const THEMES = [
  { id: "wolf", name: "Wolf Orange", primary: "#f97316", secondary: "#fb923c", background: "#050505" },
  { id: "fire", name: "Fire Red", primary: "#dc2626", secondary: "#ef4444", background: "#080808" },
  { id: "ocean", name: "Ocean Blue", primary: "#2563eb", secondary: "#3b82f6", background: "#030712" },
  { id: "forest", name: "Forest Green", primary: "#16a34a", secondary: "#22c55e", background: "#03110a" },
  { id: "royal", name: "Royal Purple", primary: "#7c3aed", secondary: "#8b5cf6", background: "#0f061f" },
  { id: "gold", name: "Golden Luxury", primary: "#d4af37", secondary: "#f4d03f", background: "#050505" },
  { id: "coffee", name: "Coffee House", primary: "#8b5e3c", secondary: "#b08968", background: "#120d08" },
  { id: "sunset", name: "Sunset", primary: "#ff5f6d", secondary: "#ffc371", background: "#100505" },
  { id: "midnight", name: "Midnight Black", primary: "#ffffff", secondary: "#999999", background: "#000000" },
  { id: "emerald", name: "Emerald Premium", primary: "#10b981", secondary: "#34d399", background: "#04130f" },
];

const BUTTON_STYLES = ["rounded", "square", "pill", "premium", "luxury"];
const FONTS = ["Poppins", "Inter", "Montserrat", "Roboto", "Oswald", "Playfair Display"];
const CARD_STYLES = ["glass", "solid", "premium", "minimal"];

export default function ThemeSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    theme_style: "wolf",
    primary_color: "#f97316",
    secondary_color: "#fb923c",
    background_color: "#050505",
    text_color: "#ffffff",
    button_style: "rounded",
    font_family: "Poppins",
    card_style: "glass",
    hero_overlay: "dark",
    glow_effect: true,
  });

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const { data } = await supabase
      .from("restaurant_theme_settings")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (data) setForm(data);
    setLoading(false);
  }

  async function saveTheme() {
    try {
      setSaving(true);
      await supabase.from("restaurant_theme_settings").upsert({ restaurant_id: restaurantId, ...form });
      alert("Tema actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error guardando configuración");
    } finally {
      setSaving(false);
    }
  }

  function applyTheme(theme: any) {
    setForm({
      ...form,
      theme_style: theme.id,
      primary_color: theme.primary,
      secondary_color: theme.secondary,
      background_color: theme.background,
    });
  }

  if (loading) return <div style={{ padding: "40px", color: "#fff" }}>Cargando...</div>;

  return (
    <PermissionGuard permission="themes">
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "800", marginBottom: "10px" }}>🎨 Apariencia Premium</h1>
        <div style={{ color: "#888", marginBottom: "40px" }}>
          <BackToSettings restaurantId={restaurantId} /> Configuración Themes
        </div>

        <h2 style={{ marginBottom: "20px" }}>Temas Premium Wolf</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "50px" }}>
          {THEMES.map((theme) => (
            <div key={theme.id} onClick={() => applyTheme(theme)} style={{ cursor: "pointer", border: form.theme_style === theme.id ? `2px solid ${theme.primary}` : "1px solid rgba(255,255,255,.08)", borderRadius: "24px", overflow: "hidden", background: "#0b0b0b" }}>
              <div style={{ height: "120px", background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }} />
              <div style={{ padding: "20px" }}>
                <h3>{theme.name}</h3>
                <p style={{ color: "#777" }}>{theme.id}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>🎨 Colores</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginBottom: "50px" }}>
          {[{l:"Color Principal", k:"primary_color"}, {l:"Color Secundario", k:"secondary_color"}, {l:"Fondo", k:"background_color"}, {l:"Texto", k:"text_color"}].map(item => (
            <div key={item.k}>
              <label style={{ display: "block", marginBottom: "5px" }}>{item.l}</label>
              <input type="color" value={form[item.k]} onChange={(e) => setForm({...form, [item.k]: e.target.value})} style={{ width: "100%", height: "40px" }} />
            </div>
          ))}
        </div>

        {[
          { title: "🔘 Estilo Botones", key: "button_style", data: BUTTON_STYLES },
          { title: "🔤 Tipografía", key: "font_family", data: FONTS },
          { title: "🪟 Estilo Cards", key: "card_style", data: CARD_STYLES },
          { title: "🌄 Overlay Hero", key: "hero_overlay", data: ["dark", "light", "orange", "premium"] }
        ].map(section => (
          <div key={section.key}>
            <h2>{section.title}</h2>
            <select value={form[section.key]} onChange={(e) => setForm({...form, [section.key]: e.target.value})} style={{ width: "100%", padding: "16px", marginTop: "15px", marginBottom: "40px", background: "#111", color: "#fff", border: "1px solid #333" }}>
              {section.data.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}

        <div style={{ marginBottom: "50px" }}>
          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="checkbox" checked={form.glow_effect} onChange={(e) => setForm({...form, glow_effect: e.target.checked})} />
            ✨ Activar Glow Premium
          </label>
        </div>

        <button onClick={saveTheme} disabled={saving} style={{ width: "100%", background: form.primary_color, color: "#fff", border: "none", padding: "20px", borderRadius: "16px", fontSize: "18px", fontWeight: "700", cursor: "pointer" }}>
          {saving ? "Guardando..." : "💾 Guardar Configuración"}
        </button>
      </div>
    </PermissionGuard>
  );
}