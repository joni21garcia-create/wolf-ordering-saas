"use client";

export default function EmptyModules() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh", // Más adaptable en lugar de un minHeight fijo tan alto
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500, // Reducido de 650 para un enfoque más elegante
          textAlign: "center",
          borderRadius: 20, // Bordes más modernos y menos exagerados
          padding: "40px 32px", // Espaciado interno más balanceado
          background: "linear-gradient(180deg, #141414, #0d0d0d)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow naranja de advertencia muy sutil */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.08), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Icono de candado compacto */}
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 20px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 28,
            background: "rgba(249, 115, 22, 0.05)",
            border: "1px solid rgba(249, 115, 22, 0.15)",
            position: "relative",
            zIndex: 2,
          }}
        >
          🔒
        </div>

        {/* Título en tamaño refinado */}
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontWeight: 700,
            fontSize: 20, // Antes era hasta 42px. Ahora es súper limpio.
            letterSpacing: "-0.3px",
            position: "relative",
            zIndex: 2,
          }}
        >
          Módulos no disponibles
        </h2>

        {/* Descripción compacta */}
        <p
          style={{
            marginTop: 12,
            marginBottom: 24,
            color: "#808080",
            lineHeight: 1.6,
            fontSize: 13,
            maxWidth: 400,
            marginInline: "auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          Tu cuenta aún no cuenta con permisos asignados para acceder a las herramientas del sistema. 
          <span style={{ display: "block", marginTop: 8, color: "#606060" }}>
            Por favor, solicita al administrador del restaurante que habilite tus accesos para poder ingresar.
          </span>
        </p>

        {/* Badge de estado en formato micro */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            fontWeight: 600,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 6px #ef4444",
            }}
          />
          Acceso Restringido
        </div>
      </div>
    </section>
  );
}