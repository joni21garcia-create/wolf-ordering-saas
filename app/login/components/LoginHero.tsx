"use client";

import Image from "next/image";

const features = [
  {
    icon: "🛒",
    title: "Pedidos Online",
    text: "Recibe pedidos desde tu propia página web sin pagar comisiones.",
  },
  {
    icon: "⚡",
    title: "Tiempo Real",
    text: "Los pedidos aparecen al instante en cocina, caja y administración.",
  },
  {
    icon: "🔔",
    title: "Notificaciones",
    text: "Clientes y personal reciben avisos automáticos en tiempo real.",
  },
  {
    icon: "🌐",
    title: "Web Propia",
    text: "Obtén una web profesional con tu dominio y menú digital.",
  },
  {
    icon: "💳",
    title: "Pagos",
    text: "Acepta efectivo, tarjetas y transferencias desde una sola plataforma.",
  },
  {
    icon: "📊",
    title: "Reportes",
    text: "Analiza ventas, productos y rendimiento de tu restaurante.",
  },
  {
    icon: "🚚",
    title: "Delivery",
    text: "Controla repartidores y pedidos en ruta desde un solo lugar.",
  },
  {
    icon: "🍔",
    title: "Menú Digital",
    text: "Actualiza productos y precios en segundos.",
  },
];

export default function LoginHero() {
  return (
    <>
      <style jsx>{`
        @keyframes floatLogo {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes eyeGlow {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.9);

            box-shadow:
              0 0 6px #ff7b00,
              0 0 14px #ff7b00,
              0 0 22px rgba(255, 120, 0, 0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.3);

            box-shadow:
              0 0 12px #ffae42,
              0 0 30px #ff8c00,
              0 0 55px rgba(255, 140, 0, 1);
          }
        }

        @keyframes shine {
          from {
            transform: translateX(-220px);
          }

          to {
            transform: translateX(420px);
          }
        }

        .cards::-webkit-scrollbar {
          height: 8px;
        }

        .cards::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.5);
          border-radius: 999px;
        }

        .card {
          transition: all .25s ease;
        }

        .card:hover {
          transform: translateY(-8px);
          border-color: rgba(249,115,22,.7);
          background: rgba(255,255,255,.06);
        }

        @media (max-width: 900px) {
          .hero {
            padding: 24px;
          }

          .logo {
            max-width: 240px !important;
          }

          .cards {
            gap: 14px !important;
          }

          .feature {
            flex: 0 0 220px !important;
          }
        }
      `}</style>

      <section
        className="hero"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: 40,
        }}
      >
        {/* Glow */}

        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,.18), transparent 70%)",
            filter: "blur(90px)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 650,
          }}
        >
          {/* LOGO */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 35,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 330,
                animation: "floatLogo 5s ease-in-out infinite",
              }}
            >
              <Image
                src="/wolfloginv2.png"
                alt="Wolf Ordering"
                width={330}
                height={130}
                priority
                className="logo"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />

              {/* Destello */}

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: -150,
                  width: 80,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)",
                  transform: "skewX(-25deg)",
                  animation: "shine 5s linear infinite",
                }}
              />

              {/* OJO IZQUIERDO */}

              <span
                style={{
                  position: "absolute",
                  left: 54,
                  top: 36,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ff8c00",
                  animation: "eyeGlow 1.8s infinite",
                }}
              />

              {/* OJO DERECHO */}

              <span
                style={{
                  position: "absolute",
                  left: 85,
                  top: 36,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ff8c00",
                  animation: "eyeGlow 1.8s infinite .2s",
                }}
              />
            </div>
          </div>

          {/* Cards */}

          <div
            className="cards"
            style={{
              display: "flex",
              gap: 18,
              overflowX: "auto",
              scrollBehavior: "smooth",
              paddingBottom: 15,
            }}
          >
            {features.map((item) => (
              <div
                key={item.title}
                className="card feature"
                style={{
                  flex: "0 0 250px",
                  borderRadius: 22,
                  padding: 24,
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(249,115,22,.25)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  style={{
                    fontSize: 38,
                    marginBottom: 18,
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: "#9ca3af",
                    lineHeight: 1.7,
                    fontSize: 15,
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              color: "#f97316",
              fontWeight: 700,
              letterSpacing: 1.5,
              fontSize: 13,
            }}
          >
            ← Desliza para descubrir todas las funciones →
          </div>
        </div>
      </section>
    </>
  );
}


