"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function LoginBackground({
  children,
}: Props) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* Glow izquierdo */}
      <div
        style={{
          position: "absolute",
          left: "-250px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,.18), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Glow derecho */}
      <div
        style={{
          position: "absolute",
          right: "-250px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,.14), transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          pointerEvents: "none",
        }}
      />

      {/* Líneas diagonales */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(-15deg, transparent 0px, transparent 55px, rgba(249,115,22,.04) 56px, transparent 57px)",
          pointerEvents: "none",
        }}
      />

      {/* Partículas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(249,115,22,.7) 1px, transparent 2px),
            radial-gradient(circle at 80% 30%, rgba(249,115,22,.6) 1px, transparent 2px),
            radial-gradient(circle at 35% 75%, rgba(249,115,22,.6) 1px, transparent 2px),
            radial-gradient(circle at 70% 85%, rgba(249,115,22,.5) 1px, transparent 2px),
            radial-gradient(circle at 55% 50%, rgba(249,115,22,.7) 1px, transparent 2px)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <section
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "540px",
          padding: "40px 24px",
          borderRadius: "34px",
          background:
            "linear-gradient(180deg, rgba(10,10,10,.97), rgba(0,0,0,.98))",
          border:
            "1px solid rgba(255,255,255,.05)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        {children}
      </section>
    </main>
  );
}