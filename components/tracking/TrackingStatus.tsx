/*
==========================================================

Wolf Ordering

Tracking Status

==========================================================
*/

import {
  getTrackingSteps,
} from "./trackingSteps";

interface TrackingStatusProps {
  order: any;
}

/*
==========================================================
ESTADOS
==========================================================
*/

const STATUS = {

  pending: {

    title: "🛎️ Pedido recibido",

    message:
      "El restaurante recibió tu pedido y pronto comenzará a prepararlo.",

    color: "#f59e0b",

    background: "#f59e0b22",

  },

  accepted: {

    title: "👨‍🍳 Pedido aceptado",

    message:
      "El restaurante confirmó tu pedido y comenzará a prepararlo.",

    color: "#3b82f6",

    background: "#3b82f622",

  },

  preparing: {

    title: "🍳 En preparación",

    message:
      "Nuestro equipo está preparando tu pedido.",

    color: "#8b5cf6",

    background: "#8b5cf622",

  },

  ready: {

    title: "📦 Pedido listo",

    message:
      "Tu pedido está listo para salir del restaurante.",

    color: "#22c55e",

    background: "#22c55e22",

  },

  out_for_delivery: {

    title: "🛵 En camino",

    message:
      "Tu pedido salió del restaurante y va rumbo a ti.",

    color: "#06b6d4",

    background: "#06b6d422",

  },

  completed: {

    title: "🎉 Pedido entregado",

    message:
      "¡Gracias por ordenar con Wolf Ordering!",

    color: "#16a34a",

    background: "#16a34a22",

  },

  cancelled: {

    title: "❌ Pedido cancelado",

    message:
      "Este pedido fue cancelado.",

    color: "#ef4444",

    background: "#ef444422",

  },

} as const;

/*
==========================================================
PASOS
==========================================================
*/



function formatTime(
  value?: string | null
) {

  if (!value) {
    return "—";
  }

  return new Date(value)
    .toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

}

/*
==========================================================
COMPONENTE
==========================================================
*/

