"use client";

import type { CategoryTab, SettingsModule } from "./types";

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
    if (tab === "Todos") return modules.length;

    return modules.filter((module) => module.category === tab).length;
  }

  return (
    <section className="categories" aria-label="Categorías de configuración">
      <div className="tabs" role="tablist">
        {tabs.map((tab) => {
          const active = value === tab.id;
          const total = getTotal(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? "tab active" : "tab"}
              onClick={() => onChange(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="count">{total}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .categories {
          width: 100%;
          margin: 0;
          overflow: hidden;
        }

        .tabs {
          display: flex;
          align-items: center;
          gap: 5px;
          overflow-x: auto;
          padding: 2px 1px 5px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          min-height: 31px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0 9px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.018);
          color: #777;
          font: inherit;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            color 0.16s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.045);
          color: #bbb;
        }

        .tab.active {
          border-color: rgba(255, 145, 75, 0.22);
          background: rgba(255, 106, 0, 0.09);
          color: #ff914b;
        }

        .count {
          min-width: 15px;
          height: 15px;
          display: grid;
          place-items: center;
          padding: 0 3px;
          box-sizing: border-box;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.045);
          color: #555;
          font-size: 7px;
          font-weight: 800;
        }

        .active .count {
          background: rgba(255, 145, 75, 0.12);
          color: #ff914b;
        }
      `}</style>
    </section>
  );
}