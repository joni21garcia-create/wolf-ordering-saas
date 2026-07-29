"use client";

interface Props {
  active: boolean;
}

export default function EyeFlash({ active }: Props) {
  return (
    <div
      className={`
        pointer-events-none
        absolute
        inset-0
        transition-all
        duration-700
        ease-out
        ${
          active
            ? "opacity-100"
            : "opacity-0"
        }
      `}
    >
      {/* Pulso izquierdo */}
      <div
        className="
          absolute
          left-[84px]
          top-[102px]
          h-7
          w-10
          rounded-full
          animate-eye-pulse
        "
        style={{
          background:
            "radial-gradient(circle,#fff7d6 0%,#fb923c 35%,rgba(251,146,60,.18) 75%,transparent 100%)",
          filter: "blur(10px)",
          transform: "rotate(-12deg)",
        }}
      />

      {/* Pulso derecho */}
      <div
        className="
          absolute
          right-[84px]
          top-[102px]
          h-7
          w-10
          rounded-full
          animate-eye-pulse
        "
        style={{
          background:
            "radial-gradient(circle,#fff7d6 0%,#fb923c 35%,rgba(251,146,60,.18) 75%,transparent 100%)",
          filter: "blur(10px)",
          transform: "rotate(12deg)",
        }}
      />
    </div>
  );
}