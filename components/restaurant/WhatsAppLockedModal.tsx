"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  primaryColor: string;
  orderUrl: string;
}

export default function WhatsAppLockedModal({
  open,
  onClose,
  primaryColor,
  orderUrl,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            padding: "24px",

            zIndex: 999999,

            background:
              "linear-gradient(rgba(0,0,0,.82),rgba(0,0,0,.82))",

            backdropFilter: "blur(16px)",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: .94,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: .94,
              y: 40,
            }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 220,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "450px",

              overflow: "hidden",

              borderRadius: "34px",

              background:
                "linear-gradient(180deg,#171717 0%,#101010 100%)",

              border: `1px solid ${primaryColor}30`,

              boxShadow: `
              0 50px 120px rgba(0,0,0,.60),
              0 0 80px ${primaryColor}18
              `,
            }}
          >
            {/* Glow */}

            <div
              style={{
                position: "absolute",
                width: "260px",
                height: "260px",
                background: primaryColor,
                opacity: .08,
                filter: "blur(90px)",
                borderRadius: "50%",
                top: "-80px",
                right: "-80px",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                padding: "30px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Badge */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    padding: "8px 18px",

                    borderRadius: "999px",

                    background: `${primaryColor}15`,

                    border: `1px solid ${primaryColor}40`,

                    color: primaryColor,

                    fontWeight: 700,

                    letterSpacing: ".08em",

                    fontSize: "12px",
                  }}
                >
                  ACCESO EXCLUSIVO
                </div>
              </div>

              {/* Icon */}

              <div
                style={{
                  width: "72px",
                  height: "72px",

                  margin: "0 auto 28px",

                  borderRadius: "50%",

                  background: `${primaryColor}15`,

                  border: `1px solid ${primaryColor}30`,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  fontSize: "34px",

                  boxShadow: `0 0 45px ${primaryColor}20`,
                }}
              >
                💬
              </div>

              <h2
                style={{
                  color: "#fff",

                  textAlign: "center",

                  fontSize: "32px",

                  fontWeight: 800,

                  marginBottom: "4px",

                  lineHeight: 1.2,
                }}
              >
                
                <br />
               
              </h2>

              <p
                style={{
                  textAlign: "center",

                  color: "rgba(255,255,255,.72)",

                  lineHeight: 1.9,

                  fontSize: "16px",

                  marginBottom: "34px",
                }}
              >
                Realiza tu primer pedido y podrás
                comunicarte por WhatsApp con el
                restaurante.
              </p>

              {/* Beneficios */}

              <div
                style={{
                  background: "rgba(255,255,255,.04)",

                  borderRadius: "22px",

                  padding: "10px",

                  border:
                    "1px solid rgba(255,255,255,.06)",

                  marginBottom: "10px",
                }}
              >
                {[
                  {
                    title: "Seguimiento del pedido",
                    desc: "Recibe ayuda durante la preparación y entrega.",
                  },

                  {
                    title: "Chat directo",
                    desc: "Sin intermediarios, directamente con el restaurante.",
                  },

                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",

                      gap: "16px",

                      alignItems: "flex-start",

                      marginBottom:
                        item.title ===
                        "Acceso permanente"
                          ? 0
                          : 20,
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",

                        borderRadius: "50%",

                        background:
                          `${primaryColor}18`,

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        color: primaryColor,

                        fontWeight: 700,

                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>

                    <div>
                      <div
                        style={{
                          color: "#fff",

                          fontWeight: 700,

                          marginBottom: "4px",
                        }}
                      >
                        {item.title}
                      </div>

                      <div
                        style={{
                          color:
                            "rgba(255,255,255,.58)",

                          lineHeight: 1.6,

                          fontSize: "14px",
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones */}

              <button
                onClick={() => {
                  window.location.href = orderUrl;
                }}
                style={{
                  width: "100%",

                  height: "54px",

                  border: "none",

                  cursor: "pointer",

                  borderRadius: "18px",

                  background: `linear-gradient(
                    135deg,
                    ${primaryColor},
                    ${primaryColor}
                  )`,

                  color: "#fff",

                  fontSize: "17px",

                  fontWeight: 700,

                  boxShadow:
                    `0 18px 40px ${primaryColor}35`,
                }}
              >
                🛒 Realizar mi primer pedido
              </button>

              <button
                onClick={onClose}
                style={{
                  marginTop: "14px",

                  width: "100%",

                  height: "56px",

                  background: "transparent",

                  border:
                    "1px solid rgba(255,255,255,.08)",

                  borderRadius: "18px",

                  cursor: "pointer",

                  color: "rgba(255,255,255,.70)",

                  fontWeight: 600,

                  fontSize: "15px",
                }}
              >
                Ahora no
              </button>

              <p
                style={{
                  textAlign: "center",

                  marginTop: "22px",

                  color: "rgba(255,255,255,.40)",

                  fontSize: "13px",

                  lineHeight: 1.8,
                }}
              >
                Se desbloquea automáticamente con tu primer pedido.
                
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}