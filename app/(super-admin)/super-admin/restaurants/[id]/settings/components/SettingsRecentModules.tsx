"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SettingsModule } from "./types";

interface Props {
  modules: SettingsModule[];
}

const STORAGE_KEY = "wolf-settings-recent";

export default function SettingsRecentModules({ modules }: Props) {
  const [recent, setRecent] = useState<SettingsModule[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      ) as string[];

      const list = saved
        .map((id) => modules.find((module) => module.id === id))
        .filter(Boolean) as SettingsModule[];

      setRecent(list);
    } catch {
      setRecent([]);
    }
  }, [modules]);

  if (recent.length === 0) {
    return null;
  }

  return (
    <section className="recent" aria-label="Módulos recientes">
      <div className="header">
        <h2>Recientes</h2>
        <span>{recent.length}</span>
      </div>

      <div className="list">
        {recent.map((module) => (
          <Link key={module.id} href={module.href} className="item">
            <span
              className="icon"
              style={{
                color: module.color,
                background: `${module.color}10`,
                borderColor: `${module.color}20`,
              }}
              aria-hidden="true"
            >
              {module.icon}
            </span>

            <span className="title">{module.title}</span>

            <span
              className="arrow"
              style={{ color: module.color }}
              aria-hidden="true"
            >
              ›
            </span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .recent {
          margin: 16px 0 0;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0 2px 7px;
        }

        .header h2 {
          margin: 0;
          color: #777;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .header span {
          min-width: 17px;
          height: 17px;
          display: grid;
          place-items: center;
          padding: 0 4px;
          box-sizing: border-box;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          color: #666;
          font-size: 8px;
          font-weight: 750;
        }

        .list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 5px;
        }

        .item {
          min-width: 0;
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.016);
          color: inherit;
          text-decoration: none;
          transition:
            background 0.16s ease,
            border-color 0.16s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .item:hover {
          background: rgba(255, 255, 255, 0.035);
          border-color: rgba(255, 255, 255, 0.09);
        }

        .icon {
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          display: grid;
          place-items: center;
          border: 1px solid;
          border-radius: 7px;
          font-size: 11px;
        }

        .title {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          color: #aaa;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .arrow {
          flex: 0 0 auto;
          font-size: 15px;
          font-weight: 300;
        }

        @media (max-width: 700px) {
          .list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 430px) {
          .list {
            grid-template-columns: 1fr;
          }

          .item {
            min-height: 44px;
          }
        }
      `}</style>
    </section>
  );
}

export function saveRecentModule(moduleId: string) {
  try {
    const current = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    ) as string[];

    const updated = [
      moduleId,
      ...current.filter((id) => id !== moduleId),
    ].slice(0, 6);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}