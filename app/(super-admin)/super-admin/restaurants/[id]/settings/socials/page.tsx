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
      <main style={{ padding: "40px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Cargando...
      </main>
    );
  }

  return (
    <PermissionGuard permission="socials">
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px) 16px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", boxSizing: "border-box" }}>
        
        {/* ENCABEZADO */}
        <div style={{ marginBottom: "24px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: "800", marginTop: "12px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            Centro de Contacto y Redes
          </h1>
          <p style={{ color: "#a1a1aa", marginTop: "6px", fontSize: "14px", lineHeight: 1.5 }}>
            Controla la información comercial externa y la visibilidad de tu marca de cara al cliente final.
          </p>
        </div>

        {/* CONTENEDOR GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          
          {/* TARJETA 1: Información de Contacto */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ padding: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  📞
                </div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>Información de Contacto</h3>
                  <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Canales de soporte directo</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <SocialInput
                  label="Número de WhatsApp"
                  placeholder="0991234567"
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

            <div style={{ padding: "12px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "12px", fontSize: "12.5px", color: "#93c5fd", lineHeight: "1.4" }}>
              El número de WhatsApp será utilizado para confirmar pedidos después del checkout.
            </div>
          </div>

          {/* TARJETA 2: Redes Sociales */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "20px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ padding: "10px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "12px", color: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                🌐
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>Redes Sociales</h3>
                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Enlaces hacia tus comunidades</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "20px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ padding: "10px", background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "12px", color: "#eab308", display: "flex", alignItems: "center", justifyContent: "center" }}>
                👁
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>Visibilidad en la Web</h3>
                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Habilitar u ocultar componentes</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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

          {/* TARJETA 4: Estado de la Configuración (¡CON DESPLAZAMIENTO HORIZONTAL EN MÓVIL!) */}
          <div style={{ background: "#121212", border: "1px solid #222", borderRadius: "20px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ padding: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                📊
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>Estado público</h3>
                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Desliza para auditar el despliegue PWA</p>
              </div>
            </div>

            {/* Contenedor que permite mover hacia la derecha en pantallas pequeñas */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", overflowX: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
              <div style={{ minWidth: "260px" }}>
                {/* Sección Contacto */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#555", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Contacto</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <PreviewItem label="WhatsApp" active={!!socials.whatsapp_url} />
                    <PreviewItem label="Correo" active={!!socials.contact_email} />
                  </div>
                </div>

                <div style={{ height: "1px", background: "#222", margin: "14px 0" }} />

                {/* Sección Redes */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#555", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Redes</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <PreviewItem label="Instagram" active={!!socials.instagram} />
                    <PreviewItem label="Facebook" active={!!socials.facebook} />
                    <PreviewItem label="TikTok" active={!!socials.tiktok} />
                  </div>
                </div>

                <div style={{ height: "1px", background: "#222", margin: "14px 0" }} />

                {/* Sección Visibilidad con Scroll Horizontal propio de Badges */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#555", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Visibilidad</span>
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", whiteSpace: "nowrap" }}>
                    <BadgeVisibility label="Dirección" visible={socials.show_contact} />
                    <BadgeVisibility label="Correo" visible={socials.show_contact_email} />
                    <BadgeVisibility label="Redes" visible={socials.show_socials} />
                    <BadgeVisibility label="WhatsApp" visible={socials.show_whatsapp} />
                  </div>
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
            boxShadow: "0 4px 20px rgba(255,255,255,0.05)",
            boxSizing: "border-box"
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
      <label style={{ display: "block", marginBottom: "6px", color: "#a1a1aa", fontSize: "13px", fontWeight: "500" }}>{label}</label>
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#161616",
          border: "1px solid #262626",
          color: "#fff",
          padding: "12px 14px",
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#161616", border: "1px solid #262626", borderRadius: "12px" }}>
      <span style={{ fontSize: "13.5px", fontWeight: "500", color: "#e4e4e7" }}>{label}</span>
      <div
        onClick={onToggle}
        style={{
          width: "42px",
          height: "22px",
          background: active ? "#22c55e" : "#2d2d2d",
          borderRadius: "11px",
          position: "relative",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
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
    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: active ? "#e4e4e7" : "#71717a", fontSize: "13.5px" }}>
      <span style={{ fontSize: "12px", flexShrink: 0 }}>{active ? "✅" : "❌"}</span>
      <span>
        {label} {active ? "configurado" : "no configurado"}
      </span>
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
        color: visible ? "#4ade80" : "#71717a",
        flexShrink: 0
      }}
    >
      <span style={{ flexShrink: 0 }}>{visible ? "👁" : "🙈"}</span>
      <span>{visible ? label : `${label} oculto`}</span>
    </div>
  );
}