"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewPaymentQRPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    qr_image_url: "",
    account_holder: "",
    account_number: "",
    active: true,
  });

  const uploadQR = async (file: File) => {
    try {
      setUploading(true);
 
const formData = new FormData();

formData.append("file", file);

const response = await fetch(
  "/api/payment-qrs/upload",
  {
    method: "POST",
    body: formData,
  }
);

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.error);
}

setForm((prev) => ({
  ...prev,
  qr_image_url: data.url,
}));

    } catch (error) {
      console.error(error);
      alert("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const saveQR = async () => {
    if (!form.name.trim() || !form.qr_image_url) return alert("Completa los campos obligatorios");

    try {
      setSaving(true);
      const { data: existing } = await supabase
        .from("restaurant_payment_qrs")
        .select("id")
        .eq("restaurant_id", restaurantId);

      const { error } = await supabase.from("restaurant_payment_qrs").insert({
        restaurant_id: restaurantId,
        ...form,
        sort_order: (existing?.length || 0) + 1,
      });

      if (error) throw error;
      router.push(`/super-admin/restaurants/${restaurantId}/settings/payments/qrs`);
    } catch (error) {
      console.error(error);
      alert("Error guardando el QR");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="qr-page">
      <div className="qr-shell">
        <header className="qr-header">
          <button
            type="button"
            className="back-button"
            onClick={() => router.back()}
            aria-label="Volver"
          >
            ←
          </button>

          <div className="header-copy">
            <span className="eyebrow">PAGOS · QR</span>
            <h1>Nuevo QR</h1>
            <p>Configura un código QR para tus clientes.</p>
          </div>
        </header>

        <form
          className="qr-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveQR();
          }}
        >
          <section className="section">
            <div className="section-heading">
              <span>01</span>
              <div>
                <strong>Información</strong>
                <small>Identifica este método de pago.</small>
              </div>
            </div>

            <label className="field">
              <span>Nombre</span>
              <input
                placeholder="Ej. Banco Pichincha"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Titular de la cuenta</span>
              <input
                placeholder="Nombre del titular"
                value={form.account_holder}
                onChange={(e) =>
                  setForm({
                    ...form,
                    account_holder: e.target.value,
                  })
                }
                autoComplete="name"
              />
            </label>

            <label className="field">
              <span>Número de cuenta / teléfono</span>
              <input
                placeholder="Número o teléfono asociado"
                value={form.account_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    account_number: e.target.value,
                  })
                }
                inputMode="text"
              />
            </label>
          </section>

          <section className="section">
            <div className="section-heading">
              <span>02</span>
              <div>
                <strong>Imagen QR</strong>
                <small>Sube una imagen clara y legible.</small>
              </div>
            </div>

            <label className={`upload ${form.qr_image_url ? "has-image" : ""}`}>
              {form.qr_image_url ? (
                <img src={form.qr_image_url} alt="Vista previa del QR" />
              ) : (
                <div className="upload-empty">
                  <span className="upload-icon">▦</span>
                  <strong>Agregar código QR</strong>
                  <small>Toca aquí para seleccionar una imagen</small>
                  <small>JPG o PNG</small>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadQR(file);
                  e.currentTarget.value = "";
                }}
              />

              {uploading && (
                <div className="uploading">Subiendo QR...</div>
              )}

              {form.qr_image_url && !uploading && (
                <span className="change-image">Cambiar imagen</span>
              )}
            </label>
          </section>

          <section className="section">
            <div className="section-heading">
              <span>03</span>
              <div>
                <strong>Estado</strong>
                <small>Controla si aparece disponible.</small>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <strong>QR activo</strong>
                <small>Los clientes podrán utilizarlo.</small>
              </div>

              <button
                type="button"
                className={form.active ? "switch on" : "switch"}
                aria-pressed={form.active}
                onClick={() =>
                  setForm({
                    ...form,
                    active: !form.active,
                  })
                }
              >
                <span />
              </button>
            </div>
          </section>

          <section className="preview">
            <div className="preview-heading">
              <div>
                <span className="eyebrow">VISTA PREVIA</span>
                <strong>Así lo verás</strong>
              </div>
              <span className={form.active ? "preview-status active" : "preview-status"}>
                {form.active ? "Activo" : "Oculto"}
              </span>
            </div>

            <div className="preview-card">
              <div className="preview-image">
                {form.qr_image_url ? (
                  <img src={form.qr_image_url} alt="Preview QR" />
                ) : (
                  <div className="preview-empty">
                    <span>▦</span>
                    <small>Sin imagen</small>
                  </div>
                )}
              </div>

              <div className="preview-copy">
                <strong>{form.name || "Nombre del método"}</strong>
                <span>
                  {form.account_holder || "Titular de la cuenta"}
                </span>
                <small>
                  {form.account_number || "Número de cuenta / teléfono"}
                </small>
              </div>
            </div>
          </section>

          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => router.back()}
              disabled={saving || uploading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving || uploading}
            >
              {saving ? "Guardando..." : "Guardar QR"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .qr-page {
          min-height:100dvh;
          width:100%;
          box-sizing:border-box;
          padding:14px 10px 34px;
          background:#080808;
          color:#fff;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }

        .qr-shell {
          width:100%;
          max-width:620px;
          margin:0 auto;
        }

        .qr-header {
          display:flex;
          align-items:flex-start;
          gap:8px;
          margin-bottom:9px;
        }

        .back-button {
          width:30px;
          height:30px;
          display:grid;
          place-items:center;
          flex-shrink:0;
          margin-top:2px;
          border:1px solid rgba(255,255,255,.06);
          border-radius:8px;
          background:#111;
          color:rgba(255,255,255,.7);
          font-size:15px;
          cursor:pointer;
        }

        .header-copy {
          min-width:0;
        }

        .eyebrow {
          display:block;
          color:#f97316;
          font-size:7px;
          font-weight:900;
          letter-spacing:1.15px;
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
          color:rgba(255,255,255,.34);
          font-size:8px;
        }

        .qr-form {
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .section,
        .preview {
          padding:10px;
          border:1px solid rgba(255,255,255,.055);
          border-radius:11px;
          background:#101010;
        }

        .section-heading {
          display:flex;
          align-items:center;
          gap:7px;
          margin-bottom:9px;
        }

        .section-heading > span {
          width:25px;
          height:25px;
          display:grid;
          place-items:center;
          flex-shrink:0;
          border-radius:7px;
          background:rgba(249,115,22,.07);
          color:#f97316;
          font-size:7px;
          font-weight:900;
        }

        .section-heading strong {
          display:block;
          font-size:9px;
          font-weight:850;
        }

        .section-heading small {
          display:block;
          margin-top:2px;
          color:rgba(255,255,255,.23);
          font-size:7px;
        }

        .field {
          display:block;
          margin-bottom:8px;
        }

        .field:last-child {
          margin-bottom:0;
        }

        .field > span {
          display:block;
          margin-bottom:4px;
          color:rgba(255,255,255,.48);
          font-size:8px;
          font-weight:750;
        }

        .field input {
          width:100%;
          height:35px;
          box-sizing:border-box;
          padding:7px 8px;
          border:1px solid rgba(255,255,255,.06);
          border-radius:7px;
          background:#0a0e14;
          color:#fff;
          outline:none;
          font:500 9px system-ui,sans-serif;
        }

        .field input:focus {
          border-color:rgba(249,115,22,.38);
          box-shadow:0 0 0 3px rgba(249,115,22,.05);
        }

        .upload {
          position:relative;
          display:block;
          min-height:145px;
          overflow:hidden;
          border:1px dashed rgba(249,115,22,.2);
          border-radius:9px;
          background:rgba(249,115,22,.025);
          cursor:pointer;
        }

        .upload input {
          position:absolute;
          inset:0;
          z-index:4;
          width:100%;
          height:100%;
          opacity:0;
          cursor:pointer;
        }

        .upload-empty {
          min-height:145px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:4px;
          text-align:center;
        }

        .upload-icon {
          width:34px;
          height:34px;
          display:grid;
          place-items:center;
          margin-bottom:2px;
          border-radius:9px;
          background:rgba(249,115,22,.1);
          color:#f97316;
          font-size:19px;
        }

        .upload-empty strong {
          color:rgba(255,255,255,.62);
          font-size:9px;
        }

        .upload-empty small {
          color:rgba(255,255,255,.23);
          font-size:7px;
        }

        .upload.has-image {
          min-height:185px;
        }

        .upload img {
          display:block;
          width:100%;
          height:185px;
          object-fit:contain;
          background:#080808;
        }

        .change-image,
        .uploading {
          position:absolute;
          left:7px;
          right:7px;
          bottom:7px;
          z-index:5;
          padding:6px 7px;
          border-radius:6px;
          background:rgba(0,0,0,.78);
          color:#fff;
          font-size:7px;
          font-weight:750;
          text-align:center;
          pointer-events:none;
        }

        .setting-row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:3px 1px;
        }

        .setting-row strong {
          display:block;
          color:rgba(255,255,255,.67);
          font-size:9px;
        }

        .setting-row small {
          display:block;
          margin-top:2px;
          color:rgba(255,255,255,.23);
          font-size:7px;
        }

        .switch {
          width:35px;
          height:20px;
          padding:2px;
          border:0;
          border-radius:999px;
          background:#303030;
          cursor:pointer;
          box-sizing:border-box;
          flex-shrink:0;
        }

        .switch span {
          display:block;
          width:16px;
          height:16px;
          border-radius:50%;
          background:#fff;
          box-shadow:0 1px 4px rgba(0,0,0,.35);
          transition:.16s;
        }

        .switch.on {
          background:#16a34a;
        }

        .switch.on span {
          transform:translateX(15px);
        }

        .preview {
          background:linear-gradient(145deg,#11100f,#0e0e0e);
        }

        .preview-heading {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          margin-bottom:8px;
        }

        .preview-heading strong {
          display:block;
          margin-top:2px;
          font-size:9px;
          font-weight:850;
        }

        .preview-status {
          padding:4px 6px;
          border-radius:999px;
          background:rgba(239,68,68,.07);
          color:#ef4444;
          font-size:6px;
          font-weight:850;
          text-transform:uppercase;
        }

        .preview-status.active {
          background:rgba(34,197,94,.08);
          color:#22c55e;
        }

        .preview-card {
          display:flex;
          align-items:center;
          gap:9px;
          padding:8px;
          border:1px solid rgba(255,255,255,.05);
          border-radius:8px;
          background:#090909;
        }

        .preview-image {
          width:72px;
          height:72px;
          display:grid;
          place-items:center;
          flex-shrink:0;
          overflow:hidden;
          border-radius:7px;
          background:#111;
        }

        .preview-image img {
          width:100%;
          height:100%;
          object-fit:contain;
        }

        .preview-empty {
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:3px;
          color:rgba(255,255,255,.2);
        }

        .preview-empty span {
          color:#f97316;
          font-size:20px;
        }

        .preview-empty small {
          font-size:6px;
        }

        .preview-copy {
          min-width:0;
        }

        .preview-copy strong {
          display:block;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          color:#f97316;
          font-size:9px;
          font-weight:850;
        }

        .preview-copy span,
        .preview-copy small {
          display:block;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          margin-top:3px;
          color:rgba(255,255,255,.38);
          font-size:7px;
        }

        .preview-copy small {
          color:rgba(255,255,255,.2);
        }

        .actions {
          display:grid;
          grid-template-columns:1fr 1.35fr;
          gap:5px;
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
          box-shadow:0 6px 16px rgba(249,115,22,.12);
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

        @media(max-width:390px) {
          .qr-page {
            padding-left:8px;
            padding-right:8px;
          }

          .section,
          .preview {
            padding:9px;
          }

          .preview-card {
            align-items:flex-start;
          }
        }
      `}</style>
    </main>
  );
}