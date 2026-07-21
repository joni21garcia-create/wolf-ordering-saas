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
  const first =
    currentStep === 1;

  const last =
    currentStep === totalSteps;

  return (
    <footer
      style={{
        marginTop: 40,
        paddingTop: 30,
        borderTop:
          "1px solid rgba(255,255,255,.08)",

        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      {/* ============================
          IZQUIERDA
      ============================ */}

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="secondary"
          disabled={first}
          onClick={onPrevious}
        >
          ← Anterior
        </Button>

<Button
  variant="ghost"
  onClick={onSaveDraft}
>
  💾 Guardar borrador
</Button>
      </div>

      {/* ============================
          CENTRO
      ============================ */}

      <div
        style={{
          color: "#777",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        Paso{" "}
        <strong
          style={{
            color: "#fff",
          }}
        >
          {currentStep}
        </strong>{" "}
        de{" "}
        <strong
          style={{
            color: "#fff",
          }}
        >
          {totalSteps}
        </strong>
      </div>

      {/* ============================
          DERECHA
      ============================ */}

      <div>
        {last ? (
          <Button
            variant="success"
            disabled={saving}
            onClick={onFinish}
          >
            {saving
              ? "Creando restaurante..."
              : "🚀 Finalizar y Crear Restaurante"}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onNext}
          >
            Siguiente →
          </Button>
        )}
      </div>
    </footer>
  );
}

interface ButtonProps {
  children: React.ReactNode;

  onClick?: () => void;

  disabled?: boolean;

  variant:
    | "primary"
    | "secondary"
    | "ghost"
    | "success";
}

function Button({
  children,
  onClick,
  disabled = false,
  variant,
}: ButtonProps) {
  const backgrounds = {
    primary:
      "linear-gradient(135deg,#f97316,#ea580c)",

    secondary:
      "#1f1f1f",

    ghost:
      "transparent",

    success:
      "linear-gradient(135deg,#22c55e,#15803d)",
  };

  const borders = {
    primary: "none",

    secondary:
      "1px solid rgba(255,255,255,.08)",

    ghost:
      "1px solid rgba(255,255,255,.08)",

    success: "none",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border:
          borders[variant],

        background:
          backgrounds[variant],

        color: "#fff",

        padding:
          "14px 24px",

        borderRadius: 16,

        fontWeight: 700,

        fontSize: 15,

        minWidth: 170,

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity:
          disabled ? 0.5 : 1,

        transition:
          "all .25s ease",
      }}
    >
      {children}
    </button>
  );
}


