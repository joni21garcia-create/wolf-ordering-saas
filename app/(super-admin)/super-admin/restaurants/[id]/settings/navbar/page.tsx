"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function NavbarSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { upload, uploading, progress } = useImageUpload();

  const [form, setForm] = useState({
    logo_url: "",
    name: "",
    navbar_button_text: "Ordenar Ahora",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("logo_url, name, navbar_button_text")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          logo_url: data.logo_url || "",
          name: data.name || "",
          navbar_button_text: data.navbar_button_text || "Ordenar Ahora",
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
          logo_url: form.logo_url,
          name: form.name,
          navbar_button_text: form.navbar_button_text,
        })
        .eq("id", restaurantId);
      alert("Navbar actualizado");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const result = await upload({ file, restaurantId, preset: "logo" });
      if (!result.success) throw new Error(result.error);
      setForm((prev) => ({ ...prev, logo_url: result.url! }));
    } catch (err) {
      console.error(err);
      alert("Error subiendo imagen");
    }
  };

  if (loading) {
    return (
      <main className="navbar-page loading-page">
        <div>Cargando configuración...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="navbar">
      <main className="navbar-page">
        <div className="navbar-shell">
          <header className="page-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div className="header-copy">
                <span className="eyebrow">EXPERIENCIA · NAVBAR</span>
                <h1>Navbar</h1>
                <p>Configura la identidad que aparece en el menú superior.</p>
              </div>

              <span className="status-pill active">
                <i />
                Activo
              </span>
            </div>
          </header>

          <div className="accordion-list">
            <section className="accordion open">
              <div className="section-head">
                <span className="section-icon">01</span>
                <div>
                  <strong>Logo</strong>
                  <small>Imagen que identifica al restaurante.</small>
                </div>
                <span className="section-mark">●</span>
              </div>

              <div className="section-body">
                <div className="logo-upload">
                  <div className="logo-preview">
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="Logo del restaurante" />
                    ) : (
                      <span>{form.name?.trim()?.charAt(0) || "W"}</span>
                    )}
                  </div>

                  <div className="upload-copy">
                    <strong>{form.logo_url ? "Logo actual" : "Sin logo"}</strong>
                    <small>PNG, JPG o WEBP · recomendado cuadrado</small>

                    <label className="upload-button">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          uploadLogo(e.target.files[0])
                        }
                        disabled={uploading}
                      />
                      {uploading ? `Subiendo ${progress}%` : "Cambiar logo"}
                    </label>
                  </div>
                </div>

                {uploading && (
                  <div className="progress-wrap">
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="accordion open">
              <div className="section-head">
                <span className="section-icon">02</span>
                <div>
                  <strong>Identidad</strong>
                  <small>Nombre y texto principal del botón.</small>
                </div>
              </div>

              <div className="section-body">
                <InputField
                  label="Nombre del restaurante"
                  placeholder="Ej. Wolf Burger"
                  value={form.name}
                  onChange={(v: string) =>
                    setForm({ ...form, name: v })
                  }
                />

                <InputField
                  label="Texto del botón"
                  placeholder="Ej. Ordenar Ahora"
                  value={form.navbar_button_text}
                  onChange={(v: string) =>
                    setForm({ ...form, navbar_button_text: v })
                  }
                />
              </div>
            </section>

            <section className="accordion">
              <details>
                <summary>
                  <span className="section-icon">03</span>
                  <span className="summary-copy">
                    <strong>Vista previa</strong>
                    <small>Así se verá la navbar del restaurante.</small>
                  </span>
                  <span className="summary-chevron">+</span>
                </summary>

                <div className="preview-body">
                  <div className="navbar-preview">
                    <div className="preview-brand">
                      <div className="preview-logo">
                        {form.logo_url ? (
                          <img
                            src={form.logo_url}
                            alt=""
                          />
                        ) : (
                          <span>
                            {form.name?.trim()?.charAt(0) || "W"}
                          </span>
                        )}
                      </div>

                      <strong>
                        {form.name || "Nombre restaurante"}
                      </strong>
                    </div>

                    <span className="preview-order">
                      {form.navbar_button_text || "Ordenar Ahora"}
                    </span>
                  </div>
                </div>
              </details>
            </section>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => window.history.back()}
              disabled={saving || uploading}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={saveData}
              disabled={saving || uploading}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <style jsx global>{`
          .navbar-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .navbar-shell {
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
            margin:3px 0 0;
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

          .status-pill {
            display:inline-flex;
            align-items:center;
            gap:4px;
            flex:0 0 auto;
            padding:4px 7px;
            border-radius:999px;
            background:rgba(34,197,94,.07);
            color:#22c55e;
            font-size:6px;
            font-weight:850;
            text-transform:uppercase;
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

          .section-mark {
            color:#22c55e;
            font-size:8px;
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

          .section-body,
          .preview-body {
            padding:10px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .logo-upload {
            display:flex;
            align-items:center;
            gap:10px;
            min-width:0;
          }

          .logo-preview {
            width:58px;
            height:58px;
            display:grid;
            place-items:center;
            flex:0 0 58px;
            overflow:hidden;
            border:1px solid rgba(249,115,22,.25);
            border-radius:14px;
            background:#181818;
            color:#f97316;
            font-size:17px;
            font-weight:900;
          }

          .logo-preview img {
            width:100%;
            height:100%;
            display:block;
            object-fit:cover;
          }

          .upload-copy {
            min-width:0;
            flex:1;
          }

          .upload-copy strong {
            display:block;
            font-size:8px;
            font-weight:850;
          }

          .upload-copy small {
            display:block;
            margin:3px 0 7px;
            color:rgba(255,255,255,.24);
            font-size:6px;
          }

          .upload-button {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-height:28px;
            padding:0 9px;
            border:1px solid rgba(249,115,22,.18);
            border-radius:7px;
            background:rgba(249,115,22,.06);
            color:#f97316;
            font-size:6.5px;
            font-weight:850;
            cursor:pointer;
          }

          .upload-button input {
            display:none;
          }

          .progress-wrap {
            height:3px;
            margin-top:9px;
            overflow:hidden;
            border-radius:999px;
            background:rgba(255,255,255,.06);
          }

          .progress-bar {
            height:100%;
            border-radius:inherit;
            background:#f97316;
            transition:width .15s ease;
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
            margin:0 0 4px;
            color:rgba(255,255,255,.48);
            font-size:7px;
            line-height:1.2;
            font-weight:800;
          }

          .field input {
            display:block;
            width:100%;
            height:38px;
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
            -webkit-appearance:none;
          }

          .field input::placeholder {
            color:rgba(255,255,255,.17);
          }

          .field input:focus {
            border-color:rgba(249,115,22,.4);
            box-shadow:0 0 0 3px rgba(249,115,22,.045);
          }

          .navbar-preview {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            min-width:0;
            padding:8px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:9px;
            background:#090909;
          }

          .preview-brand {
            min-width:0;
            display:flex;
            align-items:center;
            gap:7px;
          }

          .preview-logo {
            width:27px;
            height:27px;
            display:grid;
            place-items:center;
            flex:0 0 27px;
            overflow:hidden;
            border-radius:8px;
            background:#181818;
            color:#f97316;
            font-size:8px;
            font-weight:900;
          }

          .preview-logo img {
            width:100%;
            height:100%;
            object-fit:cover;
          }

          .preview-brand strong {
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:8px;
            font-weight:850;
          }

          .preview-order {
            flex:0 0 auto;
            max-width:120px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            padding:7px 9px;
            border-radius:7px;
            background:#f97316;
            color:#fff;
            font-size:6.5px;
            font-weight:850;
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
            .navbar-page {
              padding-left:8px;
              padding-right:8px;
            }

            .status-pill {
              display:none;
            }

            .logo-upload {
              align-items:flex-start;
            }

            .navbar-preview {
              align-items:flex-start;
            }

            .preview-order {
              max-width:92px;
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
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}