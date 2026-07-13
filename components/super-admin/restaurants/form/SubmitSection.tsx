"use client";

interface Props {
  loading: boolean;
  mode: "create" | "edit";
}

export default function SubmitSection({
  loading,
  mode,
}: Props) {
  return (
    <section
      style={{
        marginTop: 40,
        padding: 28,
        borderRadius: 24,
        background:
          "linear-gradient(180deg,#181818,#101010)",
        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 10,
        }}
      >
        {mode === "create"
          ? "Crear Restaurante"
          : "Guardar Cambios"}
      </h2>

      <p
        style={{
          color: "#8b8b8b",
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        Revisa la información antes de continuar.
        Al guardar se crearán las configuraciones
        iniciales del restaurante y quedará listo
        para continuar con el Agreement y la
        configuración avanzada.
      </p>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: 16,
          border: "none",
          cursor: loading
            ? "not-allowed"
            : "pointer",
          background:
            "linear-gradient(135deg,#f97316,#ea580c)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 17,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading
          ? "Procesando..."
          : mode === "create"
          ? "Crear Restaurante"
          : "Guardar Cambios"}
      </button>
    </section>
  );
}