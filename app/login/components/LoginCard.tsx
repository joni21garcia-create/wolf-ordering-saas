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
          min-height: 100dvh;
          overflow: hidden;

          background:
            linear-gradient(
              90deg,
              rgba(7, 7, 7, 0.72),
              rgba(7, 7, 7, 0.90)
            );

          border: 0;
          border-radius: 0;

          box-shadow: none;
        }

        .login-content {
          position: relative;
          z-index: 2;

          width: 100%;
          min-height: 100dvh;

          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, 560px);

          align-items: stretch;

          gap: 0;
        }

        @media (max-width: 1000px) {
          .login-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .login-card {
            min-height: 100dvh;
          }

          .login-content {
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>

      <section className="login-card">
        {/* Glow central muy sutil */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,.10), transparent 68%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Línea superior */}
        <div
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(249,115,22,.65), transparent)",
            zIndex: 5,
          }}
        />

        <div className="login-content">
          {children}
        </div>
      </section>
    </>
  );
}