"use client";

interface SaveButtonProps {
  loading: boolean;
  onClick: () => unknown;
}

export default function SaveButton({
  loading,
  onClick,
}: SaveButtonProps) {

console.log("SaveButton loading:", loading);

  return (
    <button
      type="button"
      onClick={() => {
    console.log("BOTÓN PRESIONADO");
    onClick();
  }}
  style={{
    width: "100%",
    height: 52,
    border: "none",
    borderRadius: 12,
cursor: "pointer",
    background: loading
      ? "#9ca3af"
      : "#f97316",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    transition: "all .2s ease",
    opacity: loading ? 0.8 : 1,
  }}
>
  {loading
    ? "Guardando..."
    : "Guardar configuración"}
</button>
  );
}