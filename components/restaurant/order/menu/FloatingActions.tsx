"use client";

interface Props {
  cartCount: number;
  onMap: () => void;
  onCart: () => void;
}

export default function FloatingActions({
  cartCount,
  onMap,
  onCart,
}: Props) {
  return (
<div
  style={{
    position: "fixed",
    right: 18,
    bottom: 90,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    zIndex: 9999,
  }}
>
  <button
    onClick={onMap}
    style={{
      width: 58,
      height: 58,
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,.08)",
      background: "rgba(18,18,18,.92)",
      backdropFilter: "blur(20px)",
      color: "#fff",
      fontSize: 24,
      cursor: "pointer",
      boxShadow: "0 12px 30px rgba(0,0,0,.35)",
      transition: ".25s",
    }}
  >
    📍
  </button>

  <button
    onClick={onCart}
    style={{
      position: "relative",
      width: 64,
      height: 64,
      borderRadius: 20,
      border: "none",
      background:
        "linear-gradient(180deg,#ff8a1d,#f97316)",
      color: "#fff",
      fontSize: 26,
      cursor: "pointer",
      boxShadow:
        "0 15px 35px rgba(249,115,22,.45)",
      transition: ".25s",
    }}
  >
    🛒

    {cartCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: -5,
          right: -5,
          minWidth: 22,
          height: 22,
          borderRadius: 999,
          background: "#ef4444",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #111",
        }}
      >
        {cartCount}
      </span>
    )}
  </button>
</div>
  );
}


