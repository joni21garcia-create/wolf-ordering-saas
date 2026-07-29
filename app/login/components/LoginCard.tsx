"use client";

interface LoginCardProps {
  children: React.ReactNode;
}

export default function LoginCard({
  children,
}: LoginCardProps) {
  return (
    <>
      <style jsx>{`
        .login-card {
          position: relative;
          width: 100%;
          max-width: 1280px;
          border-radius: 34px;
          overflow: hidden;

          background: linear-gradient(
            180deg,
            rgba(12,12,12,.96),
            rgba(8,8,8,.98)
          );

          border: 1px solid rgba(255,255,255,.06);

          backdrop-filter: blur(30px);

          box-shadow:
            0 40px 90px rgba(0,0,0,.65),
            inset 0 1px 0 rgba(255,255,255,.05);
        }

        .login-content {
          position: relative;
          z-index: 2;

          display: grid;

          /* Más espacio para el formulario */
          grid-template-columns: minmax(0,1fr) 620px;

          align-items: center;

          gap: 20px;

          min-height: 700px;
        }

        @media (max-width:1100px) {
          .login-content {
            grid-template-columns: 1fr;
            min-height: auto;
          }
        }

        @media (max-width:768px) {
          .login-card {
            border-radius: 22px;
            margin: 12px;
          }

          .login-content {
            min-height: auto;
            gap: 0;
          }
        }
      `}</style>

      <section className="login-card">
        {/* Glow */}

        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,.18), transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        {/* Línea superior */}

        <div
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #f97316, transparent)",
          }}
        />

        <div className="login-content">{children}</div>
      </section>
    </>
  );
}