"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

function ServicesPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [settings, setSettings] =
    useState<any>(null);

  // 🌟 CORRECCIÓN CRUCIAL: Agregamos [restaurantId] para que recargue la data limpia al cambiar de restaurante
  useEffect(() => {
    loadSettings();
  }, [restaurantId]);

  const loadSettings =
    async () => {
      setLoading(true);
      
      // 1. Traemos la configuración específica de delivery utilizando el ID real de la URL
      const { data } =
        await supabase
          .from(
            "restaurant_delivery_settings"
          )
          .select("*")
          .eq(
            "restaurant_id",
            restaurantId
          )
          .maybeSingle();

      // 2. Traemos los datos base del restaurante para heredar configuraciones si el delivery está en null
      const { data: restaurant } =
        await supabase
          .from("restaurants")
          .select("*")
          .eq("id", restaurantId)
          .maybeSingle();

      // Sincronizamos garantizando strings o números válidos (evita inputs "uncontrolled")
      setSettings({
        delivery_mode: data?.delivery_mode || restaurant?.delivery_mode || "fixed",
        delivery_enabled: data?.delivery_enabled ?? restaurant?.service_delivery ?? false,
        pickup_enabled: data?.pickup_enabled ?? restaurant?.service_pickup ?? false,
        delivery_radius_km: data?.delivery_radius_km ?? 0,
        delivery_fee: data?.delivery_fee ?? restaurant?.delivery_fee ?? 0,
        minimum_order: data?.minimum_order ?? restaurant?.minimum_order ?? 0,
        free_delivery_enabled: data?.free_delivery_enabled ?? false,
        free_delivery_minimum: data?.free_delivery_minimum ?? restaurant?.free_delivery_from ?? 0,
        preparation_time: data?.preparation_time ?? restaurant?.prep_time_min ?? 0,
        delivery_time: data?.delivery_time ?? 0,
        ...data,
      });

      setLoading(false);
    };

  const saveSettings =
    async () => {
      try {
        setSaving(true);

const { data: existing, error: existingError } = await supabase
  .from("restaurant_delivery_settings")
  .select("id")
  .eq("restaurant_id", restaurantId)
  .maybeSingle();

if (existingError) {
  console.error(existingError);
  return;
}

let error = null;

if (existing) {
  console.log("ENTRO AL UPDATE");
  ({ error } = await supabase
    .from("restaurant_delivery_settings")
    .update({
              delivery_enabled:
                settings.delivery_enabled,

              pickup_enabled:
                settings.pickup_enabled,

              delivery_mode:
                settings.delivery_mode,

              delivery_radius_km:
                settings.delivery_radius_km,

              delivery_fee:
                settings.delivery_fee,

              minimum_order:
                settings.minimum_order,

              free_delivery_enabled:
                settings.free_delivery_enabled,

              free_delivery_minimum:
                settings.free_delivery_minimum,

              preparation_time:
                settings.preparation_time,

              delivery_time:
                settings.delivery_time,
            })
            .eq(
              "restaurant_id",
              restaurantId
            ));

            } else {
              console.log("ENTRO AL INSERT");
  ({ error } = await supabase
    .from("restaurant_delivery_settings")
    .insert({

      
      restaurant_id: restaurantId,

      delivery_enabled:
        settings.delivery_enabled,

      pickup_enabled:
        settings.pickup_enabled,

      delivery_mode:
        settings.delivery_mode,

      delivery_radius_km:
        settings.delivery_radius_km,

      delivery_fee:
        settings.delivery_fee,

      minimum_order:
        settings.minimum_order,

      free_delivery_enabled:
        settings.free_delivery_enabled,

      free_delivery_minimum:
        settings.free_delivery_minimum,

      preparation_time:
        settings.preparation_time,

      delivery_time:
        settings.delivery_time,
    }));
}

        if (error) {
          console.error(error);

          alert(
            "Error guardando configuración"
          );

          return;
        }

        alert(
          "Configuración guardada exitosamente"
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading || !settings) {
    return (
      <main className="services-page loading-page">
        <div className="loading">Cargando servicios...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="services">
      <main className="services-page">
        <div className="services-shell">
          <header className="services-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">OPERACIÓN · SERVICIOS</span>
                <h1>Delivery & Pickup</h1>
                <p>Configura cómo reciben y retiran pedidos tus clientes.</p>
              </div>
              <span className="live-dot" />
            </div>
          </header>

          <section className="summary">
            <div>
              <span>Delivery</span>
              <strong className={settings.delivery_enabled ? "green" : ""}>
                {settings.delivery_enabled ? "ON" : "OFF"}
              </strong>
            </div>
            <div>
              <span>Pickup</span>
              <strong className={settings.pickup_enabled ? "green" : ""}>
                {settings.pickup_enabled ? "ON" : "OFF"}
              </strong>
            </div>
            <div>
              <span>Modo</span>
              <strong>{settings.delivery_mode === "manual" ? "Manual" : "Fijo"}</strong>
            </div>
          </section>

          <div className="accordion-list">
            <ServiceAccordion
              title="Servicios activos"
              subtitle="Delivery y retiro en local"
              icon="↗"
              defaultOpen
            >
              <ToggleRow
                label="Delivery"
                description="Envíos al domicilio del cliente."
                active={settings.delivery_enabled}
                onToggle={() =>
                  setSettings({
                    ...settings,
                    delivery_enabled: !settings.delivery_enabled,
                  })
                }
              />

              <ToggleRow
                label="Pickup"
                description="Retiro directamente en el restaurante."
                active={settings.pickup_enabled}
                onToggle={() =>
                  setSettings({
                    ...settings,
                    pickup_enabled: !settings.pickup_enabled,
                  })
                }
              />
            </ServiceAccordion>

            <ServiceAccordion
              title="Cálculo del delivery"
              subtitle={
                settings.delivery_mode === "manual"
                  ? "Coordinación manual por WhatsApp"
                  : "Tarifa fija estándar"
              }
              icon="$"
              defaultOpen
            >
              <div className="choice-list">
                <ChoiceRow
                  active={settings.delivery_mode === "fixed"}
                  title="Tarifa fija"
                  description="Usa un costo estándar para cada envío."
                  onClick={() =>
                    setSettings({
                      ...settings,
                      delivery_mode: "fixed",
                    })
                  }
                />

                <ChoiceRow
                  active={settings.delivery_mode === "manual"}
                  title="Manual por WhatsApp"
                  description="El costo se coordina después con el cliente."
                  onClick={() =>
                    setSettings({
                      ...settings,
                      delivery_mode: "manual",
                    })
                  }
                />

                <div className="choice-row disabled">
                  <span className="radio" />
                  <div>
                    <strong>Por distancia</strong>
                    <small>Próximamente</small>
                  </div>
                </div>
              </div>

              {settings.delivery_mode === "manual" && (
                <div className="info-note">
                  <strong>Modo manual activo</strong>
                  <span>
                    El checkout inicial no calcula el envío. El cliente
                    comparte su ubicación por WhatsApp y el comercio indica
                    la tarifa final.
                  </span>
                </div>
              )}
            </ServiceAccordion>

            <ServiceAccordion
              title="Tasas y tiempos"
              subtitle="Costo, cobertura y tiempos operativos"
              icon="◷"
            >
              <div className="fields-grid">
                {settings.delivery_mode === "fixed" && (
                  <InputCard
                    label="Costo Delivery ($)"
                    value={settings.delivery_fee}
                    onChange={(value: string) =>
                      setSettings({ ...settings, delivery_fee: value })
                    }
                  />
                )}

                <InputCard
                  label="Radio cobertura (km)"
                  value={settings.delivery_radius_km}
                  onChange={(value: string) =>
                    setSettings({ ...settings, delivery_radius_km: value })
                  }
                />

                <InputCard
                  label="Pedido mínimo ($)"
                  value={settings.minimum_order}
                  onChange={(value: string) =>
                    setSettings({ ...settings, minimum_order: value })
                  }
                />

                <InputCard
                  label="Preparación (min)"
                  value={settings.preparation_time}
                  onChange={(value: string) =>
                    setSettings({ ...settings, preparation_time: value })
                  }
                />

                <InputCard
                  label="Entrega (min)"
                  value={settings.delivery_time}
                  onChange={(value: string) =>
                    setSettings({ ...settings, delivery_time: value })
                  }
                />
              </div>
            </ServiceAccordion>

            <ServiceAccordion
              title="Delivery gratis"
              subtitle={
                settings.free_delivery_enabled
                  ? `Activo desde $${settings.free_delivery_minimum}`
                  : "Promoción desactivada"
              }
              icon="✦"
            >
              <ToggleRow
                label="Activar envío gratuito"
                description="Aplica cuando el pedido supera un monto mínimo."
                active={settings.free_delivery_enabled}
                onToggle={() =>
                  setSettings({
                    ...settings,
                    free_delivery_enabled: !settings.free_delivery_enabled,
                  })
                }
              />

              {settings.free_delivery_enabled && (
                <div className="single-field">
                  <InputCard
                    label="Monto mínimo de compra ($)"
                    value={settings.free_delivery_minimum}
                    onChange={(value: string) =>
                      setSettings({
                        ...settings,
                        free_delivery_minimum: value,
                      })
                    }
                  />
                </div>
              )}
            </ServiceAccordion>

            <ServiceAccordion
              title="Vista previa"
              subtitle="Así quedará reflejado en checkout"
              icon="⌁"
            >
              <div className="preview-list">
                <PreviewRow
                  label="Delivery"
                  value={settings.delivery_enabled ? "Disponible" : "No disponible"}
                  active={settings.delivery_enabled}
                />
                <PreviewRow
                  label="Pickup"
                  value={settings.pickup_enabled ? "Disponible" : "No disponible"}
                  active={settings.pickup_enabled}
                />
                <PreviewRow
                  label="Costo de envío"
                  value={
                    settings.delivery_mode === "fixed"
                      ? `$${settings.delivery_fee}`
                      : "Coordinación manual"
                  }
                  active
                />
                {settings.free_delivery_enabled && (
                  <PreviewRow
                    label="Delivery gratis"
                    value={`Desde $${settings.free_delivery_minimum}`}
                    active
                  />
                )}
                <PreviewRow
                  label="Radio"
                  value={`${settings.delivery_radius_km || "0"} km`}
                  active
                />
              </div>
            </ServiceAccordion>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        <style jsx global>{`
          .services-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .services-shell {
            width:100%;
            max-width:680px;
            margin:0 auto;
          }

          .services-header {
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
            padding:8px 5px;
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
            font-size:10px;
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
            cursor:pointer;
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
            font-weight:900;
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

          .chevron {
            width:24px;
            height:24px;
            display:grid;
            place-items:center;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.38);
            font-size:12px;
          }

          .accordion.open .chevron {
            color:#f97316;
            background:rgba(249,115,22,.07);
          }

          .accordion-body {
            padding:0 8px 8px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .toggle-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            padding:9px 1px;
          }

          .toggle-row + .toggle-row {
            border-top:1px solid rgba(255,255,255,.045);
          }

          .row-copy {
            min-width:0;
            flex:1;
          }

          .row-copy strong {
            display:block;
            font-size:8px;
            font-weight:850;
          }

          .row-copy small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.23);
            font-size:6.5px;
          }

          .switch {
            width:34px;
            height:19px;
            padding:2px;
            flex-shrink:0;
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

          .choice-list {
            display:flex;
            flex-direction:column;
          }

          .choice-row {
            display:flex;
            align-items:center;
            gap:8px;
            min-height:43px;
            padding:6px 1px;
            border-bottom:1px solid rgba(255,255,255,.045);
            cursor:pointer;
          }

          .choice-row:last-child {
            border-bottom:0;
          }

          .radio {
            width:14px;
            height:14px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border:1px solid rgba(255,255,255,.16);
            border-radius:50%;
          }

          .choice-row.active .radio {
            border-color:#f97316;
          }

          .choice-row.active .radio::after {
            content:"";
            width:6px;
            height:6px;
            border-radius:50%;
            background:#f97316;
          }

          .choice-row strong {
            display:block;
            font-size:8px;
          }

          .choice-row small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.23);
            font-size:6.5px;
          }

          .choice-row.disabled {
            opacity:.28;
            cursor:default;
          }

          .info-note {
            display:flex;
            flex-direction:column;
            gap:3px;
            margin-top:7px;
            padding:8px;
            border-left:2px solid #22c55e;
            border-radius:0 7px 7px 0;
            background:rgba(34,197,94,.04);
          }

          .info-note strong {
            color:#22c55e;
            font-size:7px;
          }

          .info-note span {
            color:rgba(255,255,255,.3);
            font-size:6.5px;
            line-height:1.45;
          }

          .fields-grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:7px;
            padding-top:8px;
          }

          .single-field {
            padding-top:8px;
          }

          .preview-list {
            display:flex;
            flex-direction:column;
          }

          .preview-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            padding:9px 1px;
            border-bottom:1px solid rgba(255,255,255,.045);
          }

          .preview-row:last-child {
            border-bottom:0;
          }

          .preview-row span:first-child {
            color:rgba(255,255,255,.3);
            font-size:7px;
          }

          .preview-value {
            display:flex;
            align-items:center;
            gap:4px;
            color:rgba(255,255,255,.65);
            font-size:7px;
            font-weight:750;
            text-align:right;
          }

          .preview-value i {
            width:5px;
            height:5px;
            border-radius:50%;
            background:#ef4444;
          }

          .preview-value.active i {
            background:#22c55e;
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
            .services-page {
              padding-left:8px;
              padding-right:8px;
            }

            .fields-grid {
              grid-template-columns:1fr;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

function ServiceAccordion({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

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
        <span className="chevron">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="accordion-body">{children}</div>}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="toggle-row">
      <div className="row-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </div>

      <button
        type="button"
        className={active ? "switch on" : "switch"}
        aria-pressed={active}
        onClick={onToggle}
      >
        <span />
      </button>
    </div>
  );
}

function ChoiceRow({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "choice-row active" : "choice-row"}
      onClick={onClick}
    >
      <span className="radio" />
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

function PreviewRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="preview-row">
      <span>{label}</span>
      <span className={active ? "preview-value active" : "preview-value"}>
        <i />
        {value}
      </span>
    </div>
  );
}

function InputCard({
  label,
  value,
  onChange,
}: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <label
        style={{
          display: "block",
          fontSize: "13.5px",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 500,
        }}
      >
        {label}
      </label>

      <input
        type="number"
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
          padding: "12px 14px",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "monospace",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default function ServicesPageWrapper() {
  const params = useParams();
  const restaurantId = (params?.id as string) || "";
  return <ServicesPage key={restaurantId} />;
}