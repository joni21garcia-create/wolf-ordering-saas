"use client";

import Image from "next/image";

export function LoginLogo() {
  return (
    <>
      <style>
        {`
          @keyframes wolfFloat {
            0% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.02);
            }
            100% {
              transform: translateY(0px) scale(1);
            }
          }

          @keyframes wolfGlow {
            0% {
              opacity: .6;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: .6;
            }
          }
        `}
      </style>

      <div
        style={{
          textAlign: "center",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "220px",
            height: "220px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation:
              "wolfFloat 5s ease-in-out infinite",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(249,115,22,.30), transparent 70%)",
              filter: "blur(25px)",
              animation:
                "wolfGlow 4s ease-in-out infinite",
            }}
          />

          <Image
            src="/wolfloginv2.png"
            alt="Wolf Ordering"
            width={220}
            height={220}
            priority
            style={{
              width: "100%",
              height: "auto",
              position: "relative",
              zIndex: 2,
            }}
          />
        </div>

        <p
          style={{
            color: "#f97316",
            marginTop: "8px",
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "8px",
            textTransform: "uppercase",
          }}
        >
          Wolf Ordering OS
        </p>

        <h2
          style={{
            color: "#fff",
            marginTop: "18px",
            marginBottom: "8px",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          Bienvenido nuevamente
        </h2>

        <p
          style={{
            color: "#888",
            maxWidth: "320px",
            margin: "0 auto",
            lineHeight: 1.6,
            fontSize: "14px",
          }}
        >
          Accede al sistema operativo de
          restaurantes Wolf Ordering.
        </p>
      </div>
    </>
  );
}