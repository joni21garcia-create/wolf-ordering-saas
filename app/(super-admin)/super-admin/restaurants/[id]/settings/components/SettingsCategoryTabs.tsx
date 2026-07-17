"use client";

import type {
  CategoryTab,
  SettingsModule,
} from "./types";

interface Props {
  tabs: CategoryTab[];
  modules: SettingsModule[];
  value: string;
  onChange: (value: string) => void;
}

export default function SettingsCategoryTabs({
  tabs,
  modules,
  value,
  onChange,
}: Props) {
  function getTotal(tab: string) {
    if (tab === "Todos") {
      return modules.length;
    }

    return modules.filter(
      (module) => module.category === tab
    ).length;
  }

  return (
    <section
      style={{
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 6,
          scrollbarWidth: "none", // Ocultar scroll en Firefox
          msOverflowStyle: "none",  // Ocultar scroll en IE/Edge
        }}
        className="no-scrollbar"
      >
        {tabs.map((tab) => {
          const active = value === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                flexShrink: 0,
                cursor: "pointer",
                borderRadius: 999,
                padding: "10px 18px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 700,
                fontSize: 13,
                transition: "all 0.2s ease",
                background: active
                  ? "#f97316"
                  : "rgba(255, 255, 255, 0.03)",
                color: active ? "#fff" : "#a1a1aa",
                border: active
                  ? "1px solid #f97316"
                  : "1px solid rgba(255, 255, 255, 0.07)",
                boxShadow: active
                  ? "0 4px 12px rgba(249, 115, 22, 0.3)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.color = "#a1a1aa";
                }
              }}
            >
              <span>{tab.label}</span>

              <span
                style={{
                  background: active
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.06)",
                  color: active ? "#fff" : "#71717a",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {getTotal(tab.id)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}