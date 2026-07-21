"use client";

interface Props {
  version: string;
}

const SECTIONS = [
  {
    title: "1. Objeto del Acuerdo",
    body:
      "Wolf Ordering SaaS proporciona una plataforma tecnológica para la gestión de pedidos, administración del restaurante y herramientas comerciales.",
  },

  {
    title: "2. Responsabilidades",
    body:
      "El restaurante será responsable de mantener actualizada su información, precios, productos y horarios de atención.",
  },

  {
    title: "3. Comisión",
    body:
      "Las comisiones aplicables serán las configuradas en el plan contratado y serán reflejadas en cada liquidación financiera.",
  },

  {
    title: "4. Pagos",
    body:
      "Las liquidaciones serán generadas automáticamente según la configuración del sistema y el calendario establecido por Wolf Ordering.",
  },

  {
    title: "5. Protección de Datos",
    body:
      "Toda la información será tratada conforme a la política de privacidad vigente y las leyes aplicables.",
  },

  {
    title: "6. Terminación",
    body:
      "Cualquiera de las partes podrá finalizar la relación comercial respetando las condiciones establecidas en el contrato.",
  },
];

export default function NewRestaurantAgreementPreview({
  version,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns:
          "260px minmax(0,1fr)",
        gap: 28,
      }}
    >
      {/* Índice */}

      <aside
        style={{
          background:
            "linear-gradient(180deg,#171717,#111111)",
          border:
            "1px solid rgba(255,255,255,.06)",
          borderRadius: 22,
          padding: 24,
          height: "fit-content",
          position: "sticky",
          top: 20,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
            marginBottom: 20,
          }}
        >
          Agreement v{version}
        </div>

        {SECTIONS.map((section) => (
          <div
            key={section.title}
            style={{
              padding: "12px 0",
              borderBottom:
                "1px solid rgba(255,255,255,.05)",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            {section.title}
          </div>
        ))}
      </aside>

      {/* Documento */}

      <article
        style={{
          background: "#ffffff",
          color: "#111827",
          borderRadius: 24,
          padding: 42,
          boxShadow:
            "0 25px 60px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            borderBottom:
              "2px solid #e5e7eb",
            paddingBottom: 24,
            marginBottom: 36,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            Wolf Ordering SaaS
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#6b7280",
              lineHeight: 1.8,
            }}
          >
            Acuerdo Comercial para la utilización
            de la plataforma Wolf Ordering.
          </p>

          <div
            style={{
              marginTop: 20,
              display: "inline-flex",
              padding: "8px 16px",
              borderRadius: 999,
              background: "#eff6ff",
              color: "#2563eb",
              fontWeight: 700,
            }}
          >
            Versión {version}
          </div>
        </div>

        {SECTIONS.map((section) => (
          <section
            key={section.title}
            style={{
              marginBottom: 34,
            }}
          >
            <h2
              style={{
                marginBottom: 14,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {section.title}
            </h2>

            <p
              style={{
                lineHeight: 1.9,
                color: "#4b5563",
              }}
            >
              {section.body}
            </p>
          </section>
        ))}

        <div
          style={{
            marginTop: 50,
            paddingTop: 28,
            borderTop:
              "2px dashed #d1d5db",
          }}
        >
          <div
            style={{
              fontWeight: 700,
            }}
          >
            Este documento será firmado
            electrónicamente en el siguiente paso.
          </div>
        </div>
      </article>
    </section>
  );
}


