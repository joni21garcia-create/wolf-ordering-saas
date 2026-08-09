"use client";

interface LoginBackgroundProps {
  children: React.ReactNode;
}

export default function LoginBackground({
  children,
}: LoginBackgroundProps) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#050505",
          overflow: "hidden",
          zIndex: -20,
        }}
      />

      {/* Glow superior */}
      <div
        style={{
          position: "fixed",
          top: "-25vh",
          right: "-12vw",
          width: "60vw",
          height: "60vw",
          maxWidth: 900,
          maxHeight: 900,
          minWidth: 420,
          minHeight: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,.16), transparent 68%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: -19,
        }}
      />

      {/* Glow inferior */}
      <div
        style={{
          position: "fixed",
          bottom: "-28vh",
          left: "-15vw",
          width: "60vw",
          height: "60vw",
          maxWidth: 900,
          maxHeight: 900,
          minWidth: 420,
          minHeight: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,.09), transparent 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: -19,
        }}
      />

      {/* Grid muy discreta */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          zIndex: -18,
        }}
      />

      {/* Líneas Wolf */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.055,
          backgroundImage:
            "repeating-linear-gradient(-28deg, transparent 0px, transparent 72px, rgba(249,115,22,.20) 73px, transparent 74px)",
          zIndex: -17,
        }}
      />

      <main
        style={{
          width: "100%",
          minHeight: "100dvh",
          padding: 0,
          margin: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </>
  );
}