"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CTASettingsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    show_cta: true,
    cta_title: "¿Listo para ordenar?",
    cta_description: "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar.",
    cta_button_text: "Ordenar Ahora 🚀",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("show_cta, cta_title, cta_description, cta_button_text")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          show_cta: data.show_cta ?? true,
          cta_title: data.cta_title || "¿Listo para ordenar?",
          cta_description: data.cta_description || "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar.",
          cta_button_text: data.cta_button_text || "Ordenar Ahora 🚀",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      setSaving(true);
      await supabase
        .from("restaurants")
        .update({
          show_cta: form.show_cta,
          cta_title: form.cta_title,
          cta_description: form.cta_description,
          cta_button_text: form.cta_button_text,
        })
        .eq("id", restaurantId);

      alert("CTA actualizado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="cta-page loading-page">
        <div>Cargando configuración...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="cta">
      <main className="cta-page">
        <div className="cta-shell">
          <header className="page-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">EXPERIENCIA · CTA</span>
                <h1>Call to Action</h1>
                <p>Configura el mensaje que invita a tus clientes a ordenar.</p>
              </div>

              <span className={form.show_cta ? "status-pill active" : "status-pill"}>
                <i />
                {form.show_cta ? "Visible" : "Oculto"}
              </span>
            </div>
          </header>

          <div className="accordion-list">
            <section className="accordion open">
              <div className="section-head">
                <span className="section-icon">01</span>
                <div>
                  <strong>Visibilidad</strong>
                  <small>Activa o desactiva la sección CTA.</small>
                </div>

                <button
                  type="button"
                  className={form.show_cta ? "switch on" : "switch"}
                  aria-pressed={form.show_cta}
                  onClick={() =>
                    setForm({ ...form, show_cta: !form.show_cta })
                  }
                >
                  <span />
                </button>
              </div>
            </section>

            <section className="accordion open">
              <div className="section-head">
                <span className="section-icon">02</span>
                <div>
                  <strong>Contenido</strong>
                  <small>El mensaje que verá el cliente.</small>
                </div>
              </div>

              <div className="section-body">
                <InputField
                  label="Título"
                  placeholder="Ej. ¿Listo para ordenar?"
                  value={form.cta_title}
                  onChange={(v: string) =>
                    setForm({ ...form, cta_title: v })
                  }
                />

                <TextAreaField
                  label="Descripción"
                  placeholder="Ej. Haz tu pedido ahora y disfruta de..."
                  value={form.cta_description}
                  onChange={(v: string) =>
                    setForm({ ...form, cta_description: v })
                  }
                />

                <InputField
                  label="Texto del botón"
                  placeholder="Ej. Ordenar ahora"
                  value={form.cta_button_text}
                  onChange={(v: string) =>
                    setForm({ ...form, cta_button_text: v })
                  }
                />
              </div>
            </section>

            <section className="preview-card">
              <div className="preview-top">
                <span className="preview-label">VISTA PREVIA</span>
                <span className="preview-dot" />
              </div>

              <div className="preview-content">
                <div className="preview-copy">
                  <strong>{form.cta_title || "¿Listo para ordenar?"}</strong>
                  <p>
                    {form.cta_description ||
                      "Aquí aparecerá la descripción de tu CTA."}
                  </p>
                </div>

                <span className="preview-button">
                  {form.cta_button_text || "Ordenar ahora"}
                </span>
              </div>
            </section>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => router.back()}
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
          .cta-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .cta-shell {
            width:100%;
            max-width:620px;
            margin:0 auto;
          }

          .page-header {
            margin-bottom:8px;
          }

          .header-row {
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:8px;
            margin-top:8px;
          }

          .header-row > div {
            min-width:0;
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
            margin:4px 0 0;
            color:rgba(255,255,255,.32);
            font-size:8px;
            line-height:1.4;
          }

          .status-pill {
            display:inline-flex;
            align-items:center;
            gap:4px;
            flex:0 0 auto;
            padding:4px 7px;
            border-radius:999px;
            background:rgba(239,68,68,.07);
            color:#ef4444;
            font-size:6px;
            font-weight:850;
            text-transform:uppercase;
          }

          .status-pill.active {
            background:rgba(34,197,94,.07);
            color:#22c55e;
          }

          .status-pill i {
            width:5px;
            height:5px;
            border-radius:50%;
            background:currentColor;
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

          .section-head {
            min-height:51px;
            display:flex;
            align-items:center;
            gap:8px;
            padding:7px 9px;
            box-sizing:border-box;
          }

          .section-icon {
            width:29px;
            height:29px;
            display:grid;
            place-items:center;
            flex:0 0 29px;
            border-radius:8px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:7px;
            font-weight:900;
          }

          .section-head > div {
            min-width:0;
            flex:1;
          }

          .section-head strong {
            display:block;
            font-size:9px;
            font-weight:850;
          }

          .section-head small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.24);
            font-size:6.5px;
          }

          .section-body {
            padding:0 9px 9px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .field {
            display:block;
            width:100%;
            margin:0 0 9px;
            box-sizing:border-box;
          }

          .field:last-child {
            margin-bottom:0;
          }

          .field > span {
            display:block;
            width:100%;
            margin:0 0 4px;
            color:rgba(255,255,255,.48);
            font-size:7px;
            line-height:1.2;
            font-weight:800;
          }

          .field input,
          .field textarea {
            display:block;
            width:100%;
            max-width:100%;
            min-width:0;
            box-sizing:border-box;
            border:1px solid rgba(255,255,255,.07);
            border-radius:8px;
            background:#090909;
            color:#fff;
            padding:9px 10px;
            outline:none;
            font:500 8px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            resize:vertical;
            -webkit-appearance:none;
          }

          .field input {
            height:38px;
          }

          .field textarea {
            min-height:76px;
          }

          .field input::placeholder,
          .field textarea::placeholder {
            color:rgba(255,255,255,.17);
          }

          .field input:focus,
          .field textarea:focus {
            border-color:rgba(249,115,22,.4);
            box-shadow:0 0 0 3px rgba(249,115,22,.045);
          }

          .switch {
            width:34px;
            height:19px;
            padding:2px;
            flex:0 0 34px;
            border:0;
            border-radius:999px;
            background:#2b2b2b;
            cursor:pointer;
          }

          .switch span {
            display:block;
            width:15px;
            height:15px;
            border-radius:50%;
            background:#fff;
            transition:.16s;
          }

          .switch.on {
            background:#16a34a;
          }

          .switch.on span {
            transform:translateX(15px);
          }

          .preview-card {
            padding:10px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:10px;
            background:#101010;
          }

          .preview-top {
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:8px;
          }

          .preview-label {
            color:#f97316;
            font-size:5.5px;
            font-weight:900;
            letter-spacing:.8px;
          }

          .preview-dot {
            width:5px;
            height:5px;
            border-radius:50%;
            background:${form.show_cta ? "#22c55e" : "#ef4444"};
          }

          .preview-content {
            display:flex;
            align-items:center;
            gap:9px;
            padding:10px;
            border:1px solid rgba(249,115,22,.12);
            border-radius:8px;
            background:rgba(249,115,22,.025);
          }

          .preview-copy {
            min-width:0;
            flex:1;
          }

          .preview-copy strong {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:9px;
            font-weight:900;
          }

          .preview-copy p {
            margin:3px 0 0;
            overflow:hidden;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            color:rgba(255,255,255,.3);
            font-size:6.5px;
            line-height:1.4;
          }

          .preview-button {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-height:29px;
            max-width:100px;
            padding:0 9px;
            flex:0 0 auto;
            overflow:hidden;
            border-radius:7px;
            background:#f97316;
            color:#fff;
            text-overflow:ellipsis;
            white-space:nowrap;
            font:850 6.5px system-ui,sans-serif;
          }

          .actions {
            display:grid;
            grid-template-columns:1fr 1.35fr;
            gap:5px;
            margin-top:7px;
          }

          .actions button {
            min-height:39px;
            border-radius:8px;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .primary-button {
            border:0;
            background:#f97316;
            color:#fff;
          }

          .secondary-button {
            border:1px solid rgba(255,255,255,.06);
            background:#111;
            color:rgba(255,255,255,.5);
          }

          .actions button:disabled {
            opacity:.5;
            cursor:not-allowed;
          }

          .loading-page {
            display:grid;
            place-items:center;
          }

          .loading-page > div {
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          @media(max-width:390px) {
            .cta-page {
              padding-left:8px;
              padding-right:8px;
            }

            .status-pill {
              display:none;
            }

            .preview-content {
              align-items:flex-start;
            }

            .preview-button {
              max-width:82px;
            }
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

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
}: any) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        rows={3}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}