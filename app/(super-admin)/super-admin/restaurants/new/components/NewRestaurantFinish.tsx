"use client";

import Link from "next/link";

interface Props {
  restaurantId: string;
  restaurantName: string;
  slug: string;
}

const nextSteps = [
  "Configurar horarios de atención",
  "Personalizar la Landing Page",
  "Importar el menú",
  "Configurar Delivery",
  "Activar la PWA",
  "Invitar al administrador",
];

export default function NewRestaurantFinish({
  restaurantId,
  restaurantName,
  slug,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gap: 42,
      }}
    >
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 34,
          padding: "60px 42px",
          background:
            "linear-gradient(180deg,#1b1b1b,#101010)",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "rgba(34,197,94,.16)",
            filter: "blur(70px)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              margin: "0 auto",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff",
              fontSize: 60,
              fontWeight: 900,
              boxShadow:
                "0 25px 60px rgba(34,197,94,.30)",
            }}
          >
            ✓
          </div>

          <div
            style={{
              marginTop: 30,
              color: "#22c55e",
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Wolf Ordering SaaS
          </div>

          <h1
            style={{
              marginTop: 18,
              marginBottom: 18,
              color: "#fff",
              fontWeight: 900,
              fontSize:
                "clamp(42px,5vw,64px)",
            }}
          >
            Restaurante creado
            correctamente
          </h1>

          <p
            style={{
              maxWidth: 760,
              margin: "0 auto",
              color: "#9ca3af",
              lineHeight: 1.9,
              fontSize: 17,
            }}
          >
            El restaurante ya forma parte
            del ecosistema Wolf Ordering.
            Ahora puedes continuar con la
            configuración completa del
            negocio.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* RESUMEN */}
      {/* ================================================= */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 22,
        }}
      >
        <InfoCard
          title="Restaurante"
          value={restaurantName}
          icon="🍽️"
          color="#f97316"
        />

        <InfoCard
          title="Slug"
          value={slug}
          icon="🌐"
          color="#3b82f6"
        />

        <InfoCard
          title="Estado"
          value="Activo"
          icon="🟢"
          color="#22c55e"
        />

        <InfoCard
          title="Plan"
          value="FREE"
          icon="📦"
          color="#8b5cf6"
        />
      </section>

      {/* ================================================= */}
      {/* ACCIONES */}
      {/* ================================================= */}

      <section
        style={{
          borderRadius: 30,
          padding: 34,
          background:
            "linear-gradient(180deg,#181818,#111)",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#fff",
            fontSize: 34,
            fontWeight: 900,
            marginBottom: 28,
          }}
        >
          Acciones rápidas
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
          }}
        >
<Link
  href={`/super-admin/restaurants/${restaurantId}/settings`}
  style={{
    textDecoration: "none",
  }}
>
  <ActionButton
    title="Configuración"
    subtitle="Centro de configuración"
    color="#f97316"
    icon="⚙️"
  />
</Link>

<Link
  href={`/${slug}`}
  style={{
    textDecoration: "none",
  }}
>
  <ActionButton
    title="Ver Landing"
    subtitle="Abrir sitio público"
    color="#22c55e"
    icon="🌍"
  />
</Link>

            <Link
            href="/super-admin/restaurants"
            style={{
              textDecoration: "none",
            }}
            >         
            <ActionButton
            title="Restaurantes"
            subtitle="Administrar todos los restaurantes"
            color="#8b5cf6"
            icon="🏢"
            />
          </Link>
        </div>
      </section>

      {/* ================================================= */}
      {/* PRÓXIMOS PASOS */}
      {/* ================================================= */}

      <section
        style={{
          borderRadius: 30,
          padding: 34,
          background:
            "linear-gradient(180deg,#171717,#101010)",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#fff",
            fontSize: 32,
            fontWeight: 900,
            marginBottom: 30,
          }}
        >
          Próximos pasos
        </h2>

        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          {nextSteps.map(
            (step, index) => (
              <StepItem
                key={step}
                index={index + 1}
                text={step}
              />
            )
          )}
        </div>
      </section>
    </section>
  );
}
function InfoCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: 24,
        background:
          "linear-gradient(180deg,#181818,#111)",
        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `${color}18`,
          filter: "blur(35px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 32,
            marginBottom: 18,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            color: "#8b8b95",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 900,
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          background: color,
        }}
      />
    </article>
  );
}

function ActionButton({
  title,
  subtitle,
  icon,
  color,
}: {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}) {
  return (
    <div
      style={{
        height: "100%",
        borderRadius: 24,
        padding: 24,
        background:
          "linear-gradient(180deg,#1b1b1b,#121212)",
        border:
          "1px solid rgba(255,255,255,.08)",
        transition: ".25s ease",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 18,
          background: `${color}18`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 28,
          marginBottom: 20,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#9ca3af",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function StepItem({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: 18,
        borderRadius: 18,
        background:
          "rgba(255,255,255,.03)",
        border:
          "1px solid rgba(255,255,255,.05)",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,#f97316,#ea580c)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {index}
      </div>

      <div
        style={{
          color: "#e5e7eb",
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        {text}
      </div>
    </div>
  );
}


