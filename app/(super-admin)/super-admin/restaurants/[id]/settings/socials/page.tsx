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
      <main className="social-page loading-page">
        <div className="loading">Cargando configuración...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="socials">
      <main className="social-page">
        <div className="social-shell">
          <header className="social-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">EXPERIENCIA · CONTACTO</span>
                <h1>Contacto y redes</h1>
                <p>Controla cómo tus clientes encuentran y contactan tu restaurante.</p>
              </div>

              <span className="live-dot" />
            </div>
          </header>

          <section className="summary">
            <div>
              <span>Canales</span>
              <strong>
                {[socials.whatsapp_url, socials.contact_email].filter(Boolean).length}
              </strong>
            </div>
            <div>
              <span>Redes</span>
              <strong>
                {[socials.instagram, socials.facebook, socials.tiktok].filter(Boolean).length}
              </strong>
            </div>
            <div>
              <span>Visibilidad</span>
              <strong className="green">
                {[socials.show_contact, socials.show_socials, socials.show_whatsapp].filter(Boolean).length}
              </strong>
            </div>
          </section>

          <div className="accordion-list">
            <section className="accordion open">
              <button type="button" className="accordion-head">
                <span className="section-icon">⌕</span>
                <span className="section-copy">
                  <strong>Contacto directo</strong>
                  <small>WhatsApp y correo electrónico</small>
                </span>
                <span className="section-count">
                  {[socials.whatsapp_url, socials.contact_email].filter(Boolean).length}/2
                </span>
              </button>

              <div className="accordion-body">
                <SocialInput
                  label="WhatsApp"
                  placeholder="0991234567"
                  value={socials.whatsapp_url}
                  onChange={(v: string) =>
                    setSocials({ ...socials, whatsapp_url: v })
                  }
                />

                <SocialInput
                  label="Correo"
                  placeholder="contacto@restaurante.com"
                  value={socials.contact_email}
                  onChange={(v: string) =>
                    setSocials({ ...socials, contact_email: v })
                  }
                />

                <div className="micro-note">
                  WhatsApp se utilizará para confirmar pedidos después del checkout.
                </div>
              </div>
            </section>

            <SocialAccordion
              title="Redes sociales"
              subtitle="Instagram, Facebook y TikTok"
              icon="◎"
              count={[socials.instagram, socials.facebook, socials.tiktok].filter(Boolean).length}
            >
              <SocialInput
                label="Instagram"
                placeholder="https://instagram.com/tu_usuario"
                value={socials.instagram}
                onChange={(v: string) =>
                  setSocials({ ...socials, instagram: v })
                }
              />

              <SocialInput
                label="Facebook"
                placeholder="https://facebook.com/tu_pagina"
                value={socials.facebook}
                onChange={(v: string) =>
                  setSocials({ ...socials, facebook: v })
                }
              />

              <SocialInput
                label="TikTok"
                placeholder="https://tiktok.com/@tu_usuario"
                value={socials.tiktok}
                onChange={(v: string) =>
                  setSocials({ ...socials, tiktok: v })
                }
              />
            </SocialAccordion>

            <SocialAccordion
              title="Visibilidad"
              subtitle="Decide qué información aparece públicamente"
              icon="◉"
              count={[
                socials.show_contact,
                socials.show_contact_email,
                socials.show_socials,
                socials.show_whatsapp,
              ].filter(Boolean).length}
            >
              <VisibilitySwitch
                label="Mostrar dirección"
                active={socials.show_contact}
                onToggle={() => toggleSwitch("show_contact")}
              />

              <VisibilitySwitch
                label="Mostrar correo"
                active={socials.show_contact_email}
                onToggle={() => toggleSwitch("show_contact_email")}
              />

              <VisibilitySwitch
                label="Mostrar redes sociales"
                active={socials.show_socials}
                onToggle={() => toggleSwitch("show_socials")}
              />

              <VisibilitySwitch
                label="Mostrar WhatsApp"
                active={socials.show_whatsapp}
                onToggle={() => toggleSwitch("show_whatsapp")}
              />
            </SocialAccordion>

            <SocialAccordion
              title="Vista pública"
              subtitle="Resumen de lo que está configurado"
              icon="◌"
              count={0}
            >
              <div className="preview-list">
                <PreviewItem label="WhatsApp" active={!!socials.whatsapp_url} />
                <PreviewItem label="Correo" active={!!socials.contact_email} />
                <PreviewItem label="Instagram" active={!!socials.instagram} />
                <PreviewItem label="Facebook" active={!!socials.facebook} />
                <PreviewItem label="TikTok" active={!!socials.tiktok} />
              </div>
            </SocialAccordion>
          </div>

          <button
            type="button"
            onClick={saveSocials}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        <style jsx global>{`
          .social-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .social-shell {
            width:100%;
            max-width:650px;
            margin:0 auto;
          }

          .social-header {
            margin-bottom:8px;
          }

          .header-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:8px;
          }

          .eyebrow {
            display:block;
            color:#f97316;
            font-size:7px;
            font-weight:900;
            letter-spacing:1.2px;
          }

          .header-row h1 {
            margin:2px 0 0;
            font-size:23px;
            line-height:1.05;
            letter-spacing:-.55px;
            font-weight:900;
          }

          .header-row p {
            max-width:430px;
            margin:4px 0 0;
            color:rgba(255,255,255,.32);
            font-size:8px;
            line-height:1.4;
          }

          .live-dot {
            width:7px;
            height:7px;
            flex-shrink:0;
            border-radius:50%;
            background:#22c55e;
            box-shadow:0 0 0 4px rgba(34,197,94,.07);
          }

          .summary {
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:5px;
            margin-bottom:7px;
          }

          .summary > div {
            min-width:0;
            padding:8px 6px;
            border:1px solid rgba(255,255,255,.05);
            border-radius:9px;
            background:#101010;
            text-align:center;
          }

          .summary span {
            display:block;
            color:rgba(255,255,255,.24);
            font-size:6px;
            font-weight:800;
            text-transform:uppercase;
            letter-spacing:.4px;
          }

          .summary strong {
            display:block;
            margin-top:3px;
            color:#f97316;
            font-size:13px;
            line-height:1;
          }

          .summary strong.green {
            color:#22c55e;
          }

          .accordion-list {
            display:flex;
            flex-direction:column;
            gap:5px;
          }

          .accordion {
            overflow:hidden;
            border:1px solid rgba(255,255,255,.055);
            border-radius:10px;
            background:#101010;
          }

          .accordion.open {
            border-color:rgba(249,115,22,.17);
          }

          .accordion-head {
            width:100%;
            min-height:51px;
            display:flex;
            align-items:center;
            gap:8px;
            padding:7px 9px;
            border:0;
            background:transparent;
            color:#fff;
            text-align:left;
          }

          .section-icon {
            width:29px;
            height:29px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:8px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:12px;
          }

          .section-copy {
            min-width:0;
            flex:1;
          }

          .section-copy strong {
            display:block;
            font-size:9px;
            font-weight:850;
          }

          .section-copy small {
            display:block;
            margin-top:2px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.25);
            font-size:7px;
          }

          .section-count {
            padding:4px 6px;
            border-radius:999px;
            background:rgba(249,115,22,.06);
            color:#f97316;
            font-size:6px;
            font-weight:850;
          }

          .accordion-body {
            padding:0 8px 8px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .accordion:not(.open) .accordion-body {
            display:none;
          }

          .micro-note {
            margin-top:6px;
            padding:7px 8px;
            border-left:2px solid rgba(249,115,22,.35);
            color:rgba(255,255,255,.25);
            background:rgba(249,115,22,.025);
            border-radius:0 6px 6px 0;
            font-size:6.5px;
            line-height:1.4;
          }

          .preview-list {
            display:flex;
            flex-direction:column;
          }

          .preview-list > div + div {
            border-top:1px solid rgba(255,255,255,.045);
          }

          .save-button {
            width:100%;
            min-height:39px;
            margin-top:7px;
            border:0;
            border-radius:8px;
            background:#f97316;
            color:#fff;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .save-button:disabled {
            opacity:.55;
            cursor:not-allowed;
          }

          .loading-page {
            display:grid;
            place-items:center;
          }

          .loading {
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          @media(max-width:390px) {
            .social-page {
              padding-left:8px;
              padding-right:8px;
            }

            .summary > div {
              padding-left:4px;
              padding-right:4px;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

function SocialAccordion({
  title,
  subtitle,
  icon,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  icon: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className={open ? "accordion open" : "accordion"}>
      <button
        type="button"
        className="accordion-head"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="section-icon">{icon}</span>
        <span className="section-copy">
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </span>
        <span className="section-count">
          {count > 0 ? count : open ? "−" : "+"}
        </span>
      </button>

      <div className="accordion-body">{children}</div>
    </section>
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