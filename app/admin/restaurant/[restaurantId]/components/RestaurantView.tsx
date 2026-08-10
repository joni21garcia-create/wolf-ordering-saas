"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/providers/SessionProvider";
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
  | "marketing";

export default function RestaurantView({
  restaurantId,
}: RestaurantViewProps) {
  const { user } = useSession();
  const roleCode = String(user?.role?.code ?? "")
    .trim()
    .toLowerCase();

  const [restaurant, setRestaurant] =
    useState<RestaurantData | null>(null);

  useEffect(() => {
    let cancelled = false;

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

      if (cancelled) return;

      if (error || !data) {
        console.error(
          "Error cargando restaurante:",
          error
        );
        setRestaurant(null);
        return;
      }

      setRestaurant(data as RestaurantData);
    }

    loadRestaurant();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  /*
   * Configuración visible por rol.
   *
   * Cocina:
   *   Productos + Horarios
   *
   * Manager:
   *   Productos + Horarios + Marketing
   *
   * Owner / Super Admin:
   *   Todas las opciones disponibles en este módulo.
   *
   * "kitchen" se mantiene como alias por compatibilidad
   * con roles antiguos que todavía puedan existir.
   */
  const allowedSections = useMemo<RestaurantSection[]>(() => {
    switch (roleCode) {
      case "cocina":
      case "kitchen":
        return ["products", "hours"];

      case "manager":
      case "owner":
      case "super-user":
        return [
          "products",
          "hours",
          "marketing",
        ];

      default:
        return [];
    }
  }, [roleCode]);

  const [activeSection, setActiveSection] =
    useState<RestaurantSection>("products");

  useEffect(() => {
    if (
      allowedSections.length > 0 &&
      !allowedSections.includes(activeSection)
    ) {
      setActiveSection(allowedSections[0]);
    }
  }, [allowedSections, activeSection]);

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
            fontWeight: 800,
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

{activeSection === "marketing" &&
  restaurant && (
    <Marketing
      restaurant={restaurant}
    />
  )}
      </section>
    </main>
  );
}

/* =========================================================
   TOOLBAR
   ========================================================= */

interface RestaurantToolbarProps {
  activeSection: RestaurantSection;
  onChange: (
    section: RestaurantSection
  ) => void;
}

function RestaurantToolbar({
  activeSection,
  onChange,
}: RestaurantToolbarProps) {
  const { user } = useSession();

  const roleCode = String(user?.role?.code ?? "")
    .trim()
    .toLowerCase();

  const allowedSections: RestaurantSection[] =
    roleCode === "cocina" ||
    roleCode === "kitchen"
      ? ["products", "hours"]
      : roleCode === "manager" ||
        roleCode === "owner" ||
        roleCode === "super-user"
        ? [
            "products",
            "hours",
            "marketing",
          ]
        : [];


  const allTabs: {
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
  ];

  const tabs: {
    id: RestaurantSection;
    label: string;
  }[] = allTabs.filter((tab) =>
    allowedSections.includes(tab.id)
  );

  return (
    <nav
      aria-label="ConfiguraciÃ³n del restaurante"
      style={{
        width: "100%",
        display: "flex",
        gap: "7px",
        overflowX: "auto",
        padding:
          "17px 14px 11px",
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
            onClick={() =>
              onChange(tab.id)
            }
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={
        active
          ? "page"
          : undefined
      }
      style={{
        position:
          "relative",
        flexShrink: 0,
        minHeight:
          "39px",
        padding:
          "0 15px",
        borderRadius:
          "10px",
        border: active
          ? "1px solid rgba(249,115,22,.28)"
          : "1px solid rgba(255,255,255,.06)",
        background:
          active
            ? "#F97316"
            : "#121212",
        color:
          active
            ? "#FFFFFF"
            : "#A1A1AA",
        fontSize:
          "13px",
        fontWeight:
          700,
        lineHeight: 1,
        cursor:
          "pointer",
        WebkitTapHighlightColor:
          "transparent",
        transition:
          "all 180ms cubic-bezier(.16,.84,.44,1)",
        boxShadow:
          active
            ? "0 0 18px rgba(249,115,22,.18)"
            : "none",
      }}
    >
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