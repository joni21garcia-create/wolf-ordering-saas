"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";

// ICONS list remains the same...
const ICONS = [
  { value: "truck", emoji: "🚚", label: "Delivery" },
  { value: "pickup", emoji: "🏪", label: "Retiro Local" },
  { value: "dinein", emoji: "🍽️", label: "Consumo Local" },
  { value: "schedule", emoji: "📦", label: "Pedidos Programados" },
  { value: "onlinepay", emoji: "💳", label: "Pago Online" },
  { value: "cash", emoji: "💵", label: "Pago Contra Entrega" },
  { value: "whatsapp", emoji: "📱", label: "WhatsApp" },
  { value: "loyalty", emoji: "⭐", label: "Fidelización" },
  { value: "burger", emoji: "🍔", label: "Hamburguesas" },
  { value: "pizza", emoji: "🍕", label: "Pizza" },
  { value: "mexican", emoji: "🌮", label: "Comida Mexicana" },
  { value: "chicken", emoji: "🍗", label: "Pollo" },
  { value: "grill", emoji: "🥩", label: "Parrilla" },
  { value: "healthy", emoji: "🥗", label: "Saludable" },
  { value: "pasta", emoji: "🍝", label: "Pasta" },
  { value: "sushi", emoji: "🍣", label: "Sushi" },
  { value: "cocktail", emoji: "🍹", label: "Cocteles" },
  { value: "beer", emoji: "🍺", label: "Cervezas" },
  { value: "wine", emoji: "🍷", label: "Vinos" },
  { value: "music", emoji: "🎵", label: "Música en Vivo" },
  { value: "dj", emoji: "🎧", label: "DJ Nights" },
  { value: "sports", emoji: "⚽", label: "Eventos Deportivos" },
  { value: "happyhour", emoji: "🥂", label: "Happy Hour" },
  { value: "nightlife", emoji: "🌙", label: "Vida Nocturna" },
  { value: "party", emoji: "🎉", label: "Eventos" },
  { value: "birthday", emoji: "🎂", label: "Cumpleaños" },
  { value: "corporate", emoji: "💍", label: "Corporativos" },
  { value: "groups", emoji: "👨‍👩‍👧‍👦", label: "Reservas Grupos" },
  { value: "karaoke", emoji: "🎤", label: "Karaoke" },
  { value: "promo", emoji: "🎁", label: "Promociones" },
  { value: "coffee", emoji: "☕", label: "Café" },
  { value: "dessert", emoji: "🧁", label: "Postres" },
  { value: "cake", emoji: "🍰", label: "Tortas" },
  { value: "icecream", emoji: "🍨", label: "Helados" },
  { value: "bakery", emoji: "🥐", label: "Panadería" },
];

function getIconEmoji(value: string) {
  return ICONS.find((icon) => icon.value === value)?.emoji || "✦";
}

