"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const ICONS = [
  { value: "truck", emoji: "🚚", label: "Delivery" },
  { value: "pickup", emoji: "🏪", label: "Retiro" },
  { value: "dinein", emoji: "🍽️", label: "Consumo Local" },
  { value: "scheduled", emoji: "📦", label: "Programados" },
  { value: "card", emoji: "💳", label: "Pago Online" },
  { value: "cash", emoji: "💵", label: "Pago Entrega" },
  { value: "whatsapp", emoji: "📱", label: "WhatsApp" },
  { value: "loyalty", emoji: "⭐", label: "Fidelidad" },

  { value: "burger", emoji: "🍔", label: "Hamburguesas" },
  { value: "pizza", emoji: "🍕", label: "Pizza" },
  { value: "taco", emoji: "🌮", label: "Mexicana" },
  { value: "chicken", emoji: "🍗", label: "Pollo" },
  { value: "grill", emoji: "🥩", label: "Parrilla" },
  { value: "healthy", emoji: "🥗", label: "Saludable" },
  { value: "pasta", emoji: "🍝", label: "Pasta" },
  { value: "sushi", emoji: "🍣", label: "Sushi" },

  { value: "cocktail", emoji: "🍹", label: "Cocteles" },
  { value: "beer", emoji: "🍺", label: "Cervezas" },
  { value: "wine", emoji: "🍷", label: "Vinos" },
  { value: "music", emoji: "🎵", label: "Música" },
  { value: "dj", emoji: "🎧", label: "DJ" },
  { value: "sports", emoji: "⚽", label: "Deportes" },
  { value: "happyhour", emoji: "🥂", label: "Happy Hour" },
  { value: "night", emoji: "🌙", label: "Nocturno" },

  { value: "events", emoji: "🎉", label: "Eventos" },
  { value: "birthday", emoji: "🎂", label: "Cumpleaños" },
  { value: "corporate", emoji: "💼", label: "Corporativo" },
  { value: "groups", emoji: "👨‍👩‍👧‍👦", label: "Grupos" },
  { value: "karaoke", emoji: "🎤", label: "Karaoke" },
  { value: "promo", emoji: "🎁", label: "Promociones" },

  { value: "coffee", emoji: "☕", label: "Café" },
  { value: "dessert", emoji: "🧁", label: "Postres" },
  { value: "cake", emoji: "🍰", label: "Tortas" },
  { value: "icecream", emoji: "🍨", label: "Helados" },
  { value: "bakery", emoji: "🥐", label: "Panadería" },
];

