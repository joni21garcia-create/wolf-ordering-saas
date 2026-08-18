"use client";

import ExecutiveCard from "./ExecutiveCard";

type Module = {
  code: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: React.ReactNode;
  category?: string;
};

interface Props {
  operationModules: Module[];
  settingsModules: Module[];
}

/**
 * UI ONLY
 *
 * No modifica:
 * - permisos
 * - autenticación
 * - módulos recibidos
 * - rutas
 * - lógica de negocio
 *
 * Solo organiza la presentación de los módulos
 * para desktop y móvil.
 */
export default function ExecutiveCenter({
  operationModules = [],
  settingsModules = [],
}: Props) {
  const totalModulesCount =
    operationModules.length +
    settingsModules.length;

  return (
    <section className="executive-center">
      <div className="section-intro">
        <div className="section-copy">
          <span className="eyebrow">
            ACCESOS
          </span>

          <h2>Módulos</h2>

          <p>
            Accede a las herramientas globales
            disponibles para tu cuenta.
          </p>
        </div>

        <div className="module-count">
          <strong>
            {totalModulesCount}
          </strong>

          <span>
            módulos disponibles
          </span>
        </div>
      </div>

      <div className="groups">
        {operationModules.length > 0 && (
          <ModuleGroup
            title="Operación"
            modules={operationModules}
          />
        )}

        {settingsModules.length > 0 && (
          <SettingsGroups
            modules={settingsModules}
          />
        )}
      </div>

      {totalModulesCount === 0 && (
        <div className="empty-state">
          <strong>
            No tienes módulos asignados
          </strong>

          <span>
            Los módulos autorizados para tu
            cuenta aparecerán aquí
            automáticamente.
          </span>
        </div>
      )}

      <style jsx>{`
        .executive-center {
          width: 100%;
          margin-bottom: 34px;
        }

        .section-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 14px;
        }

        .section-copy {
          min-width: 0;
        }

        .eyebrow {
          display: block;
          margin-bottom: 5px;
          color: #f97316;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #fff;
          font-size: 20px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .section-copy p {
          margin: 5px 0 0;
          color: #666;
          font-size: 12px;
          line-height: 1.45;
        }

        .module-count {
          display: flex;
          align-items: baseline;
          gap: 7px;
          flex-shrink: 0;
          color: #626262;
        }

        .module-count strong {
          color: #fff;
          font-size: 20px;
          font-weight: 850;
        }

        .module-count span {
          font-size: 10px;
        }

        .groups {
          display: grid;
          gap: 22px;
        }

        .group {
          min-width: 0;
        }

        .group-title {
          margin: 0 0 8px;
          color: #4f4f4f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        .module-list {
          display: grid;
          gap: 8px;
        }

        .module {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 60px;
          padding: 10px 13px;
          color: inherit;
          text-decoration: none;
          border: 1px solid
            rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: #0e0e0e;
          transition:
            border-color 0.18s ease,
            background 0.18s ease,
            transform 0.18s ease;
        }

        .module:hover {
          background: #111;
          border-color:
            rgba(249, 115, 22, 0.18);
          transform: translateY(-1px);
        }

        .module-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid;
        }

        .module-icon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .module-content {
          min-width: 0;
          flex: 1;
        }

        .module-title {
          display: block;
          color: #f2f2f2;
          font-size: 13px;
          font-weight: 750;
        }

        .module-description {
          display: block;
          margin-top: 3px;
          overflow: hidden;
          color: #626262;
          font-size: 11px;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .module-arrow {
          flex: 0 0 auto;
          color: #4d4d4d;
          font-size: 18px;
          transition:
            color 0.18s ease,
            transform 0.18s ease;
        }

        .module:hover .module-arrow {
          color: #f97316;
          transform: translateX(2px);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 20px;
          border: 1px solid
            rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: #0e0e0e;
        }

        .empty-state strong {
          color: #f5f5f5;
          font-size: 13px;
        }

        .empty-state span {
          color: #666;
          font-size: 11px;
          line-height: 1.4;
        }

        /*
         * ExecutiveCard se mantiene importado
         * para compatibilidad con dependencias
         * existentes del proyecto.
         */
        :global(.executive-card) {
          display: none;
        }

        @media (min-width: 760px) {
          .module-list {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1050px) {
          .module-list {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .section-intro {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .module-count {
            padding: 6px 0;
          }

          .module-description {
            white-space: normal;
          }

          .module {
            min-height: 58px;
          }
        }
      `}</style>
    </section>
  );
}

function SettingsGroups({
  modules,
}: {
  modules: Module[];
}) {
  const categoryOrder = [
    "Experiencia",
    "Operación",
    "Negocio",
    "Administración",
    "Sistema",
  ];

  const groups = categoryOrder
    .map((category) => ({
      title: category,
      modules: modules.filter(
        (module) =>
          module.category === category
      ),
    }))
    .filter(
      (group) => group.modules.length > 0
    );

  /*
   * Compatibilidad con módulos antiguos
   * que todavía no tengan category.
   */
  const uncategorized = modules.filter(
    (module) => !module.category
  );

  if (uncategorized.length > 0) {
    groups.push({
      title: "Configuración",
      modules: uncategorized,
    });
  }

  return (
    <>
      {groups.map((group) => (
        <ModuleGroup
          key={group.title}
          title={group.title}
          modules={group.modules}
        />
      ))}
    </>
  );
}

function ModuleGroup({
  title,
  modules,
}: {
  title: string;
  modules: Module[];
}) {
  return (
    <div className="group">
      <h3 className="group-title">
        {title}
      </h3>

      <div className="module-list">
        {modules.map((module) => (
          <a
            key={module.code}
            href={module.href}
            className="module"
            aria-label={`Abrir ${module.title}`}
          >
            <span
              className="module-icon"
              style={{
                color: module.color,
                backgroundColor:
                  `${module.color}10`,
                borderColor:
                  `${module.color}20`,
              }}
            >
              {module.icon}
            </span>

            <span className="module-content">
              <span className="module-title">
                {module.title}
              </span>

              <span className="module-description">
                {module.description}
              </span>
            </span>

            <span
              className="module-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}