"use client";

import SettingsModuleCard from "./SettingsModuleCard";

import type {
  SettingsModule,
} from "./types";

interface Props {
  modules: SettingsModule[];

  search: string;

  category: string;
}

export default function SettingsGrid({
  modules,
  search,
  category,
}: Props) {
  const term =
    search.trim().toLowerCase();

  const filtered =
    modules.filter((module) => {
      const matchesCategory =
        category === "Todos" ||
        module.category === category;

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
    });

  if (filtered.length === 0) {
    return (
      <section
        style={{
          background:
            "linear-gradient(180deg,#151515,#0b0b0b)",

          border:
            "1px solid rgba(255,255,255,.07)",

          borderRadius: 28,

          padding: "70px 30px",

          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 62,
            marginBottom: 18,
          }}
        >
          🔍
        </div>

        <h2
          style={{
            color: "#fff",
            margin: 0,
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          No se encontraron módulos
        </h2>

        <p
          style={{
            marginTop: 14,
            color: "#8b8b95",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 520,
            marginInline: "auto",
          }}
        >
          Prueba con otro término de
          búsqueda o selecciona una
          categoría diferente.
        </p>
      </section>
    );
  }

  return (
    <section
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(330px,1fr))",

        gap: 24,
      }}
    >
      {filtered.map((module) => (
        <SettingsModuleCard
          key={module.id}
          module={module}
        />
      ))}
    </section>
  );
}