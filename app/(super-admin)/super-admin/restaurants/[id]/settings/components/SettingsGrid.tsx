"use client";

import { useEffect, useMemo, useState } from "react";
import SettingsModuleCard from "./SettingsModuleCard";
import type { SettingsModule } from "./types";

interface Props {
  modules: SettingsModule[];
  search: string;
  category: string;
}

const CATEGORY_ORDER = [
  "Experiencia",
  "Operación",
  "Negocio",
  "Administración",
  "Sistema",
] as const;

const CATEGORY_META: Record<
  string,
  { icon: string; color: string }
> = {
  Experiencia: { icon: "✦", color: "#ec4899" },
  "Operación": { icon: "◈", color: "#3b82f6" },
  Negocio: { icon: "▥", color: "#22c55e" },
  Administración: { icon: "◎", color: "#f59e0b" },
  Sistema: { icon: "⚙", color: "#8b8b8b" },
};

export default function SettingsGrid({
  modules,
  search,
  category,
}: Props) {
  const term = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return modules.filter((module) => {
      const matchesCategory =
        category === "Todos" || module.category === category;

      const matchesSearch =
        term.length === 0 ||
        module.title.toLowerCase().includes(term) ||
        module.description.toLowerCase().includes(term) ||
        module.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [modules, category, term]);

  const groups = useMemo(() => {
    const grouped = new Map<string, SettingsModule[]>();

    for (const module of filtered) {
      const current = grouped.get(module.category) ?? [];
      current.push(module);
      grouped.set(module.category, current);
    }

    return CATEGORY_ORDER.filter((name) => grouped.has(name)).map(
      (name) => ({
        name,
        modules: grouped.get(name)!,
      })
    );
  }, [filtered]);

  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    if (term.length > 0) {
      setOpenGroups(groups.map((group) => group.name));
    }
  }, [term, groups]);

  if (filtered.length === 0) {
    return (
      <section className="empty" aria-live="polite">
        <span className="empty-icon">⌕</span>
        <strong>No se encontraron módulos</strong>
        <p>Prueba con otro término o categoría.</p>

        <style jsx>{`
          .empty {
            min-height: 110px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 18px;
            border: 1px dashed rgba(255, 255, 255, 0.07);
            border-radius: 11px;
            background: rgba(255, 255, 255, 0.015);
            text-align: center;
          }

          .empty-icon {
            margin-bottom: 5px;
            color: #666;
            font-size: 17px;
          }

          strong {
            color: #bbb;
            font-size: 10px;
          }

          p {
            margin: 4px 0 0;
            color: #555;
            font-size: 8px;
          }
        `}</style>
      </section>
    );
  }

  function toggleGroup(name: string) {
    setOpenGroups((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  return (
    <section className="groups" aria-label="Módulos de configuración">
      <div className="section-heading">
        <span>Módulos de configuración</span>
        <strong>{filtered.length}</strong>
      </div>

      {groups.map((group) => {
        const meta = CATEGORY_META[group.name] ?? {
          icon: "•",
          color: group.modules[0]?.color ?? "#777",
        };

        const open = openGroups.includes(group.name);

        return (
          <section
            key={group.name}
            className={`group ${open ? "open" : ""}`}
            style={{
              "--accent": meta.color,
              "--accent-soft": `${meta.color}12`,
              "--accent-border": `${meta.color}25`,
            } as React.CSSProperties}
          >
            <button
              type="button"
              className="group-trigger"
              onClick={() => toggleGroup(group.name)}
              aria-expanded={open}
            >
              <span className="group-icon" aria-hidden="true">
                {meta.icon}
              </span>

              <span className="group-copy">
                <strong>{group.name}</strong>
                <small>
                  {group.modules.length}{" "}
                  {group.modules.length === 1 ? "módulo" : "módulos"}
                </small>
              </span>

              <span className="group-count">
                {group.modules.length}
              </span>

              <span className="chevron" aria-hidden="true">
                ›
              </span>
            </button>

            {open && (
              <div className="module-list">
                {group.modules.map((module) => (
                  <SettingsModuleCard
                    key={module.id}
                    module={module}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      <style jsx>{`
        .groups {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 2px 2px 3px;
          color: #555;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .section-heading strong {
          min-width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          padding: 0 4px;
          box-sizing: border-box;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          color: #666;
          font-size: 8px;
        }

        .group {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
        }

        .group.open {
          border-color: var(--accent-border);
        }

        .group-trigger {
          width: 100%;
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 9px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .group-trigger:hover,
        .group.open .group-trigger {
          background: var(--accent-soft);
        }

        .group-icon {
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          display: grid;
          place-items: center;
          border: 1px solid var(--accent-border);
          border-radius: 8px;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 13px;
          font-weight: 800;
        }

        .group-copy {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .group-copy strong {
          color: #d0d0d0;
          font-size: 10px;
          font-weight: 800;
        }

        .group-copy small {
          color: #555;
          font-size: 8px;
        }

        .group-count {
          min-width: 19px;
          height: 19px;
          display: grid;
          place-items: center;
          padding: 0 4px;
          border-radius: 6px;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 8px;
          font-weight: 800;
        }

        .chevron {
          color: #666;
          font-size: 19px;
          line-height: 1;
          transform: rotate(0deg);
          transition: transform 0.18s ease;
        }

        .group.open .chevron {
          transform: rotate(90deg);
          color: var(--accent);
        }

        .module-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 5px 5px;
        }

        .module-list :global(.card) {
          border-radius: 8px;
        }

        @media (max-width: 430px) {
          .group-trigger {
            min-height: 53px;
          }

          .module-list {
            gap: 3px;
          }
        }
      `}</style>
    </section>
  );
}