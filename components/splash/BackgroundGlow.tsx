"use client";

export default function BackgroundGlow() {
  return (
    <>
      {/* Fondo */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Halo principal */}
      <div
        className="
          absolute
          left-1/2
          top-[42%]
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[90px]
          animate-halo-breath
        "
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,.20) 0%, rgba(249,115,22,.10) 40%, transparent 75%)",
        }}
      />

      {/* Halo secundario */}
      <div
        className="
          absolute
          left-1/2
          top-[42%]
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[60px]
          animate-halo-breath-slow
        "
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,.12) 0%, transparent 70%)",
        }}
      />

      {/* Glow inferior */}
      <div
        className="
          absolute
          bottom-[-250px]
          left-1/2
          h-[500px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          blur-[120px]
        "
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,.10) 0%, transparent 75%)",
        }}
      />

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.70) 100%)",
        }}
      />
    </>
  );
}