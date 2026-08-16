"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function AboutSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    about_title: "",
    about_description: "",
    show_about: true,
    about_stat1_value: "",
    about_stat1_label: "",
    show_about_stat1: true,
    about_stat2_value: "",
    about_stat2_label: "",
    show_about_stat2: true,
    about_stat3_value: "",
    about_stat3_label: "",
    show_about_stat3: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("about_title, about_description, show_about, about_stat1_value, about_stat1_label, show_about_stat1, about_stat2_value, about_stat2_label, show_about_stat2, about_stat3_value, about_stat3_label, show_about_stat3")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          about_title: data.about_title || "Nuestra Historia",
          about_description: data.about_description || "",
          show_about: data.show_about ?? true,
          about_stat1_value: data.about_stat1_value || "5000+",
          about_stat1_label: data.about_stat1_label || "Clientes satisfechos",
          show_about_stat1: data.show_about_stat1 ?? true,
          about_stat2_value: data.about_stat2_value || "4.9★",
          about_stat2_label: data.about_stat2_label || "Calificación promedio",
          show_about_stat2: data.show_about_stat2 ?? true,
          about_stat3_value: data.about_stat3_value || "10+",
          about_stat3_label: data.about_stat3_label || "Años de experiencia",
          show_about_stat3: data.show_about_stat3 ?? true,
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
      alert("Configuración actualizada correctamente");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="about-page loading-page">
        <div>Cargando configuración...</div>
      </main>
    );
  }

  const visibleStats = [1, 2, 3].filter(
    (num) => form[`show_about_stat${num}` as keyof typeof form]
  ).length;

  return (
    <PermissionGuard permission="about">
      <main className="about-page">
        <div className="about-shell">
          <header className="page-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div className="header-copy">
                <span className="eyebrow">EXPERIENCIA · HISTORIA</span>
                <h1>Nuestra Historia</h1>
                <p>Cuenta quién eres y muestra tus datos clave.</p>
              </div>

              <button
                type="button"
                className={form.show_about ? "switch on" : "switch"}
                aria-label={form.show_about ? "Ocultar sección" : "Mostrar sección"}
                aria-pressed={form.show_about}
                onClick={() =>
                  setForm({ ...form, show_about: !form.show_about })
                }
              >
                <span />
              </button>
            </div>

            <div className="status-row">
              <span className={form.show_about ? "status-pill active" : "status-pill"}>
                <i />
                {form.show_about ? "Visible" : "Oculta"}
              </span>
              <span className="stat-count">
                {visibleStats} de 3 estadísticas visibles
              </span>
            </div>
          </header>

          <div className="accordion-list">
            <section className="accordion open">
              <div className="section-head">
                <span className="section-icon">01</span>
                <div>
                  <strong>Información</strong>
                  <small>Título y descripción de tu historia.</small>
                </div>
              </div>

              <div className="section-body">
                <InputField
                  label="Título"
                  placeholder="Ej. Nuestra Historia"
                  value={form.about_title}
                  onChange={(v: string) =>
                    setForm({ ...form, about_title: v })
                  }
                />

                <TextareaField
                  label="Historia"
                  placeholder="Cuenta brevemente la historia de tu restaurante..."
                  value={form.about_description}
                  onChange={(v: string) =>
                    setForm({ ...form, about_description: v })
                  }
                />
              </div>
            </section>

            {[1, 2, 3].map((num) => {
              const valueKey =
                `about_stat${num}_value` as keyof typeof form;
              const labelKey =
                `about_stat${num}_label` as keyof typeof form;
              const visibleKey =
                `show_about_stat${num}` as keyof typeof form;

              const isVisible = Boolean(form[visibleKey]);
              const value = String(form[valueKey] || "");
              const label = String(form[labelKey] || "");

              return (
                <section className="accordion" key={num}>
                  <details>
                    <summary>
                      <span className="section-icon">
                        0{num + 1}
                      </span>

                      <span className="summary-copy">
                        <strong>Estadística {num}</strong>
                        <small>
                          {value || "Sin valor"} · {label || "Sin etiqueta"}
                        </small>
                      </span>

                      <span
                        className={
                          isVisible
                            ? "mini-status visible"
                            : "mini-status hidden"
                        }
                      >
                        {isVisible ? "Visible" : "Oculta"}
                      </span>

                      <span className="summary-chevron">+</span>
                    </summary>

                    <div className="section-body">
                      <div className="stat-grid">
                        <InputField
                          label="Valor"
                          placeholder={num === 1 ? "5000+" : num === 2 ? "4.9★" : "10+"}
                          value={form[valueKey]}
                          onChange={(v: string) =>
                            setForm({ ...form, [valueKey]: v })
                          }
                        />

                        <InputField
                          label="Etiqueta"
                          placeholder={
                            num === 1
                              ? "Clientes satisfechos"
                              : num === 2
                                ? "Calificación promedio"
                                : "Años de experiencia"
                          }
                          value={form[labelKey]}
                          onChange={(v: string) =>
                            setForm({ ...form, [labelKey]: v })
                          }
                        />
                      </div>

                      <div className="switch-row">
                        <div>
                          <strong>Mostrar estadística</strong>
                          <small>
                            Aparece dentro de la sección pública.
                          </small>
                        </div>

                        <button
                          type="button"
                          className={isVisible ? "switch on" : "switch"}
                          aria-pressed={isVisible}
                          onClick={() =>
                            setForm({
                              ...form,
                              [visibleKey]: !isVisible,
                            })
                          }
                        >
                          <span />
                        </button>
                      </div>
                    </div>
                  </details>
                </section>
              );
            })}

            <section className="preview-card">
              <div className="preview-top">
                <span className="preview-label">VISTA PREVIA</span>
                <span
                  className={
                    form.show_about ? "preview-dot active" : "preview-dot"
                  }
                />
              </div>

              <div className="preview-copy">
                <strong>
                  {form.about_title || "Nuestra Historia"}
                </strong>
                <p>
                  {form.about_description ||
                    "Aquí aparecerá la historia de tu restaurante."}
                </p>
              </div>

              {form.show_about && visibleStats > 0 && (
                <div className="preview-stats">
                  {[1, 2, 3].map((num) => {
                    const visibleKey =
                      `show_about_stat${num}` as keyof typeof form;
                    if (!form[visibleKey]) return null;

                    const valueKey =
                      `about_stat${num}_value` as keyof typeof form;
                    const labelKey =
                      `about_stat${num}_label` as keyof typeof form;

                    return (
                      <div className="preview-stat" key={num}>
                        <strong>{String(form[valueKey] || "—")}</strong>
                        <span>{String(form[labelKey] || "—")}</span>
                      </div>
                    );
                  })}
                </div>
              )}
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
          .about-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .about-shell {
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
            gap:10px;
            margin-top:8px;
          }

          .header-copy {
            min-width:0;
            flex:1;
          }

          .eyebrow {
            display:block;
            color:#f97316;
            font-size:7px;
            font-weight:900;
            letter-spacing:1.2px;
          }

          .header-copy h1 {
            margin:2px 0 0;
            font-size:23px;
            line-height:1.05;
            letter-spacing:-.55px;
            font-weight:900;
          }

          .header-copy p {
            margin:4px 0 0;
            color:rgba(255,255,255,.32);
            font-size:8px;
            line-height:1.4;
          }

          .status-row {
            display:flex;
            align-items:center;
            gap:6px;
            margin-top:6px;
          }

          .status-pill {
            display:inline-flex;
            align-items:center;
            gap:4px;
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

          .stat-count {
            color:rgba(255,255,255,.2);
            font-size:6px;
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

          .section-head,
          .accordion summary {
            min-height:51px;
            display:flex;
            align-items:center;
            gap:8px;
            padding:7px 9px;
            box-sizing:border-box;
          }

          .accordion summary {
            list-style:none;
            cursor:pointer;
          }

          .accordion summary::-webkit-details-marker {
            display:none;
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

          .section-head > div,
          .summary-copy {
            min-width:0;
            flex:1;
          }

          .section-head strong,
          .summary-copy strong {
            display:block;
            font-size:9px;
            font-weight:850;
          }

          .section-head small,
          .summary-copy small {
            display:block;
            margin-top:2px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.24);
            font-size:6.5px;
          }

          .summary-chevron {
            width:23px;
            height:23px;
            display:grid;
            place-items:center;
            flex:0 0 23px;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.35);
            font-size:11px;
          }

          .mini-status {
            padding:3px 5px;
            border-radius:999px;
            font-size:5px;
            font-weight:850;
            text-transform:uppercase;
          }

          .mini-status.visible {
            color:#22c55e;
            background:rgba(34,197,94,.07);
          }

          .mini-status.hidden {
            color:rgba(255,255,255,.25);
            background:rgba(255,255,255,.04);
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
            min-height:82px;
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

          .stat-grid {
            display:grid;
            grid-template-columns:1fr 1.35fr;
            gap:7px;
            padding-top:9px;
          }

          .switch-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            padding-top:9px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .switch-row > div {
            min-width:0;
          }

          .switch-row strong {
            display:block;
            font-size:8px;
            font-weight:850;
          }

          .switch-row small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.23);
            font-size:6.5px;
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
            background:#ef4444;
          }

          .preview-dot.active {
            background:#22c55e;
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
            display:-webkit-box;
            overflow:hidden;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:3;
            color:rgba(255,255,255,.3);
            font-size:6.5px;
            line-height:1.45;
          }

          .preview-stats {
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:5px;
            margin-top:8px;
          }

          .preview-stat {
            min-width:0;
            padding:7px 5px;
            border:1px solid rgba(255,255,255,.045);
            border-radius:7px;
            background:rgba(255,255,255,.02);
            text-align:center;
          }

          .preview-stat strong {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:#f97316;
            font-size:9px;
            font-weight:900;
          }

          .preview-stat span {
            display:block;
            margin-top:2px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.25);
            font-size:5.5px;
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
            .about-page {
              padding-left:8px;
              padding-right:8px;
            }

            .stat-count {
              display:none;
            }

            .stat-grid {
              grid-template-columns:1fr;
            }

            .preview-stats {
              gap:4px;
            }

            .preview-stat {
              padding:6px 3px;
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

function TextareaField({
  label,
  value,
  onChange,
  placeholder = "",
}: any) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        rows={4}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}