export default function NuevoServicioPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "truck",
    sort_order: 0,
    active: true,
  });

  async function saveService() {
    try {
      setSaving(true);
      await supabase.from("restaurant_services").insert({
        restaurant_id: restaurantId,
        title: form.title,
        description: form.description,
        icon: form.icon,
        sort_order: form.sort_order,
        active: form.active,
      });
      router.push(`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant`);
    } catch (err) {
      console.error(err);
      alert("Error al crear el servicio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="new-service-page">
      <div className="new-service-shell">
        <header className="page-header">
          <BackToSettings restaurantId={restaurantId} />
          <div className="header-copy">
            <span className="eyebrow">SERVICIOS · NUEVO</span>
            <h1>Nuevo servicio</h1>
            <p>Crea una opción para mostrar en tu restaurante.</p>
          </div>
        </header>

        <div className="accordion-list">
          <section className="accordion open">
            <div className="section-head">
              <span className="section-icon">01</span>
              <div>
                <strong>Información</strong>
                <small>El nombre y texto que verá el cliente.</small>
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
                onChange={(v: string) => setForm({ ...form, description: v })}
              />

              <div className="field-hint">
                El título debe ser corto y fácil de reconocer. La descripción puede explicar brevemente el servicio.
              </div>
            </div>
          </section>

          <IconPicker
            value={form.icon}
            onChange={(icon: string) => setForm({ ...form, icon })}
          />

          <section className="preview-card">
            <span className="preview-icon">{getIconEmoji(form.icon)}</span>
            <div>
              <small>VISTA PREVIA</small>
              <strong>{form.title || "Nombre del servicio"}</strong>
              <p>{form.description || "Así verá el cliente este servicio."}</p>
            </div>
          </section>

          <section className="accordion">
            <details>
              <summary>
                <span className="section-icon">03</span>
                <span className="summary-copy">
                  <strong>Orden y estado</strong>
                  <small>Define posición y visibilidad.</small>
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

                <SwitchField
                  label="Servicio activo"
                  checked={form.active}
                  onChange={(v: boolean) => setForm({ ...form, active: v })}
                />
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
            {saving ? "Guardando..." : "Crear servicio"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .new-service-page {
          min-height:100dvh;
          box-sizing:border-box;
          padding:14px 10px 34px;
          background:#080808;
          color:#fff;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }

        .new-service-shell {
          width:100%;
          max-width:620px;
          margin:0 auto;
        }

        .page-header {
          margin-bottom:8px;
        }

        .header-copy {
          margin-top:8px;
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
          flex-shrink:0;
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
          color:rgba(255,255,255,.24);
          font-size:6.5px;
        }

        .summary-chevron {
          width:23px;
          height:23px;
          display:grid;
          place-items:center;
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

        .icon-picker {
          padding:9px;
        }

        .icon-picker-head {
          display:flex;
          align-items:center;
          gap:8px;
          margin-bottom:8px;
        }

        .icon-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:4px;
          max-height:175px;
          overflow-y:auto;
          padding-right:1px;
        }

        .icon-option {
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
        }

        .icon-option span:last-child {
          overflow:hidden;
          max-width:100%;
          padding:0 2px;
          text-overflow:ellipsis;
          white-space:nowrap;
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

        .field input::placeholder,
        .field textarea::placeholder {
          color:rgba(255,255,255,.16);
        }

        .field textarea {
          min-height:70px;
          line-height:1.45;
        }

        .field-hint {
          margin-top:6px;
          padding:7px 8px;
          border-left:2px solid rgba(249,115,22,.28);
          border-radius:0 6px 6px 0;
          background:rgba(249,115,22,.025);
          color:rgba(255,255,255,.23);
          font-size:6.5px;
          line-height:1.45;
        }

        .order-card {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:8px 0;
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
          box-sizing:border-box;
          border:1px solid rgba(249,115,22,.2);
          border-radius:8px;
          outline:none;
          background:#0a0a0a;
          color:#fff;
          text-align:center;
          font:900 13px system-ui,sans-serif;
        }

        .order-input:focus {
          border-color:rgba(249,115,22,.5);
          box-shadow:0 0 0 3px rgba(249,115,22,.05);
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

        .preview-icon {
          font-size:17px;
        }

        @media(max-width:390px) {
          .new-service-page {
            padding-left:8px;
            padding-right:8px;
          }

          .icon-grid {
            grid-template-columns:repeat(4,1fr);
          }

          .preview-card {
            min-height:58px;
          }
        }
      `}</style>
    </main>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = ICONS.find((icon: any) => icon.value === value);

  return (
    <section className={open ? "accordion open" : "accordion icon-picker"}>
      <button
        type="button"
        className="section-head"
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", border: 0, background: "transparent", color: "inherit", textAlign: "left", cursor: "pointer" }}
      >
        <span className="section-icon">02</span>
        <div>
          <strong>Icono</strong>
          <small>{selected?.emoji || "✦"} {selected?.label || "Selecciona un icono"}</small>
        </div>
        <span className="summary-chevron">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="icon-grid">
          {ICONS.map((icon: any) => (
            <button
              key={icon.value}
              type="button"
              className={value === icon.value ? "icon-option selected" : "icon-option"}
              onClick={() => {
                onChange(icon.value);
                setOpen(false);
              }}
            >
              <span>{icon.emoji}</span>
              <span>{icon.label}</span>
            </button>
          ))}
        </div>
      )}
    </section>
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

function SwitchField({ label, checked, onChange }: any) {
  return (
    <div className="switch-row">
      <div>
        <strong>{label}</strong>
        <small>Los clientes podrán ver este servicio.</small>
      </div>
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