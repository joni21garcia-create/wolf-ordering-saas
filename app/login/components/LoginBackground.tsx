"use client";

interface LoginBackgroundProps {
  children: React.ReactNode;
}

export default function LoginBackground({
  children,
}: LoginBackgroundProps) {
  return (
    <>
      {/* Fondo principal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#050505",
          overflow: "hidden",
          zIndex: -20,
        }}
      />

      {/* Glow superior derecho */}
      <div
        style={{
          position: "fixed",
          top: "-280px",
          right: "-220px",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,.18), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: -19,
        }}
      />

      {/* Glow inferior izquierdo */}
      <div
        style={{
          position: "fixed",
          bottom: "-320px",
          left: "-260px",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,.10), transparent 72%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: -19,
        }}
      />

      {/* Cuadrícula */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          zIndex: -18,
        }}
      />

      {/* Líneas diagonales */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(-28deg, transparent 0px, transparent 58px, rgba(249,115,22,.22) 60px, transparent 61px)",
          zIndex: -17,
        }}
      />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </>
  );
}


