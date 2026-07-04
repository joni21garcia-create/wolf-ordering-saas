"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface SocialsState {
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp_url: string;
  contact_email: string;
  show_contact: boolean;
  show_contact_email: boolean;
  show_socials: boolean;
  show_whatsapp: boolean;
}

export default function SocialsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socials, setSocials] = useState<SocialsState>({
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp_url: "",
    contact_email: "",
    show_contact: true,
    show_contact_email: true,
    show_socials: true,
    show_whatsapp: false,
  });

  useEffect(() => {
    loadSocials();
  }, []);

  const loadSocials = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("instagram, facebook, tiktok, whatsapp_url, contact_email, show_contact, show_contact_email, show_socials, show_whatsapp")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setSocials({
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          tiktok: data.tiktok || "",
          whatsapp_url: data.whatsapp_url || "",
          contact_email: data.contact_email || "",
          show_contact: data.show_contact ?? true,
          show_contact_email: data.show_contact_email ?? true,
          show_socials: data.show_socials ?? true,
          show_whatsapp: data.show_whatsapp ?? false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSocials = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("restaurants")
        .update(socials)
        .eq("id", restaurantId);

      if (error) throw error;
      alert("Configuración de contacto y redes guardada correctamente");
    } catch (err) {
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const toggleSwitch = (key: keyof SocialsState) => {
    setSocials((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <main style={{ padding: "40px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyItems: "center" }}>
        Cargando...
      </main>
    );
  }

  return (
    <PermissionGuard permission="socials">
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        
        {/* ENCABEZADO */}
        <div style={{ marginBottom: "35px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginTop: "15px", letterSpacing: "-0.5px" }}>Centro de Contacto y Redes</h1>
          <p style={{ color: "#a1a1aa", marginTop: "5px", fontSize: "15px" }}>Controla la información comercial externa y la visibilidad de tu marca de cara al cliente final.</p>
        </div>

        {/* CONTENEDOR GRID DE 4 TARJETAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          
          {/* TARJETA 1: Información de Contacto */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
                <div style={{ padding: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", color: "#3b82f6", display: "flex", alignItems: "center", justifyItems: "center" }}>
                  📞
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Información de Contacto</h3>
                  <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Canales de soporte directo del establecimiento</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <SocialInput
                  label="Número de WhatsApp"
                  placeholder="0991234567 o +593991234567"
                  value={socials.whatsapp_url}
                  onChange={(v: string) => setSocials({ ...socials, whatsapp_url: v })}
                />
                <SocialInput
                  label="Correo Electrónico"
                  placeholder="contacto@restaurante.com"
                  value={socials.contact_email}
                  onChange={(v: string) => setSocials({ ...socials, contact_email: v })}
                />
              </div>
            </div>

            <div style={{ marginTop: "25px", padding: "12px 16px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "12px", fontSize: "13px", color: "#93c5fd", lineHeight: "1.5" }}>
              El número de WhatsApp será utilizado para confirmar pedidos después del checkout.
            </div>
          </div>

          {/* TARJETA 2: Redes Sociales */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "24px", padding: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
              <div style={{ padding: "10px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "12px", color: "#a855f7", display: "flex", alignItems: "center", justifyItems: "center" }}>
                🌐
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Redes Sociales</h3>
                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Enlaces directos hacia las comunidades de tu marca</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <SocialInput
                label="Instagram"
                placeholder="https://instagram.com/tu_usuario"
                value={socials.instagram}
                onChange={(v: string) => setSocials({ ...socials, instagram: v })}
              />
              <SocialInput
                label="Facebook"
                placeholder="https://facebook.com/tu_pagina"
                value={socials.facebook}
                onChange={(v: string) => setSocials({ ...socials, facebook: v })}
              />
              <SocialInput
                label="TikTok"
                placeholder="https://tiktok.com/@tu_usuario"
                value={socials.tiktok}
                onChange={(v: string) => setSocials({ ...socials, tiktok: v })}
              />
            </div>
          </div>

          {/* TARJETA 3: Visibilidad en la Web */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "24px", padding: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
              <div style={{ padding: "10px", background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "12px", color: "#eab308", display: "flex", alignItems: "center", justifyItems: "center" }}>
                👁
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Visibilidad en la Web</h3>
                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Switches premium para habilitar u ocultar componentes públicos</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <VisibilitySwitch
                label="Mostrar Dirección"
                active={socials.show_contact}
                onToggle={() => toggleSwitch("show_contact")}
              />
              <VisibilitySwitch
                label="Mostrar Correo"
                active={socials.show_contact_email}
                onToggle={() => toggleSwitch("show_contact_email")}
              />
              <VisibilitySwitch
                label="Mostrar Redes Sociales"
                active={socials.show_socials}
                onToggle={() => toggleSwitch("show_socials")}
              />
              <VisibilitySwitch
                label="Mostrar WhatsApp"
                active={socials.show_whatsapp}
                onToggle={() => toggleSwitch("show_whatsapp")}
              />
            </div>
          </div>

          {/* TARJETA 4: Estado de la Configuración */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "24px", padding: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
              <div style={{ padding: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#ef4444", display: "flex", alignItems: "center", justifyItems: "center" }}>
                📊
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Estado de la configuración</h3>
                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Auditoría en tiempo real del despliegue público del PWA</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Sección Contacto */}
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#555", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Contacto</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <PreviewItem label="WhatsApp" active={!!socials.whatsapp_url} />
                  <PreviewItem label="Correo" active={!!socials.contact_email} />
                </div>
              </div>

              <div style={{ height: "1px", background: "#222" }} />

              {/* Sección Redes */}
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#555", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Redes</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <PreviewItem label="Instagram" active={!!socials.instagram} />
                  <PreviewItem label="Facebook" active={!!socials.facebook} />
                  <PreviewItem label="TikTok" active={!!socials.tiktok} />
                </div>
              </div>

              <div style={{ height: "1px", background: "#222" }} />

              {/* Sección Visibilidad */}
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#555", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Visibilidad</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <BadgeVisibility label="Dirección" visible={socials.show_contact} />
                  <BadgeVisibility label="Correo" visible={socials.show_contact_email} />
                  <BadgeVisibility label="Redes" visible={socials.show_socials} />
                  <BadgeVisibility label="WhatsApp" visible={socials.show_whatsapp} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTÓN GLOBAL DE ACCIÓN */}
        <button
          onClick={saveSocials}
          disabled={saving}
          style={{
            width: "100%",
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "16px",
            borderRadius: "14px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 4px 20px rgba(255,255,255,0.05)"
          }}
        >
          {saving ? "Guardando..." : "💾 Guardar Configuración"}
        </button>

      </main>
    </PermissionGuard>
  );
}

function SocialInput({ label, placeholder, value, onChange }: any) {
  return (
    <div style={{ width: "100%" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#a1a1aa", fontSize: "13px", fontWeight: "500" }}>{label}</label>
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#161616",
          border: "1px solid #262626",
          color: "#fff",
          padding: "14px",
          borderRadius: "12px",
          outline: "none",
          fontSize: "14px",
          transition: "border-color 0.2s ease",
          boxSizing: "border-box"
        }}
        onFocus={(e) => (e.target.style.borderColor = "#444")}
        onBlur={(e) => (e.target.style.borderColor = "#262626")}
      />
    </div>
  );
}

function VisibilitySwitch({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "between", padding: "12px 16px", background: "#161616", border: "1px solid #262626", borderRadius: "14px" }}>
      <span style={{ fontSize: "14px", fontWeight: "500", color: "#e4e4e7" }}>{label}</span>
      <div
        onClick={onToggle}
        style={{
          width: "44px",
          height: "24px",
          background: active ? "#22c55e" : "#2d2d2d",
          borderRadius: "12px",
          position: "relative",
          cursor: "pointer",
          transition: "background-color 0.2s ease"
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: "3px",
            left: active ? "23px" : "3px",
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        />
      </div>
    </div>
  );
}

function PreviewItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: active ? "#e4e4e7" : "#71717a", fontSize: "14px" }}>
      <span style={{ fontSize: "12px" }}>{active ? "✅" : "❌"}</span>
      <span>{label} {active ? "configurado" : "no configurado"}</span>
    </div>
  );
}

function BadgeVisibility({ label, visible }: { label: string; visible: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "500",
        background: visible ? "rgba(34,197,94,0.06)" : "#161616",
        border: visible ? "1px solid rgba(34,197,94,0.15)" : "1px solid #262626",
        color: visible ? "#4ade80" : "#71717a"
      }}
    >
      <span>{visible ? "👁" : "🙈"}</span>
      <span>{visible ? label : `${label} oculto`}</span>
    </div>
  );
}