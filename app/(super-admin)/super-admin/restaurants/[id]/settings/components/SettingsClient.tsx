"use client";

import { useMemo, useState } from "react";

import SettingsSearch from "./SettingsSearch";
import SettingsCategoryTabs from "./SettingsCategoryTabs";
import SettingsGrid from "./SettingsGrid";

import {
  CATEGORY_TABS,
} from "./data";

import type {
  SettingsModule,
} from "./types";

interface Props {
  modules: SettingsModule[];
}

export default function SettingsClient({
  modules,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("Todos");

  /*
  ===========================================
  FILTRADO
  ===========================================
  */

  const filteredModules =
    useMemo(() => {
      return modules.filter(
        (module) => {
          const matchesCategory =
            category === "Todos" ||
            module.category ===
              category;

          const term =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            term.length === 0 ||
            module.title
              .toLowerCase()
              .includes(term) ||
            module.description
              .toLowerCase()
              .includes(term) ||
            module.category
              .toLowerCase()
              .includes(term);

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      modules,
      category,
      search,
    ]);

  return (
    <>
      <SettingsSearch
        value={search}
        onChange={setSearch}
      />

      <SettingsCategoryTabs
        tabs={CATEGORY_TABS}
        modules={modules}
        value={category}
        onChange={setCategory}
      />

      <SettingsGrid
        modules={filteredModules}
        search=""
        category="Todos"
      />
    </>
  );
}