"use client";

const STEPS = [
  "Información",
  "Ubicación",
  "Branding",
  "Plan",
  "Agreement",
  "Firma",
  "Finalizar",
];

interface Props {
  currentStep: number;
}

export default function NewRestaurantProgress({
  currentStep,
}: Props) {
  return (
    <section className="progress" aria-label="Progreso de creación">
      <div className="mobile-progress-summary">
        <div className="mobile-step-count">
          Paso <strong>{currentStep}</strong> de {STEPS.length}
        </div>

        <div className="mobile-step-name">
          {STEPS[currentStep - 1] ?? STEPS[0]}
        </div>
      </div>

      <div className="desktop-progress">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const active = currentStep === number;
          const completed = currentStep > number;

          return (
            <div className="progress-item" key={step}>
              <div className="progress-node-wrap">
                <div
                  className={[
                    "progress-node",
                    active ? "active" : "",
                    completed ? "completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={active ? "step" : undefined}
                >
                  {completed ? "✓" : number}
                </div>

                <span
                  className={[
                    "progress-label",
                    active ? "active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {step}
                </span>
              </div>

              {index !== STEPS.length - 1 && (
                <div
                  className={[
                    "progress-line",
                    completed ? "completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mobile-progress-bar" aria-hidden="true">
        <div
          className="mobile-progress-fill"
          style={{
            width: `${(currentStep / STEPS.length) * 100}%`,
          }}
        />
      </div>

      <style jsx>{`
        .progress {
          width: 100%;
          margin-bottom: 28px;
        }

        .desktop-progress {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 0;
          overflow: hidden;
        }

        .progress-item {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: flex-start;
        }

        .progress-node-wrap {
          min-width: 0;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .progress-node {
          width: 40px;
          height: 40px;
          box-sizing: border-box;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          background: #191919;
          color: #777;
          font-size: 12px;
          font-weight: 850;
          line-height: 1;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            color 0.2s ease;
        }

        .progress-node.active {
          border: 2px solid rgba(249, 115, 22, 0.35);
          background: #f97316;
          color: #fff;
          box-shadow: 0 0 22px rgba(249, 115, 22, 0.18);
        }

        .progress-node.completed {
          border-color: rgba(34, 197, 94, 0.35);
          background: #22c55e;
          color: #fff;
        }

        .progress-label {
          max-width: 86px;
          margin-top: 8px;
          overflow: hidden;
          color: #777;
          font-size: 9px;
          line-height: 1.2;
          font-weight: 600;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .progress-label.active {
          color: #fff;
          font-weight: 800;
        }

        .progress-line {
          height: 2px;
          min-width: 8px;
          flex: 1;
          margin: 19px 7px 0;
          border-radius: 999px;
          background: #272727;
          transition: background 0.2s ease;
        }

        .progress-line.completed {
          background: #22c55e;
        }

        .mobile-progress-summary,
        .mobile-progress-bar {
          display: none;
        }

        @media (max-width: 820px) {
          .progress {
            margin-bottom: 18px;
          }

          .desktop-progress {
            display: none;
          }

          .mobile-progress-summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 8px;
          }

          .mobile-step-count {
            flex: 0 0 auto;
            color: rgba(255, 255, 255, 0.38);
            font-size: 9px;
            line-height: 1.2;
            font-weight: 700;
          }

          .mobile-step-count strong {
            color: #f97316;
            font-size: 11px;
          }

          .mobile-step-name {
            min-width: 0;
            overflow: hidden;
            color: rgba(255, 255, 255, 0.78);
            font-size: 10px;
            line-height: 1.2;
            font-weight: 800;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobile-progress-bar {
            display: block;
            width: 100%;
            height: 4px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.07);
          }

          .mobile-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #f97316, #fb923c);
            transition: width 0.25s ease;
          }
        }

        @media (max-width: 420px) {
          .progress {
            margin-bottom: 14px;
          }

          .mobile-step-count {
            font-size: 8px;
          }

          .mobile-step-count strong {
            font-size: 10px;
          }

          .mobile-step-name {
            font-size: 9px;
          }

          .mobile-progress-bar {
            height: 3px;
          }
        }
      `}</style>
    </section>
  );
}