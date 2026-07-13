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
      (module) =>
        module.category === tab
    ).length;
  }

  return (
    <section
      style={{
        marginBottom: 34,
      }}
    >
      <div
        style={{
          display: "flex",

          gap: 14,

          overflowX: "auto",

          paddingBottom: 4,
        }}
      >
        {tabs.map((tab) => {
          const active =
            value === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() =>
                onChange(tab.id)
              }
              style={{
                flexShrink: 0,

                border: "none",

                cursor: "pointer",

                borderRadius: 999,

                padding:
                  "14px 22px",

                display: "flex",

                alignItems: "center",

                gap: 10,

                fontWeight: 700,

                transition: ".25s",

                background: active
                  ? "#f97316"
                  : "#141414",

                color: "#fff",

                borderBottom: active
                  ? "none"
                  : "1px solid rgba(255,255,255,.08)",
              }}
            >
              <span>
                {tab.label}
              </span>

              <span
                style={{
                  background: active
                    ? "rgba(255,255,255,.18)"
                    : "rgba(255,255,255,.08)",

                  borderRadius: 999,

                  padding:
                    "4px 10px",

                  fontSize: 12,

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