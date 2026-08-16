"use client";

import type { SettingsModule, CategoryTab } from "./types";

interface Props {
  modules: SettingsModule[];
  tabs: CategoryTab[];
  actions: unknown[];
}

export default function SettingsStats({ modules, tabs }: Props) {
  const totalModules = modules.length;
  const featured = modules.filter((module) => module.featured).length;
  const categories = Math.max(0, tabs.length - 1);

  const coverage =
    totalModules === 0
      ? 0
      : Math.round((featured / totalModules) * 100);

  const coverageColor =
    coverage >= 80
      ? "#22c55e"
      : coverage >= 50
        ? "#f59e0b"
        : "#ef4444";

  const stats = [
    { label: "Módulos", value: totalModules },
    { label: "Destacados", value: featured },
    { label: "Categorías", value: categories },
    { label: "Cobertura", value: `${coverage}%`, color: coverageColor },
  ];

  return (
    <section className="stats" aria-label="Resumen">
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <span>{stat.label}</span>
          <strong style={{ color: stat.color ?? "#ddd" }}>
            {stat.value}
          </strong>
        </div>
      ))}

      <style jsx>{`
        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: center;
          margin: 0 0 12px;
          padding: 8px 2px;
          border-top: 1px solid rgba(255, 255, 255, 0.045);
          border-bottom: 1px solid rgba(255, 255, 255, 0.045);
        }

        .stat {
          min-width: 0;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          padding: 0 5px;
          border-right: 1px solid rgba(255, 255, 255, 0.045);
        }

        .stat:last-child {
          border-right: 0;
        }

        .stat span {
          overflow: hidden;
          color: #555;
          font-size: 7px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.45px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .stat strong {
          flex: 0 0 auto;
          font-size: 12px;
          line-height: 1;
          font-weight: 850;
        }

        @media (max-width: 430px) {
          .stats {
            padding: 7px 0;
          }

          .stat {
            gap: 3px;
            padding: 0 3px;
          }

          .stat span {
            font-size: 6.5px;
          }

          .stat strong {
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
}