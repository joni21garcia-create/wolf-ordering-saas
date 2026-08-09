"use client";

import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Clock3,
  Save,
  Store,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

type DeliveryMode = "fixed" | "manual";

type Settings = {
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  delivery_mode: DeliveryMode;
  delivery_radius_km: number;
  delivery_fee: number;
  minimum_order: number;
  free_delivery_enabled: boolean;
  free_delivery_minimum: number;
  preparation_time: number;
  delivery_time: number;
};

const DEFAULTS: Settings = {
  delivery_enabled: false,
  pickup_enabled: false,
  delivery_mode: "fixed",
  delivery_radius_km: 0,
  delivery_fee: 0,
  minimum_order: 0,
  free_delivery_enabled: false,
  free_delivery_minimum: 0,
  preparation_time: 0,
  delivery_time: 0,
};

export default function DeliveryPickupSettings() {
  const params = useParams();
  const router = useRouter();

  const restaurantId =
    typeof params.restaurantId === "string" ? params.restaurantId : "";

  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [freeDeliveryOpen, setFreeDeliveryOpen] = useState(false);
  const [timesOpen, setTimesOpen] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;

    let cancelled = false;

    async function loadSettings() {
      setLoading(true);
      setError("");

      const [{ data: delivery, error: deliveryError }, { data: restaurant, error: restaurantError }] =
        await Promise.all([
          supabase
            .from("restaurant_delivery_settings")
            .select("*")
            .eq("restaurant_id", restaurantId)
            .maybeSingle(),

          supabase
            .from("restaurants")
            .select(
              "delivery_mode,service_delivery,service_pickup,delivery_fee,minimum_order,free_delivery_from,prep_time_min"
            )
            .eq("id", restaurantId)
            .maybeSingle(),
        ]);

      if (cancelled) return;

      if (deliveryError || restaurantError) {
        console.error(deliveryError || restaurantError);
        setError("No pudimos cargar la configuración.");
        setLoading(false);
        return;
      }

      const nextSettings: Settings = {
        delivery_enabled:
          delivery?.delivery_enabled ??
          restaurant?.service_delivery ??
          false,

        pickup_enabled:
          delivery?.pickup_enabled ??
          restaurant?.service_pickup ??
          false,

        delivery_mode:
          delivery?.delivery_mode ??
          restaurant?.delivery_mode ??
          "fixed",

        delivery_radius_km:
          Number(delivery?.delivery_radius_km ?? 0),

        delivery_fee:
          Number(
            delivery?.delivery_fee ??
            restaurant?.delivery_fee ??
            0
          ),

        minimum_order:
          Number(
            delivery?.minimum_order ??
            restaurant?.minimum_order ??
            0
          ),

        free_delivery_enabled:
          delivery?.free_delivery_enabled ??
          false,

        free_delivery_minimum:
          Number(
            delivery?.free_delivery_minimum ??
            restaurant?.free_delivery_from ??
            0
          ),

        preparation_time:
          Number(
            delivery?.preparation_time ??
            restaurant?.prep_time_min ??
            0
          ),

        delivery_time:
          Number(delivery?.delivery_time ?? 0),
      };

      setSettings(nextSettings);

      // Abrimos automáticamente las secciones que ya tienen
      // configuración activa para facilitar la edición inicial.
      setDeliveryOpen(nextSettings.delivery_enabled);
      setFreeDeliveryOpen(nextSettings.free_delivery_enabled);
      setTimesOpen(false);

      setLoading(false);
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  function update<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSaved(false);
    setError("");

    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    if (!restaurantId) return;

    setSaving(true);
    setSaved(false);
    setError("");

    const payload = {
      restaurant_id: restaurantId,
      delivery_enabled: settings.delivery_enabled,
      pickup_enabled: settings.pickup_enabled,
      delivery_mode: settings.delivery_mode,
      delivery_radius_km: settings.delivery_radius_km,
      delivery_fee: settings.delivery_fee,
      minimum_order: settings.minimum_order,
      free_delivery_enabled: settings.free_delivery_enabled,
      free_delivery_minimum: settings.free_delivery_minimum,
      preparation_time: settings.preparation_time,
      delivery_time: settings.delivery_time,
    };

    const { data: existing, error: lookupError } =
      await supabase
        .from("restaurant_delivery_settings")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

    if (lookupError) {
      console.error(lookupError);
      setError("No pudimos guardar la configuración.");
      setSaving(false);
      return;
    }

    const result = existing
      ? await supabase
          .from("restaurant_delivery_settings")
          .update(payload)
          .eq("restaurant_id", restaurantId)
      : await supabase
          .from("restaurant_delivery_settings")
          .insert(payload);

    if (result.error) {
      console.error(result.error);
      setError("No pudimos guardar la configuración.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  function toggleDelivery(value: boolean) {
    update("delivery_enabled", value);

    if (!value) {
      setDeliveryOpen(false);
      setFreeDeliveryOpen(false);
    }
  }

  function toggleFreeDelivery(value: boolean) {
    update("free_delivery_enabled", value);

    if (!value) {
      setFreeDeliveryOpen(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={loadingStyle}>
          Cargando configuración...
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={contentStyle}>
        <header style={headerStyle}>
          <button
            type="button"
            onClick={() =>
              router.push(`/admin/restaurant/${restaurantId}`)
            }
            style={backButtonStyle}
            aria-label="Volver al restaurante"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={titleWrapStyle}>
            <div style={eyebrowStyle}>SERVICIOS</div>
            <h1 style={titleStyle}>
              Delivery y Pick-up
            </h1>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            style={{
              ...saveButtonStyle,
              opacity: saving ? 0.6 : 1,
            }}
          >
            <Save size={16} />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </header>

        {error && (
          <div style={messageStyle}>
            {error}
          </div>
        )}

        {saved && (
          <div style={successStyle}>
            Configuración guardada
          </div>
        )}

        {/* SERVICIOS PRINCIPALES */}
        <section style={cardStyle}>
          <ToggleRow
            icon={<Truck size={18} />}
            title="Delivery"
            description="Permitir pedidos a domicilio"
            checked={settings.delivery_enabled}
            onChange={toggleDelivery}
          />

          <Divider />

          <ToggleRow
            icon={<Store size={18} />}
            title="Pick-up"
            description="Permitir retiro en local"
            checked={settings.pickup_enabled}
            onChange={(value) =>
              update("pickup_enabled", value)
            }
          />
        </section>

        {/* DELIVERY */}
        {settings.delivery_enabled && (
          <>
            <SectionTitle>DELIVERY</SectionTitle>

            <section style={cardStyle}>
              <AccordionRow
                title="Configuración de delivery"
                description="Tarifa, cobertura y pedido mínimo"
                open={deliveryOpen}
                onClick={() =>
                  setDeliveryOpen((value) => !value)
                }
              />

              {deliveryOpen && (
                <>
                  <Divider />

                  <SelectRow
                    title="Modo de delivery"
                    value={
                      settings.delivery_mode === "fixed"
                        ? "Tarifa fija"
                        : "Coordinación manual"
                    }
                    onClick={() =>
                      update(
                        "delivery_mode",
                        settings.delivery_mode === "fixed"
                          ? "manual"
                          : "fixed"
                      )
                    }
                  />

                  <Divider />

                  <NumberRow
                    title="Costo de delivery"
                    value={settings.delivery_fee}
                    prefix="$"
                    step="0.01"
                    onChange={(value) =>
                      update("delivery_fee", value)
                    }
                  />

                  <Divider />

                  <NumberRow
                    title="Radio de cobertura"
                    value={settings.delivery_radius_km}
                    suffix="km"
                    step="0.5"
                    onChange={(value) =>
                      update(
                        "delivery_radius_km",
                        value
                      )
                    }
                  />

                  <Divider />

                  <NumberRow
                    title="Pedido mínimo"
                    value={settings.minimum_order}
                    prefix="$"
                    step="0.01"
                    onChange={(value) =>
                      update(
                        "minimum_order",
                        value
                      )
                    }
                  />
                </>
              )}
            </section>

            {/* DELIVERY GRATIS */}
            <section style={cardStyle}>
              <ToggleRow
                title="Delivery gratis"
                description="Envío gratis desde un monto"
                checked={settings.free_delivery_enabled}
                onChange={toggleFreeDelivery}
                compact
              />

              {settings.free_delivery_enabled && (
                <>
                  <Divider />

                  <button
                    type="button"
                    onClick={() =>
                      setFreeDeliveryOpen(
                        (value) => !value
                      )
                    }
                    style={compactExpandRowStyle}
                  >
                    <span style={rowTitleStyle}>
                      Gratis desde
                    </span>

                    <span style={expandValueStyle}>
                      ${settings.free_delivery_minimum.toFixed(2)}
                      {freeDeliveryOpen ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </span>
                  </button>

                  {freeDeliveryOpen && (
                    <>
                      <Divider />

                      <NumberRow
                        title="Monto mínimo"
                        value={
                          settings.free_delivery_minimum
                        }
                        prefix="$"
                        step="0.01"
                        onChange={(value) =>
                          update(
                            "free_delivery_minimum",
                            value
                          )
                        }
                      />
                    </>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {/* TIEMPOS */}
        <SectionTitle>TIEMPOS</SectionTitle>

        <section style={cardStyle}>
          <AccordionRow
            icon={<Clock3 size={18} />}
            title="Tiempos"
            description="Preparación y entrega estimadas"
            open={timesOpen}
            onClick={() =>
              setTimesOpen((value) => !value)
            }
          />

          {timesOpen && (
            <>
              <Divider />

              <NumberRow
                icon={<Clock3 size={17} />}
                title="Preparación"
                description="Tiempo estimado"
                value={settings.preparation_time}
                suffix="min"
                step="1"
                onChange={(value) =>
                  update(
                    "preparation_time",
                    value
                  )
                }
              />

              <Divider />

              <NumberRow
                icon={<Truck size={17} />}
                title="Entrega"
                description="Tiempo estimado"
                value={settings.delivery_time}
                suffix="min"
                step="1"
                onChange={(value) =>
                  update(
                    "delivery_time",
                    value
                  )
                }
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={sectionTitleStyle}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={dividerStyle} />;
}

function AccordionRow({
  icon,
  title,
  description,
  open,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      style={accordionRowStyle}
    >
      <div style={rowLeftStyle}>
        {icon && (
          <span style={iconStyle}>
            {icon}
          </span>
        )}

        <div>
          <div style={rowTitleStyle}>
            {title}
          </div>

          {description && (
            <div style={rowDescriptionStyle}>
              {description}
            </div>
          )}
        </div>
      </div>

      <span style={chevronStyle}>
        {open ? (
          <ChevronDown size={17} />
        ) : (
          <ChevronRight size={17} />
        )}
      </span>
    </button>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
  compact = false,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        ...rowStyle,
        minHeight: compact ? 58 : 68,
      }}
    >
      <div style={rowLeftStyle}>
        {icon && (
          <span style={iconStyle}>
            {icon}
          </span>
        )}

        <div>
          <div style={rowTitleStyle}>
            {title}
          </div>

          {description && (
            <div style={rowDescriptionStyle}>
              {description}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          ...switchStyle,
          background: checked
            ? "#f97316"
            : "#374151",
        }}
      >
        <span
          style={{
            ...switchKnobStyle,
            transform: checked
              ? "translateX(20px)"
              : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

function SelectRow({
  title,
  value,
  onClick,
}: {
  title: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={interactiveRowStyle}
    >
      <span style={rowTitleStyle}>
        {title}
      </span>

      <span style={valueButtonStyle}>
        {value}
        <ChevronRight size={15} />
      </span>
    </button>
  );
}

function NumberRow({
  icon,
  title,
  description,
  value,
  prefix,
  suffix,
  step,
  onChange,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  value: number;
  prefix?: string;
  suffix?: string;
  step: string;
  onChange: (value: number) => void;
}) {
  return (
    <div style={rowStyle}>
      <div style={rowLeftStyle}>
        {icon && (
          <span style={iconStyle}>
            {icon}
          </span>
        )}

        <div>
          <div style={rowTitleStyle}>
            {title}
          </div>

          {description && (
            <div style={rowDescriptionStyle}>
              {description}
            </div>
          )}
        </div>
      </div>

      <label style={numberFieldStyle}>
        {prefix && (
          <span style={numberAffixStyle}>
            {prefix}
          </span>
        )}

        <input
          type="number"
          min="0"
          step={step}
          value={
            Number.isFinite(value)
              ? value
              : 0
          }
          onChange={(event) =>
            onChange(
              Math.max(
                0,
                Number(event.target.value) || 0
              )
            )
          }
          style={numberInputStyle}
        />

        {suffix && (
          <span style={numberAffixStyle}>
            {suffix}
          </span>
        )}
      </label>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#0b0b0b",
  color: "#fff",
  boxSizing: "border-box",
};

const contentStyle: CSSProperties = {
  width: "100%",
  maxWidth: 760,
  margin: "0 auto",
  padding: "24px 16px 40px",
  boxSizing: "border-box",
};

const headerStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "40px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: 10,
  marginBottom: 22,
};

const backButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 12,
  background: "#151515",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const titleWrapStyle: CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  color: "#f97316",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".12em",
  marginBottom: 3,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(21px, 5vw, 29px)",
  lineHeight: 1.05,
  fontWeight: 800,
  letterSpacing: "-.03em",
};

const saveButtonStyle: CSSProperties = {
  height: 40,
  padding: "0 12px",
  border: "none",
  borderRadius: 12,
  background: "#f97316",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const cardStyle: CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 16,
  padding: "0 16px",
  overflow: "hidden",
  marginBottom: 10,
};

const sectionTitleStyle: CSSProperties = {
  margin: "20px 4px 8px",
  color: "rgba(255,255,255,.4)",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".13em",
};

const rowStyle: CSSProperties = {
  minHeight: 62,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
};

const rowLeftStyle: CSSProperties = {
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const iconStyle: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 9,
  background: "rgba(249,115,22,.09)",
  color: "#f97316",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const rowTitleStyle: CSSProperties = {
  color: "#f3f4f6",
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.25,
};

const rowDescriptionStyle: CSSProperties = {
  marginTop: 3,
  color: "rgba(255,255,255,.42)",
  fontSize: 11,
  lineHeight: 1.3,
};

const dividerStyle: CSSProperties = {
  height: 1,
  background: "rgba(255,255,255,.065)",
};

const switchStyle: CSSProperties = {
  position: "relative",
  width: 42,
  height: 23,
  padding: 2,
  border: 0,
  borderRadius: 999,
  flexShrink: 0,
  cursor: "pointer",
  transition: "background .18s ease",
};

const switchKnobStyle: CSSProperties = {
  display: "block",
  width: 19,
  height: 19,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,.3)",
  transition: "transform .18s ease",
};

const accordionRowStyle: CSSProperties = {
  width: "100%",
  minHeight: 62,
  padding: 0,
  border: 0,
  background: "transparent",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  cursor: "pointer",
  textAlign: "left",
};

const chevronStyle: CSSProperties = {
  color: "rgba(255,255,255,.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const interactiveRowStyle: CSSProperties = {
  width: "100%",
  minHeight: 60,
  padding: 0,
  border: 0,
  background: "transparent",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  cursor: "pointer",
  textAlign: "left",
};

const valueButtonStyle: CSSProperties = {
  minHeight: 34,
  padding: "0 8px",
  borderRadius: 9,
  background: "rgba(255,255,255,.055)",
  color: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  gap: 3,
  fontSize: 11,
  fontWeight: 700,
  flexShrink: 0,
};

const numberFieldStyle: CSSProperties = {
  minWidth: 94,
  height: 36,
  padding: "0 8px",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 9,
  background: "#0c0f14",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 3,
  flexShrink: 0,
};

const numberInputStyle: CSSProperties = {
  width: 52,
  border: 0,
  outline: 0,
  background: "transparent",
  color: "#fff",
  textAlign: "right",
  fontSize: 12,
  fontWeight: 700,
};

const numberAffixStyle: CSSProperties = {
  color: "rgba(255,255,255,.42)",
  fontSize: 11,
  fontWeight: 700,
};

const compactExpandRowStyle: CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: 0,
  border: 0,
  background: "transparent",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  textAlign: "left",
};

const expandValueStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  color: "#f3f4f6",
  fontSize: 12,
  fontWeight: 700,
};

const messageStyle: CSSProperties = {
  marginBottom: 10,
  padding: "9px 11px",
  borderRadius: 10,
  background: "rgba(239,68,68,.08)",
  border: "1px solid rgba(239,68,68,.12)",
  color: "#fca5a5",
  fontSize: 11,
};

const successStyle: CSSProperties = {
  marginBottom: 10,
  padding: "9px 11px",
  borderRadius: 10,
  background: "rgba(34,197,94,.07)",
  border: "1px solid rgba(34,197,94,.12)",
  color: "#86efac",
  fontSize: 11,
};

const loadingStyle: CSSProperties = {
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,.5)",
  fontSize: 13,
};