export default function TrackingStatus({
  order,
}: TrackingStatusProps) {

  const steps =
    getTrackingSteps(
      order.order_type
    );

  const currentStep =
    steps.findIndex(
      (step) => step.key === order.status
    );

  const current =
    STATUS[
      order.status as keyof typeof STATUS
    ] ??
    STATUS.pending;

  const times = {
  pending:
    formatTime(order.created_at),

  accepted:
    formatTime(order.accepted_at),

  preparing:
    formatTime(order.preparing_at),

  ready:
    formatTime(order.ready_at),

  out_for_delivery:
    formatTime(
      order.out_for_delivery_at
    ),

  completed:
    formatTime(order.completed_at),

};


    return (

    <>
      <style>{`

        @media (max-width:768px){

          .tracking-status{

            padding:22px !important;

            border-radius:20px !important;

          }

          .tracking-step{

            width:40px !important;
            height:40px !important;

            font-size:18px !important;

          }

          .tracking-line{

            margin:0 4px !important;

          }

          .tracking-label{

            font-size:10px !important;

          }

        }

      `}</style>

      <section

        className="tracking-status"

        style={{

          background:
            "linear-gradient(180deg,#171717,#101010)",

          borderRadius:24,

          padding:28,

          border:
            "1px solid rgba(255,255,255,.06)",

          boxShadow:
            "0 18px 40px rgba(0,0,0,.35)",

          overflow:"hidden",

        }}

      >

        {/* Estado */}

        <div

          style={{

            display:"flex",

            justifyContent:"center",

          }}

        >

          <div

            style={{

              padding:"12px 24px",

              borderRadius:999,

              background:
                current.background,

              color:
                current.color,

              fontWeight:800,

              fontSize:18,

            }}

          >

            {current.title}

          </div>

        </div>

        {/* Mensaje */}

        <p

          style={{

            margin:"22px auto 34px",

            maxWidth:520,

            textAlign:"center",

            color:"#d1d5db",

            fontSize:15,

            lineHeight:1.7,

          }}

        >

          {current.message}

        </p>

        {/* Barra */}

        <div

          style={{

            display:"flex",

            alignItems:"center",

            justifyContent:"space-between",

            gap:2,

          }}

        >
                  {steps.map((step, index) => {

            const active =
              order.status !== "cancelled" &&
              index <= currentStep;

            return (

              <div
                key={step.key}
                style={{
                  display:"flex",
                  alignItems:"center",
                  flex:1,
                  minWidth:0,
                }}
              >

                {/* Icono */}

                <div

                  className="tracking-step"

                  style={{

                    width:44,

                    height:44,

                    flexShrink:0,

                    borderRadius:"50%",

                    display:"flex",

                    justifyContent:"center",

                    alignItems:"center",

                    fontSize:20,

                    background:

                      order.status === "cancelled"

                        ? "#dc2626"

                        : active

                        ? "linear-gradient(180deg,#fb923c,#ea580c)"

                        : "#303030",

                    border:

                      active

                        ? "2px solid #fb923c"

                        : "2px solid #4b4b4b",

                    boxShadow:

                      active

                        ? "0 0 10px rgba(249,115,22,.28)"

                        : "none",

                    transition:
                      ".25s",

                  }}

                >

                  {step.icon}

                </div>

                {/* Línea */}

                {index < steps.length - 1 && (

                  <div

                    className="tracking-line"

                    style={{

                      flex:1,

                      minWidth:8,

                      height:3,

                      margin:"0 5px",

                      borderRadius:999,

                      background:

                        order.status === "cancelled"

                          ? "#dc2626"

                          : index < currentStep

                          ? "linear-gradient(90deg,#fb923c,#ea580c)"

                          : "#3b3b3b",

                      transition:
                        ".25s",

                    }}

                  />

                )}

              </div>

            );

          })}

        </div>

        {/* Etiquetas */}

        <div

          style={{

            display:"flex",

            justifyContent:"space-between",

            marginTop:14,

          }}

        >

          {steps.map((step,index)=>(

<div

  key={step.key}

  className="tracking-label"

  style={{

    flex:1,

    textAlign:"center",

  }}

>

  <div

    style={{

      fontSize:11,

      fontWeight:700,

      color:

        order.status !== "cancelled" &&
        index <= currentStep

          ? "#fff"

          : "#7a7a7a",

    }}

  >

    {step.short}

  </div>

  <div

    style={{

      marginTop:4,

      fontSize:10,

      fontWeight:500,

      color:

        order.status !== "cancelled" &&
        index <= currentStep

          ? "#bdbdbd"

          : "#5f5f5f",

      fontFamily:
        "JetBrains Mono, monospace",

    }}

  >

    {

      times[
        step.key as keyof typeof times
      ]

    }

  </div>

</div>

          ))}

        </div>
                {/* Pedido entregado */}

        {order.status === "completed" && (

          <div
            style={{
              marginTop: 28,

              padding: "16px 20px",

              borderRadius: 18,

              background: "#16a34a22",

              border:
                "1px solid #16a34a55",

              color: "#22c55e",

              textAlign: "center",

              fontWeight: 700,

              fontSize: 15,
            }}
          >
            🎉 ¡Tu pedido fue entregado!

            <div
              style={{
                marginTop: 8,
                fontWeight: 500,
                color: "#d1fae5",
                fontSize: 14,
              }}
            >
              Gracias por elegir Wolf Ordering.
            </div>
          </div>

        )}

        {/* Pedido cancelado */}

        {order.status === "cancelled" && (

          <div
            style={{
              marginTop: 28,

              padding: "16px 20px",

              borderRadius: 18,

              background: "#dc262622",

              border:
                "1px solid #dc262655",

              color: "#ef4444",

              textAlign: "center",

              fontWeight: 700,

              fontSize: 15,
            }}
          >
            ❌ Este pedido fue cancelado.
          </div>

        )}

      </section>

    </>

  );

}
