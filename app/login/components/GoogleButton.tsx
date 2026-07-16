"use client";

interface GoogleButtonProps {
  onClick: () => void;
}

export default function GoogleButton({
  onClick,
}: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        height: "58px",
        marginTop: "18px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,.08)",
        background: "rgba(255,255,255,.03)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: 600,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",

        transition: ".25s",
      }}
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        width={20}
        height={20}
      />

      Continuar con Google
    </button>
  );
}