export default function EditServicePage() {
  const params = useParams();

  const serviceId =
    params.serviceId as string;

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<any>(null);

  useEffect(() => {
    loadService();
  }, []);

  async function loadService() {
    const { data } =
      await supabase
        .from("restaurant_services")
        .select("*")
        .eq("id", serviceId)
        .maybeSingle();

    setForm(data);

    setLoading(false);
  }

  async function saveService() {
    try {
      setSaving(true);

      await supabase
        .from("restaurant_services")
        .update({
          title: form.title,
          description:
            form.description,
          icon: form.icon,
          sort_order:
            form.sort_order,
          active:
            form.active,
        })
        .eq(
          "id",
          serviceId
        );

      alert(
        "Servicio actualizado"
      );

      router.back();
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <main className="edit-service-page loading-page">
        <div>Cargando servicio...</div>
      </main>
    );
  }

  const selectedIcon =
    ICONS.find((icon) => icon.value === form.icon) || ICONS[0];

  return (
    <main className="edit-service-page">
      <div className="edit-service-shell">
        <header className="page-header">
          <button
            type="button"
            className="back-button"
            onClick={() => router.back()}
            aria-label="Volver"
          >
            ←
          </button>

          <div className="header-copy">
            <span className="eyebrow">SERVICIOS · EDITAR</span>
            <h1>Editar servicio</h1>
            <p>Actualiza la información que verá tu cliente.</p>
          </div>

          <span className={form.active ? "status-pill active" : "status-pill"}>
            <i />
            {form.active ? "Activo" : "Oculto"}
          </span>
        </header>

        <div className="accordion-list">
          <section className="accordion open">
            <div className="section-head">
              <span className="section-icon">01</span>
              <div>
                <strong>Información</strong>
                <small>Nombre y descripción del servicio.</small>
              </div>
            </div>

            <div className="section-body">
              <InputField
                label="Título del servicio"
                placeholder="Ej. Happy Hour"
                value={form.title}
                onChange={(v: string) => setForm({ ...form, title: v })}
              />

              <TextAreaField
                label="Descripción"
                placeholder="Ej. Promociones especiales todos los viernes."
                value={form.description}
                onChange={(v: string) =>
                  setForm({ ...form, description: v })
                }
              />

              <div className="field-hint">
                Mantén el título corto y la descripción clara para que se vea
                bien en móvil.
              </div>
            </div>
          </section>

          <section className="accordion">
            <details>
              <summary>
                <span className="section-icon">02</span>
                <span className="summary-copy">
                  <strong>Icono</strong>
                  <small>
                    {selectedIcon.emoji} {selectedIcon.label}
                  </small>
                </span>
                <span className="summary-chevron">+</span>
              </summary>

              <div className="icon-grid">
                {ICONS.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    className={
                      form.icon === icon.value
                        ? "icon-option selected"
                        : "icon-option"
                    }
                    onClick={() =>
                      setForm({
                        ...form,
                        icon: icon.value,
                      })
                    }
                  >
                    <span>{icon.emoji}</span>
                    <span>{icon.label}</span>
                  </button>
                ))}
              </div>
            </details>
          </section>

          <section className="preview-card">
            <span className="preview-icon">{selectedIcon.emoji}</span>
            <div>
              <small>VISTA PREVIA</small>
              <strong>{form.title || "Nombre del servicio"}</strong>
              <p>
                {form.description || "Así verá el cliente este servicio."}
              </p>
            </div>
          </section>

          <section className="accordion">
            <details>
              <summary>
                <span className="section-icon">03</span>
                <span className="summary-copy">
                  <strong>Orden y estado</strong>
                  <small>Posición y visibilidad.</small>
                </span>
                <span className="summary-chevron">+</span>
              </summary>

              <div className="section-body">
                <div className="order-card">
                  <div>
                    <span>Orden de visualización</span>
                    <small>Menor número = aparece primero.</small>
                  </div>

                  <input
                    className="order-input"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={form.sort_order ?? 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sort_order: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="switch-row">
                  <div>
                    <strong>Servicio activo</strong>
                    <small>
                      Los clientes podrán ver este servicio.
                    </small>
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
              </div>
            </details>
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
            onClick={saveService}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .edit-service-page {
          min-height:100dvh;
          width:100%;
          box-sizing:border-box;
          padding:14px 10px 34px;
          background:#080808;
          color:#fff;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }

        .edit-service-shell {
          width:100%;
          max-width:620px;
          margin:0 auto;
        }

        .page-header {
          position:relative;
          margin-bottom:8px;
          padding-left:38px;
        }

        .back-button {
          position:absolute;
          left:0;
          top:0;
          width:30px;
          height:30px;
          display:grid;
          place-items:center;
          border:1px solid rgba(255,255,255,.06);
          border-radius:8px;
          background:#111;
          color:rgba(255,255,255,.72);
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

        .status-pill {
          display:inline-flex;
          align-items:center;
          gap:4px;
          margin-top:6px;
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

        .accordion[open] .summary-chevron {
          color:#f97316;
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

        .field-hint {
          margin-top:6px;
          padding:7px 8px;
          border-left:2px solid rgba(249,115,22,.28);
          border-radius:0 6px 6px 0;
          background:rgba(249,115,22,.025);
          color:rgba(255,255,255,.24);
          font-size:6.5px;
          line-height:1.45;
        }

        .icon-grid {
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:4px;
          max-height:175px;
          overflow-y:auto;
          padding:0 9px 9px;
        }

        .icon-option {
          min-width:0;
          min-height:49px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:2px;
          border:1px solid rgba(255,255,255,.05);
          border-radius:7px;
          background:rgba(255,255,255,.02);
          color:rgba(255,255,255,.5);
          cursor:pointer;
        }

        .icon-option.selected {
          border-color:rgba(249,115,22,.35);
          background:rgba(249,115,22,.07);
          color:#fff;
        }

        .icon-option span:first-child {
          font-size:16px;
          line-height:1;
        }

        .icon-option span:last-child {
          overflow:hidden;
          max-width:100%;
          padding:0 2px;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size:5.5px;
        }

        .preview-card {
          display:flex;
          align-items:center;
          gap:9px;
          min-height:62px;
          box-sizing:border-box;
          padding:9px;
          border:1px solid rgba(255,255,255,.055);
          border-radius:10px;
          background:#101010;
        }

        .preview-icon {
          width:36px;
          height:36px;
          display:grid;
          place-items:center;
          flex:0 0 36px;
          border-radius:10px;
          background:rgba(249,115,22,.08);
          font-size:17px;
        }

        .preview-card > div {
          min-width:0;
        }

        .preview-card small {
          display:block;
          color:#f97316;
          font-size:5.5px;
          font-weight:900;
          letter-spacing:.8px;
        }

        .preview-card strong {
          display:block;
          margin-top:2px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size:8.5px;
          font-weight:850;
        }

        .preview-card p {
          margin:2px 0 0;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          color:rgba(255,255,255,.25);
          font-size:6.5px;
        }

        .order-card {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:9px 0;
        }

        .order-card > div {
          min-width:0;
          flex:1;
        }

        .order-card span {
          display:block;
          color:rgba(255,255,255,.65);
          font-size:8px;
          font-weight:800;
        }

        .order-card small {
          display:block;
          margin-top:3px;
          color:rgba(255,255,255,.22);
          font-size:6.5px;
        }

        .order-input {
          width:58px;
          height:36px;
          flex:0 0 58px;
          box-sizing:border-box;
          border:1px solid rgba(249,115,22,.2);
          border-radius:8px;
          outline:none;
          background:#090909;
          color:#fff;
          text-align:center;
          font:900 13px system-ui,sans-serif;
        }

        .order-input:focus {
          border-color:rgba(249,115,22,.5);
          box-shadow:0 0 0 3px rgba(249,115,22,.05);
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
          .edit-service-page {
            padding-left:8px;
            padding-right:8px;
          }

          .icon-grid {
            grid-template-columns:repeat(4,minmax(0,1fr));
          }

          .preview-card {
            min-height:58px;
          }
        }
      `}</style>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: any) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
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