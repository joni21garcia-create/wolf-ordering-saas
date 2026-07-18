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
        position: "sticky",
        top: 12,
        zIndex: 500,
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <button
        onClick={onMap}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "#202020",
          color: "#fff",
          fontSize: 22,
          boxShadow: "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        📍
      </button>

      <button
        onClick={onCart}
        style={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "#f97316",
          color: "#fff",
          fontSize: 22,
          boxShadow: "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        🛒

        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              right: -4,
              top: -4,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#fff",
              color: "#111",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}