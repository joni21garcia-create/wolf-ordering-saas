/*
==========================================================

Wolf Ordering

Tracking Status

==========================================================
*/

interface TrackingStatusProps {
  status: string;
}

const STATUS = {
  pending: {
    label: "⏳ Pendiente",
    color: "#f97316",
    background: "#f9731622",
  },

  accepted: {
    label: "✅ Aceptado",
    color: "#f97316",
    background: "#f9731622",
  },

  preparing: {
    label: "👨‍🍳 Preparando",
    color: "#f97316",
    background: "#f9731622",
  },

  ready: {
    label: "📦 Listo para entregar",
    color: "#f97316",
    background: "#f9731622",
  },

  out_for_delivery: {
    label: "🛵 En camino",
    color: "#2563eb",
    background: "#2563eb22",
  },

  completed: {
    label: "🎉 Entregado",
    color: "#16a34a",
    background: "#16a34a22",
  },

  cancelled: {
    label: "❌ Cancelado",
    color: "#dc2626",
    background: "#dc262622",
  },
};

const STEPS = [
  {
    key: "pending",
    label: "Recibido",
  },
  {
    key: "accepted",
    label: "Aceptado",
  },
  {
    key: "preparing",
    label: "Preparando",
  },
  {
    key: "ready",
    label: "Listo",
  },
  {
    key: "out_for_delivery",
    label: "En camino",
  },
  {
    key: "completed",
    label: "Entregado",
  },
];

export default function TrackingStatus({
  status,
}: TrackingStatusProps) {

  const currentStep =
    STEPS.findIndex(
      (step) => step.key === status
    );

  const current =
    STATUS[
      status as keyof typeof STATUS
    ] ??
    STATUS.pending;

  return (
    <>
      {/* Estado */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            padding: "12px 22px",
            borderRadius: "999px",
            background:
              current.background,
            color:
              current.color,
            fontWeight: "700",
          }}
        >
          {current.label}
        </div>
      </div>

      {/* Aviso */}

      {status === "pending" && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#f97316",
            fontWeight: "600",
          }}
        >
          ⏳ El restaurante aún no ha aceptado tu
          pedido.
        </div>
      )}

      {/* Progreso */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        {STEPS.map((step, index) => (

          <div
            key={step.key}
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                margin: "0 auto 10px",
                background:
                  status === "cancelled"
                    ? index <= currentStep
                      ? "#dc2626"
                      : "#333"
                    : index <= currentStep
                    ? "#f97316"
                    : "#333",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </div>

            <span
              style={{
                color: "#ddd",
                fontSize: "14px",
              }}
            >
              {step.label}
            </span>

          </div>

        ))}
      </div>
    </>
  );

}