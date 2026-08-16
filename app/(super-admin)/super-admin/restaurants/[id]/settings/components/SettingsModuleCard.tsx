"use client";

import Link from "next/link";
import type { SettingsModule } from "./types";

interface Props {
  module: SettingsModule;
}

export default function SettingsModuleCard({ module }: Props) {
  return (
    <Link href={module.href} className="link">
      <article className="card">
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

        <div className="content">
          <div className="title-row">
            <h2>{module.title}</h2>

            {module.featured && (
              <span
                className="featured"
                style={{
                  color: module.color,
                  background: `${module.color}10`,
                }}
              >
                Destacado
              </span>
            )}
          </div>

          <p>{module.description}</p>

          <span className="category">{module.category}</span>
        </div>

        <span
          className="arrow"
          style={{
            color: module.color,
          }}
          aria-hidden="true"
        >
          ›
        </span>
      </article>

      <style jsx>{`
        .link {
          display: block;
          min-width: 0;
          color: inherit;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }

        .card {
          min-width: 0;
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 9px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            transform 0.16s ease;
        }

        .link:hover .card {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .icon {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: grid;
          place-items: center;
          border: 1px solid;
          border-radius: 9px;
          font-size: 14px;
        }

        .content {
          min-width: 0;
          flex: 1;
          overflow: hidden;
        }

        .title-row {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        h2 {
          min-width: 0;
          margin: 0;
          overflow: hidden;
          color: #ddd;
          font-size: 10px;
          line-height: 1.25;
          font-weight: 800;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        p {
          margin: 2px 0 0;
          overflow: hidden;
          color: #626262;
          font-size: 8px;
          line-height: 1.35;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .category {
          display: inline-block;
          max-width: 100%;
          margin-top: 3px;
          overflow: hidden;
          color: #555;
          font-size: 7px;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .featured {
          flex: 0 0 auto;
          padding: 2px 5px;
          border-radius: 5px;
          font-size: 7px;
          font-weight: 800;
        }

        .arrow {
          flex: 0 0 auto;
          font-size: 19px;
          font-weight: 300;
          line-height: 1;
        }

        @media (max-width: 620px) {
          .card {
            min-height: 60px;
            padding: 8px 10px;
          }

          .icon {
            width: 32px;
            height: 32px;
            flex-basis: 32px;
          }

          h2 {
            font-size: 10.5px;
          }

          p {
            font-size: 8.5px;
          }
        }
      `}</style>
    </Link>
  );
}