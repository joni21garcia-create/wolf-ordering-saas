"use client";

export default function EmptyModules() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        minHeight: 500,

        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,

          textAlign: "center",

          borderRadius: 30,

          padding: "60px 40px",

          background:
            "linear-gradient(180deg,#181818,#131313)",

          border:
            "1px solid rgba(255,255,255,.06)",

          boxShadow:
            "0 25px 60px rgba(0,0,0,.22)",

          position: "relative",

          overflow: "hidden",
        }}
      >
        {/* Glow */}

        <div
          style={{
            position: "absolute",

            top: -120,

            right: -120,

            width: 260,

            height: 260,

            borderRadius: "50%",

            background:
              "radial-gradient(circle,rgba(249,115,22,.18),transparent 70%)",

            pointerEvents: "none",
          }}
        />

        {/* Icono */}

        <div
          style={{
            width: 120,

            height: 120,

            margin: "0 auto 30px",

            borderRadius: "50%",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            fontSize: 52,

            background:
              "linear-gradient(135deg,#ff8a1f20,#ff620020)",

            border:
              "1px solid rgba(249,115,22,.20)",

            position: "relative",

            zIndex: 2,
          }}
        >
          🔒
        </div>

        {/* Título */}

        <h2
          style={{
            margin: 0,

            color: "#fff",

            fontWeight: 800,

            fontSize: "clamp(30px,4vw,42px)",

            position: "relative",

            zIndex: 2,
          }}
        >
          No tienes módulos disponibles
        </h2>

        {/* Descripción */}

        <p
          style={{
            marginTop: 18,

            marginBottom: 36,

            color: "#9b9b9b",

            lineHeight: 1.9,

            fontSize: 16,

            maxWidth: 520,

            marginInline: "auto",

            position: "relative",

            zIndex: 2,
          }}
        >
          Tu cuenta todavía no tiene permisos
          asignados para acceder a los módulos del
          sistema.

          <br />

          Solicita al administrador del restaurante
          que habilite los accesos correspondientes
          para continuar.
        </p>

        {/* Estado */}

        <div
          style={{
            display: "inline-flex",

            alignItems: "center",

            gap: 12,

            padding: "12px 22px",

            borderRadius: 999,

            background:
              "rgba(239,68,68,.10)",

            border:
              "1px solid rgba(239,68,68,.18)",

            color: "#ef4444",

            fontWeight: 700,

            position: "relative",

            zIndex: 2,
          }}
        >
          <span
            style={{
              width: 10,

              height: 10,

              borderRadius: "50%",

              background: "#ef4444",

              boxShadow:
                "0 0 12px #ef4444",
            }}
          />

          Sin permisos asignados
        </div>
      </div>
    </section>
  );
}