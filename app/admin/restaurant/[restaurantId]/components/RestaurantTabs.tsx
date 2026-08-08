"use client";

import type { CSSProperties } from "react";

export type RestaurantTab =
  | "products"
  | "hours"
  | "marketing";

interface RestaurantTabsProps {
  activeTab: RestaurantTab;
  onChange: (tab: RestaurantTab) => void;
}

const tabs: {
  id: RestaurantTab;
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

export default function RestaurantTabs({
  activeTab,
  onChange,
}: RestaurantTabsProps) {
  return (
    <nav
      aria-label="Secciones del restaurante"
      style={{
        width: "100%",
        display: "flex",
        gap: 7,
        overflowX: "auto",
        padding: "17px 14px 11px",
        boxSizing: "border-box",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        overscrollBehaviorX: "contain",
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={active ? "page" : undefined}
            style={{
              ...tabStyle,
              ...(active ? activeTabStyle : inactiveTabStyle),
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

const tabStyle: CSSProperties = {
  position: "relative",
  flexShrink: 0,
  minHeight: 39,
  padding: "0 15px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition:
    "all 180ms cubic-bezier(.16,.84,.44,1)",
};

const activeTabStyle: CSSProperties = {
  border:
    "1px solid rgba(249,115,22,.28)",
  background: "#F97316",
  color: "#FFFFFF",
  boxShadow:
    "0 0 18px rgba(249,115,22,.18)",
};

const inactiveTabStyle: CSSProperties = {
  border:
    "1px solid rgba(255,255,255,.06)",
  background: "#121212",
  color: "#A1A1AA",
  boxShadow: "none",
};