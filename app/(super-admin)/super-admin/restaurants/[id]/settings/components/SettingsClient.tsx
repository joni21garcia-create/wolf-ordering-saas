"use client";

import { useMemo, useState } from "react";

import SettingsSearch from "./SettingsSearch";
import SettingsCategoryTabs from "./SettingsCategoryTabs";
import SettingsGrid from "./SettingsGrid";

import { CATEGORY_TABS } from "./data";
import type { SettingsModule } from "./types";

interface Props {
  modules: SettingsModule[];
}

export default function SettingsClient({ modules }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesCategory =
        category === "Todos" || module.category === category;

      const term = search.trim().toLowerCase();

      const matchesSearch =
        term.length === 0 ||
        module.title.toLowerCase().includes(term) ||
        module.description.toLowerCase().includes(term) ||
        module.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [modules, category, search]);

  return (
    <section className="settings-browser" aria-label="Configuraciones">
      <div className="search">
        <SettingsSearch value={search} onChange={setSearch} />
      </div>

      <div className="tabs">
        <SettingsCategoryTabs
          tabs={CATEGORY_TABS}
          modules={modules}
          value={category}
          onChange={setCategory}
        />
      </div>

      <div className="results">
        <div className="results-header">
          <span>Configuraciones</span>
          <span>{filteredModules.length}</span>
        </div>

        <SettingsGrid
          modules={filteredModules}
          search={search}
          category={category}
        />
      </div>

      <style jsx>{`
        .settings-browser {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .search {
          width: 100%;
        }

        .tabs {
          min-width: 0;
          overflow: hidden;
        }

        .results {
          min-width: 0;
          margin-top: 2px;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0 2px 7px;
          color: #6b6b6b;
          font-size: 9px;
          font-weight: 750;
        }

        .results-header span:last-child {
          min-width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          padding: 0 5px;
          box-sizing: border-box;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          color: #858585;
          font-size: 8px;
        }
      `}</style>
    </section>
  );
}