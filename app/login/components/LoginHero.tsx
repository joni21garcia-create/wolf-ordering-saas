"use client";

import Image from "next/image";

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
            opacity: .25;
            transform: scale(.9);

            box-shadow:
              0 0 6px #ff7b00,
              0 0 14px #ff7b00,
              0 0 22px rgba(255,120,0,.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.3);

            box-shadow:
              0 0 12px #ffae42,
              0 0 30px #ff8c00,
              0 0 55px rgba(255,140,0,1);
          }
        }

        @keyframes shine {
          from {
            transform: translateX(-220px) skewX(-25deg);
          }

          to {
            transform: translateX(420px) skewX(-25deg);
          }
        }

        @media (max-width: 900px) {
          .hero {
            padding: 32px 24px !important;
          }

          .logo {
            max-width: 250px !important;
          }

          .hero-title {
            font-size: 28px !important;
          }

          .hero-subtitle {
            font-size: 15px !important;
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
          padding: 48,
        }}
      >
        {/* Halo */}

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
            maxWidth: 560,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* LOGO */}

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 320,
              marginBottom: 34,
              animation: "floatLogo 5s ease-in-out infinite",
            }}
          >
            <Image
              src="/wolfloginv2.png"
              alt="Wolf Ordering"
              width={320}
              height={130}
              priority
              className="logo"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            {/* Shine */}

            <div
              style={{
                position: "absolute",
                top: 0,
                left: -150,
                width: 80,
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)",
                animation: "shine 5s linear infinite",
              }}
            />

            {/* Eye Left */}

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

            {/* Eye Right */}

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
      </section>
    </>
  );
}