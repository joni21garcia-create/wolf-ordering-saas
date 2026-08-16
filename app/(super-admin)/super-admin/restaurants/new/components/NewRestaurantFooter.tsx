"use client";

interface Props {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish?: () => void;
  onSaveDraft?: () => void;
  saving?: boolean;
}

export default function NewRestaurantFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onFinish,
  onSaveDraft,
  saving = false,
}: Props) {
  const first = currentStep === 1;
  const last = currentStep === totalSteps;

  return (
    <footer className="footer">
      <div className="footer-left">
        <Button
          variant="secondary"
          disabled={first}
          onClick={onPrevious}
        >
          <span aria-hidden="true">←</span>
          <span>Anterior</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onSaveDraft}
          disabled={saving}
        >
          <span aria-hidden="true">⌑</span>
          <span>Guardar borrador</span>
        </Button>
      </div>

      <div className="step-counter" aria-live="polite">
        Paso <strong>{currentStep}</strong> de{" "}
        <strong>{totalSteps}</strong>
      </div>

      <div className="footer-right">
        {last ? (
          <Button
            variant="success"
            disabled={saving}
            onClick={onFinish}
          >
            <span aria-hidden="true">✓</span>
            <span>
              {saving
                ? "Creando restaurante..."
                : "Finalizar y crear restaurante"}
            </span>
          </Button>
        ) : (
          <Button variant="primary" onClick={onNext}>
            <span>Siguiente</span>
            <span aria-hidden="true">→</span>
          </Button>
        )}
      </div>

      <style jsx>{`
        .footer {
          width: 100%;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          margin-top: 28px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.065);
        }

        .footer-left,
        .footer-right {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .footer-right {
          justify-content: flex-end;
        }

        .step-counter {
          color: rgba(255, 255, 255, 0.32);
          font-size: 8px;
          line-height: 1;
          font-weight: 650;
          white-space: nowrap;
        }

        .step-counter strong {
          color: rgba(255, 255, 255, 0.75);
          font-weight: 850;
        }

        @media (max-width: 820px) {
          .footer {
            position: sticky;
            bottom: 0;
            z-index: 20;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
            gap: 7px;
            margin-top: 18px;
            padding: 9px 0 calc(8px + env(safe-area-inset-bottom));
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            background: linear-gradient(
              180deg,
              rgba(16, 16, 16, 0.84),
              rgba(16, 16, 16, 0.98)
            );
            backdrop-filter: blur(14px);
          }

          .footer-left {
            min-width: 0;
          }

          .footer-left > :global(button) {
            flex: 1;
          }

          .footer-left > :global(button:nth-child(2)) {
            display: none;
          }

          .step-counter {
            position: absolute;
            top: -13px;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 7px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 999px;
            background: #111;
            font-size: 6px;
          }

          .footer-right {
            min-width: 0;
          }

          .footer-right > :global(button) {
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .footer {
            grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
            gap: 6px;
            margin-left: -2px;
            margin-right: -2px;
            width: calc(100% + 4px);
          }
        }

        @media (max-width: 390px) {
          .footer {
            grid-template-columns: minmax(0, 0.68fr) minmax(0, 1.32fr);
          }
        }
      `}</style>
    </footer>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant: "primary" | "secondary" | "ghost" | "success";
}

function Button({
  children,
  onClick,
  disabled = false,
  variant,
}: ButtonProps) {
  const backgrounds = {
    primary: "linear-gradient(135deg,#f97316,#ea580c)",
    secondary: "#191919",
    ghost: "transparent",
    success: "linear-gradient(135deg,#22c55e,#15803d)",
  };

  const borders = {
    primary: "none",
    secondary: "1px solid rgba(255,255,255,.07)",
    ghost: "1px solid rgba(255,255,255,.07)",
    success: "none",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant}`}
      style={{
        border: borders[variant],
        background: backgrounds[variant],
      }}
    >
      {children}

      <style jsx>{`
        .button {
          min-width: 112px;
          min-height: 38px;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 13px;
          border-radius: 10px;
          color: #fff;
          font-size: 8px;
          line-height: 1;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            opacity 0.15s ease,
            filter 0.15s ease;
        }

        .button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .button:active:not(:disabled) {
          transform: translateY(0);
        }

        .button:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .button-ghost {
          color: rgba(255, 255, 255, 0.45);
        }

        .button-secondary {
          color: rgba(255, 255, 255, 0.62);
        }

        .button-success {
          min-width: 190px;
        }

        @media (max-width: 820px) {
          .button {
            width: 100%;
            min-width: 0;
            min-height: 40px;
            padding-inline: 9px;
            border-radius: 9px;
            font-size: 8px;
          }

          .button-success {
            min-width: 0;
          }
        }

        @media (max-width: 520px) {
          .button {
            min-height: 42px;
            font-size: 7.5px;
          }
        }

        @media (max-width: 390px) {
          .button {
            min-height: 40px;
            font-size: 7px;
          }
        }
      `}</style>
    </button>
  );
}