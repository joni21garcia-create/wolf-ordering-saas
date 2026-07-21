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
    <section
      style={{
        marginBottom: 42,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 10,
        }}
      >
        {STEPS.map((step, index) => {
          const number = index + 1;

          const active =
            currentStep === number;

          const completed =
            currentStep > number;

          return (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 120,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 18,
                    transition: ".25s",

                    background: completed
                      ? "#22c55e"
                      : active
                      ? "#f97316"
                      : "#1f1f1f",

                    color: "#fff",

                    border: active
                      ? "3px solid rgba(249,115,22,.35)"
                      : "1px solid rgba(255,255,255,.08)",

                    boxShadow: active
                      ? "0 0 30px rgba(249,115,22,.25)"
                      : "none",
                  }}
                >
                  {completed ? "✓" : number}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    color: active
                      ? "#fff"
                      : "#8b8b8b",
                    fontWeight: active
                      ? 700
                      : 500,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {step}
                </div>
              </div>

              {index !==
                STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    margin: "0 10px",
                    borderRadius: 999,
                    background:
                      completed
                        ? "#22c55e"
                        : "#2b2b2b",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}


