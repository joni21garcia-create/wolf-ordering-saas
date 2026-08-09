"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Link from "next/link";
import { getRestaurantStatus } from "@/lib/schedule";

import { supabase } from "@/lib/supabase/client";
import type { RestaurantData } from "@/types/marketing";

import ProductsPanel from "./products/ProductsPanel";
import { Marketing } from "@/components/marketing";
import HoursPanel from "./HoursPanel";


interface RestaurantViewProps {
  restaurantId: string;
}

type RestaurantSection =
  | "products"
  | "hours"
  | "marketing"
  | "payments";

export default function RestaurantView({
  restaurantId,
}: RestaurantViewProps) {
  const [activeSection, setActiveSection] =
    useState<RestaurantSection>("products");

    const [restaurant, setRestaurant] =
  useState<RestaurantData | null>(null);

useEffect(() => {
  async function loadRestaurant() {
    const { data, error } = await supabase
      .from("restaurants")
      .select(`
        id,
        name,
        slug,
        logo_url,
        primary_color
      `)
      .eq("id", restaurantId)
      .single();

    if (error || !data) {
      console.error(
        "Error cargando restaurante:",
        error
      );
      return;
    }

    setRestaurant(data);
  }

  loadRestaurant();
}, [restaurantId]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "#090909",
        color: "#FFFFFF",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        style={{
          padding:
            "18px 14px 0",
          boxSizing:
            "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "23px",
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing:
              "-0.5px",
            color: "#FFFFFF",
          }}
        >
          Restaurante
        </h1>

        <p
          style={{
            margin:
              "6px 0 0",
            fontSize: "13px",
            lineHeight: 1.4,
            color: "#71717A",
          }}
        >
          Control rápido de tu restaurante
        </p>
      </header>

      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <RestaurantToolbar
        restaurantId={restaurantId}
        activeSection={
          activeSection
        }
        onChange={
          setActiveSection
        }
      />

      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      <section
        style={{
          width: "100%",
          padding:
            "4px 10px 32px",
          boxSizing:
            "border-box",
        }}
      >
        {activeSection ===
          "products" && (
          <ProductsSection
            restaurantId={
              restaurantId
            }
          />
        )}

{activeSection === "hours" && (
          <HoursSection restaurantId={restaurantId} />
        )}

{activeSection === "marketing" && restaurant && (
  <Marketing restaurant={restaurant} />
)}

        {activeSection === "payments" && (
          <div />
        )}
      </section>
    </main>
  );
}

/* =========================================================
   TOOLBAR
   ========================================================= */

interface RestaurantToolbarProps {
  restaurantId: string;
  activeSection: RestaurantSection;
  onChange: (
    section: RestaurantSection
  ) => void;
}

function RestaurantToolbar({
  restaurantId,
  activeSection,
  onChange,
}: RestaurantToolbarProps) {
  const tabs: {
    id: RestaurantSection;
    label: string;
  }[] = [
    {
      id: "products",
      label: "Productos",
    },
    {
      id: "hours",
      label: "Horarios",
    },
    {
      id: "marketing",
      label: "Marketing",
    },
    {
      id: "payments",
      label: "Pagos",
    },
  ];

  return (
    <nav
      aria-label="ConfiguraciÃ³n del restaurante"
      style={{
        width: "100%",
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        padding:
          "14px 14px 9px",
        boxSizing:
          "border-box",
        WebkitOverflowScrolling:
          "touch",
        scrollbarWidth:
          "none",
        overscrollBehaviorX:
          "contain",
      }}
    >
      {tabs.map((tab) => {
        const active =
          activeSection ===
          tab.id;

        return (
          <RestaurantTab
            key={tab.id}
            label={tab.label}
            active={active}
            onClick={() => {
              if (tab.id === "payments") {
                window.location.assign(
                  `/admin/restaurant/${encodeURIComponent(
                    restaurantId
                  )}/payments`
                );
                return;
              }

              onChange(tab.id);
            }}
          />
        );
      })}
    </nav>
  );
}

/* =========================================================
   TAB
   ========================================================= */

interface RestaurantTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function RestaurantTab({
  label,
  active,
  onClick,
}: RestaurantTabProps) {
  const isPayments = label === "Pagos";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={{
        position: "relative",
        flexShrink: 0,
        minHeight: "36px",
        padding: "0 12px",
        borderRadius: "9px",
        border: active
          ? "1px solid rgba(249,115,22,.48)"
          : isPayments
            ? "1px solid rgba(249,115,22,.20)"
            : "1px solid rgba(255,255,255,.07)",
        background: active
          ? "linear-gradient(135deg,#ff7a18,#f97316)"
          : isPayments
            ? "linear-gradient(135deg,rgba(249,115,22,.10),rgba(255,255,255,.025))"
            : "linear-gradient(180deg,#151515,#101010)",
        color: active
          ? "#FFFFFF"
          : isPayments
            ? "#F4B183"
            : "#A1A1AA",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "-0.1px",
        lineHeight: 1,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transition:
          "transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease",
        boxShadow: active
          ? "0 4px 12px rgba(249,115,22,.16)"
          : "none",
        overflow: "hidden",
      }}
    >
      {isPayments && !active && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            marginRight: "6px",
            verticalAlign: "middle",
            borderRadius: "50%",
            background: "#f97316",
            boxShadow: "0 0 9px rgba(249,115,22,.75)",
          }}
        />
      )}
      {label}
    </button>
  );
}

