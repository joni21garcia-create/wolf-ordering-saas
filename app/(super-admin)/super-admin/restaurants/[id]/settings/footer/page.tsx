"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function FooterSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    footer_text: "",
    slogan: "",
    whatsapp_number: "",
    address: "",
    show_footer_socials: true,
    show_footer_copyright: true,
    show_wolf_branding: true,
    show_instagram: true,
    show_facebook: true,
    show_tiktok: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("footer_text, slogan, whatsapp_number, address, show_footer_socials, show_footer_copyright, show_wolf_branding, show_instagram, show_facebook, show_tiktok")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          footer_text: data.footer_text || "",
          slogan: data.slogan || "",
          whatsapp_number: data.whatsapp_number || "",
          address: data.address || "",
          show_footer_socials: data.show_footer_socials ?? true,
          show_footer_copyright: data.show_footer_copyright ?? true,
          show_wolf_branding: data.show_wolf_branding ?? true,
          show_instagram: data.show_instagram ?? true,
          show_facebook: data.show_facebook ?? true,
          show_tiktok: data.show_tiktok ?? true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      setSaving(true);
      await supabase.from("restaurants").update(form).eq("id", restaurantId);
      alert("Footer actualizado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="footer-page loading-page">
        <div>Cargando configuración...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="footer">
      <main className="footer-page">
        <div className="footer-shell">
          <header className="page-header">
            <BackToSettings restaurantId={restaurantId} />
            <div className="header-row">
              <div className="header-copy">
                <span className="eyebrow">EXPERIENCIA · FOOTER</span>
                <h1>Footer</h1>
                <p>Configura la información que aparece al final de tu restaurante.</p>
              </div>
            </div>
          </header>

          <div className="accordion-list">
            <section className="accordion open">
              <div className="section-head">
                <span className="section-icon">01</span>
                <div>
                  <strong>Información</strong>
                  <small>Los datos principales del footer.</small>
                </div>
              </div>
              <div className="section-body">
                <InputField
                  label="Slogan / Descripción"
                  placeholder="Ej. Sabor que conecta."
                  value={form.slogan}
                  onChange={(v: string) => setForm({ ...form, slogan: v })}
                />
                <InputField
                  label="WhatsApp"
                  placeholder="Ej. +57 300 000 0000"
                  value={form.whatsapp_number}
                  onChange={(v: string) => setForm({ ...form, whatsapp_number: v })}
                />
                <InputField
                  label="Dirección"
                  placeholder="Ej. Calle 10 #20-30"
                  value={form.address}
                  onChange={(v: string) => setForm({ ...form, address: v })}
                />
                <InputField
                  label="Texto de Copyright"
                  placeholder="Ej. © 2026 Restaurante"
                  value={form.footer_text}
                  onChange={(v: string) => setForm({ ...form, footer_text: v })}
                />
              </div>
            </section>

            <section className="accordion">
              <details>
                <summary>
                  <span className="section-icon">02</span>
                  <span className="summary-copy">
                    <strong>Redes sociales</strong>
                    <small>
                      {form.show_footer_socials
                        ? "Sección visible"
                        : "Sección oculta"}
                    </small>
                  </span>
                  <span className="summary-chevron">+</span>
                </summary>
                <div className="section-body">
                  <div className="switch-row">
                    <div>
                      <strong>Mostrar redes sociales</strong>
                      <small>Activa o desactiva todo el bloque.</small>
                    </div>
                    <SwitchField
                      checked={form.show_footer_socials}
                      onChange={(v) =>
                        setForm({ ...form, show_footer_socials: v })
                      }
                    />
                  </div>

                  {form.show_footer_socials && (
                    <div className="social-list">
                      <SwitchField
                        label="Instagram"
                        checked={form.show_instagram}
                        onChange={(v) => setForm({ ...form, show_instagram: v })}
                      />
                      <SwitchField
                        label="Facebook"
                        checked={form.show_facebook}
                        onChange={(v) => setForm({ ...form, show_facebook: v })}
                      />
                      <SwitchField
                        label="TikTok"
                        checked={form.show_tiktok}
                        onChange={(v) => setForm({ ...form, show_tiktok: v })}
                      />
                    </div>
                  )}
                </div>
              </details>
            </section>

            <section className="accordion">
              <details>
                <summary>
                  <span className="section-icon">03</span>
                  <span className="summary-copy">
                    <strong>Branding</strong>
                    <small>Elementos adicionales del pie.</small>
                  </span>
                  <span className="summary-chevron">+</span>
                </summary>
                <div className="section-body">
                  <SwitchField
                    label="Mostrar Copyright"
                    checked={form.show_footer_copyright}
                    onChange={(v) =>
                      setForm({ ...form, show_footer_copyright: v })
                    }
                  />
                  <SwitchField
                    label="Mostrar Wolf Branding"
                    checked={form.show_wolf_branding}
                    onChange={(v) =>
                      setForm({ ...form, show_wolf_branding: v })
                    }
                  />
                </div>
              </details>
            </section>

            <section className="preview-card">
              <div className="preview-top">
                <span className="preview-label">VISTA PREVIA</span>
                <span className="preview-dot" />
              </div>
              <strong>{form.slogan || "Tu restaurante"}</strong>
              <p>{form.address || "Dirección del restaurante"}</p>
              <div className="preview-meta">
                {form.show_footer_socials && (
                  <span>
                    {[
                      form.show_instagram && "Instagram",
                      form.show_facebook && "Facebook",
                      form.show_tiktok && "TikTok",
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Sin redes"}
                  </span>
                )}
                {form.show_footer_copyright && (
                  <span>{form.footer_text || "© Restaurante"}</span>
                )}
                {form.show_wolf_branding && <span>Powered by Wolf</span>}
              </div>
            </section>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => window.history.back()}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={saveData}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <style jsx global>{`
          .footer-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }
          .footer-shell { width:100%; max-width:620px; margin:0 auto; }
          .page-header { margin-bottom:8px; }
          .header-row { margin-top:8px; }
          .header-copy { min-width:0; }
          .eyebrow {
            display:block; color:#f97316; font-size:7px;
            font-weight:900; letter-spacing:1.2px;
          }
          .header-copy h1 {
            margin:2px 0 0; font-size:23px; line-height:1.05;
            letter-spacing:-.55px; font-weight:900;
          }
          .header-copy p {
            margin:4px 0 0; color:rgba(255,255,255,.32);
            font-size:8px; line-height:1.4;
          }
          .accordion-list { display:flex; flex-direction:column; gap:5px; }
          .accordion {
            overflow:hidden; border:1px solid rgba(255,255,255,.055);
            border-radius:10px; background:#101010;
          }
          .accordion.open { border-color:rgba(249,115,22,.17); }
          .section-head, .accordion summary {
            min-height:51px; display:flex; align-items:center; gap:8px;
            padding:7px 9px; box-sizing:border-box;
          }
          .accordion summary { list-style:none; cursor:pointer; }
          .accordion summary::-webkit-details-marker { display:none; }
          .section-icon {
            width:29px; height:29px; display:grid; place-items:center;
            flex:0 0 29px; border-radius:8px;
            background:rgba(249,115,22,.07); color:#f97316;
            font-size:7px; font-weight:900;
          }
          .section-head > div, .summary-copy { min-width:0; flex:1; }
          .section-head strong, .summary-copy strong {
            display:block; font-size:9px; font-weight:850;
          }
          .section-head small, .summary-copy small {
            display:block; margin-top:2px; overflow:hidden;
            text-overflow:ellipsis; white-space:nowrap;
            color:rgba(255,255,255,.24); font-size:6.5px;
          }
          .summary-chevron {
            width:23px; height:23px; display:grid; place-items:center;
            flex:0 0 23px; border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.35); font-size:11px;
          }
          .section-body {
            padding:0 9px 9px; border-top:1px solid rgba(255,255,255,.045);
          }
          .field {
            display:block; width:100%; margin:0 0 9px; box-sizing:border-box;
          }
          .field:last-child { margin-bottom:0; }
          .field > span {
            display:block; margin:0 0 4px; color:rgba(255,255,255,.48);
            font-size:7px; line-height:1.2; font-weight:800;
          }
          .field input {
            display:block; width:100%; height:38px; box-sizing:border-box;
            border:1px solid rgba(255,255,255,.07); border-radius:8px;
            background:#090909; color:#fff; padding:9px 10px; outline:none;
            font:500 8px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }
          .field input::placeholder { color:rgba(255,255,255,.17); }
          .field input:focus {
            border-color:rgba(249,115,22,.4);
            box-shadow:0 0 0 3px rgba(249,115,22,.045);
          }
          .switch-row {
            display:flex; align-items:center; justify-content:space-between;
            gap:8px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,.045);
          }
          .switch-row > div { min-width:0; }
          .switch-row strong { display:block; font-size:8px; font-weight:850; }
          .switch-row small {
            display:block; margin-top:2px; color:rgba(255,255,255,.23); font-size:6.5px;
          }
          .switch {
            width:34px; height:19px; padding:2px; flex:0 0 34px;
            border:0; border-radius:999px; background:#2b2b2b; cursor:pointer;
          }
          .switch span {
            display:block; width:15px; height:15px; border-radius:50%;
            background:#fff; transition:.16s;
          }
          .switch.on { background:#16a34a; }
          .switch.on span { transform:translateX(15px); }
          .social-list { padding-top:2px; }
          .social-list .switch-row:last-child { border-bottom:0; }
          .preview-card {
            padding:10px; border:1px solid rgba(255,255,255,.055);
            border-radius:10px; background:#101010;
          }
          .preview-top {
            display:flex; align-items:center; justify-content:space-between;
            margin-bottom:8px;
          }
          .preview-label {
            color:#f97316; font-size:5.5px; font-weight:900; letter-spacing:.8px;
          }
          .preview-dot { width:5px; height:5px; border-radius:50%; background:#22c55e; }
          .preview-card > strong {
            display:block; overflow:hidden; text-overflow:ellipsis;
            white-space:nowrap; font-size:9px; font-weight:900;
          }
          .preview-card > p {
            margin:3px 0 0; overflow:hidden; text-overflow:ellipsis;
            white-space:nowrap; color:rgba(255,255,255,.3); font-size:6.5px;
          }
          .preview-meta {
            display:flex; flex-wrap:wrap; gap:4px; margin-top:8px;
          }
          .preview-meta span {
            padding:4px 6px; border-radius:999px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.3); font-size:5.5px;
          }
          .actions {
            display:grid; grid-template-columns:1fr 1.35fr;
            gap:5px; margin-top:7px;
          }
          .actions button {
            min-height:39px; border-radius:8px;
            font:850 8px system-ui,sans-serif; cursor:pointer;
          }
          .primary-button { border:0; background:#f97316; color:#fff; }
          .secondary-button {
            border:1px solid rgba(255,255,255,.06);
            background:#111; color:rgba(255,255,255,.5);
          }
          .actions button:disabled { opacity:.5; cursor:not-allowed; }
          .loading-page { display:grid; place-items:center; }
          .loading-page > div { color:rgba(255,255,255,.3); font-size:9px; }
          @media(max-width:390px) {
            .footer-page { padding-left:8px; padding-right:8px; }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder = "",
}: any) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SwitchField({
  label,
  checked,
  onChange,
}: {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="switch-row">
      {label ? (
        <div>
          <strong>{label}</strong>
        </div>
      ) : (
        <div />
      )}
      <button
        type="button"
        className={checked ? "switch on" : "switch"}
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}