/* =========================================================
   PRODUCTOS
   ========================================================= */

interface ProductsSectionProps {
  restaurantId: string;
}

function ProductsSection({
  restaurantId,
}: ProductsSectionProps) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          padding:
            "7px 4px 13px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize:
              "18px",
            lineHeight:
              1.2,
            fontWeight:
              800,
            color:
              "#FFFFFF",
          }}
        >
          Productos
        </h2>

        <p
          style={{
            margin:
              "5px 0 0",
            fontSize:
              "12px",
            lineHeight:
              1.4,
            color:
              "#71717A",
          }}
        >
          Activa o desactiva productos de tu menú.
        </p>
      </div>

      <ProductsPanel
        restaurantId={
          restaurantId
        }
      />
    </div>
  );
}

/* =========================================================
   HORARIOS
   ========================================================= */

interface HoursSectionProps {
  restaurantId: string;
}

interface ScheduleResponse {
  success?: boolean;
  schedule?: Record<string, unknown> | null;
  error?: string;
}

function HoursSection({
  restaurantId,
}: HoursSectionProps) {
  const [schedule, setSchedule] =
    useState<Record<string, unknown> | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      try {
        const response = await fetch(
          "/api/schedule/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurantId,
            }),
            cache: "no-store",
          },
        );

        const data =
          (await response.json()) as ScheduleResponse;

        if (cancelled) return;

        if (data.success === false) {
          console.error(
            "Error cargando horarios:",
            data.error,
          );

          setSchedule(null);
        } else {
          setSchedule(
            data.schedule ?? null,
          );
        }
      } catch (error) {
        console.error(
          "Error cargando horarios:",
          error,
        );

        if (!cancelled) {
          setSchedule(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          padding: "30px 12px",
          boxSizing: "border-box",
          textAlign: "center",
          color: "#71717A",
          fontSize: 13,
        }}
      >
        Cargando horarios...
      </div>
    );
  }

  const status = schedule
    ? getRestaurantStatus(schedule as any)
    : null;

  const getTodayKey = () => {
    const keys = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    return keys[new Date().getDay()];
  };

  const toggleReceivingOrders = async () => {
    if (!schedule || saving) return;

    const dayKey = getTodayKey();

    const openKey = `${dayKey}_open`;
    const closeKey = `${dayKey}_close`;

    const currentOpen =
      typeof schedule[openKey] === "string"
        ? schedule[openKey] as string
        : "";

    const currentClose =
      typeof schedule[closeKey] === "string"
        ? schedule[closeKey] as string
        : "";

    const currentlyReceiving =
      Boolean(currentOpen && currentClose);

    let nextSchedule = {
      ...schedule,
    };

    if (currentlyReceiving) {
      const storageKey =
        `wolf-original-hours-${restaurantId}-${dayKey}`;

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          open: currentOpen,
          close: currentClose,
        }),
      );

      nextSchedule[openKey] = "";
      nextSchedule[closeKey] = "";
    } else {
      const storageKey =
        `wolf-original-hours-${restaurantId}-${dayKey}`;

      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        return;
      }

      const original =
        JSON.parse(saved) as {
          open?: string;
          close?: string;
        };

      if (!original.open || !original.close) {
        return;
      }

      nextSchedule[openKey] =
        original.open;

      nextSchedule[closeKey] =
        original.close;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/schedule/save",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            restaurantId,
            schedule: nextSchedule,
          }),
          cache: "no-store",
        },
      );

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
            "No se pudo guardar el horario",
        );
      }

      setSchedule(nextSchedule);
    } catch (error) {
      console.error(
        "Error cambiando recepciÃ³n de pedidos:",
        error,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <HoursPanel
      restaurantId={restaurantId}
      schedule={schedule}
      isOpen={Boolean(status?.isOpen)}
      onToggleReceivingOrders={
        toggleReceivingOrders
      }
      saving={saving}
    />
  );
}
/* =========================================================
   FUTURAS SECCIONES
   ========================================================= */

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

function PlaceholderSection({
  title,
  description,
}: PlaceholderSectionProps) {
  return (
    <div
      style={{
        width: "100%",
        padding:
          "28px 12px",
        boxSizing:
          "border-box",
        textAlign:
          "center",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize:
            "18px",
          fontWeight:
            800,
          color:
            "#FFFFFF",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin:
            "7px auto 0",
          maxWidth:
            "320px",
          fontSize:
            "13px",
          lineHeight:
            1.5,
          color:
            "#71717A",
        }}
      >
        {description}
      </p>

      <div
        style={{
          margin:
            "20px auto 0",
          maxWidth:
            "340px",
          padding:
            "15px",
          borderRadius:
            "12px",
          background:
            "#121212",
          border:
            "1px solid rgba(255,255,255,.06)",
          color:
            "#52525B",
          fontSize:
            "12px",
        }}
      >
        Próximamente.
      </div>
    </div>
  );
}