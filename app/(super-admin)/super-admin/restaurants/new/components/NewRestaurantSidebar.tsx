"use client";

interface Props {
  currentStep: number;
  totalSteps: number;

  restaurantName?: string;
  slug?: string;
  owner?: string;
  email?: string;

  plan?: string;

  agreementAccepted?: boolean;
}

export default function NewRestaurantSidebar({
  currentStep,
  totalSteps,
  restaurantName,
  slug,
  owner,
  email,
  plan,
  agreementAccepted,
}: Props) {
  const progress =
    Math.round(
      (currentStep / totalSteps) * 100
    );

  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        position: "sticky",
        top: 30,
      }}
    >
      {/* progreso */}

      <Card>
        <Title>
          Progreso
        </Title>

        <div
          style={{
            marginTop: 20,
          }}
        >
          <div
            style={{
              height: 10,
              background: "#242424",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg,#f97316,#fb923c)",
                transition: ".35s",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              color: "#8b8b8b",
              fontSize: 14,
            }}
          >
            <span>
              Paso {currentStep}
            </span>

            <strong
              style={{
                color: "#fff",
              }}
            >
              {progress}%
            </strong>
          </div>
        </div>
      </Card>

      {/* resumen */}

      <Card>
        <Title>
          Resumen
        </Title>

        <Summary
          label="Nombre"
          value={
            restaurantName ??
            "Sin definir"
          }
        />

        <Summary
          label="Slug"
          value={
            slug ??
            "--"
          }
        />

        <Summary
          label="Propietario"
          value={
            owner ??
            "--"
          }
        />

        <Summary
          label="Correo"
          value={
            email ??
            "--"
          }
        />

        <Summary
          label="Plan"
          value={
            plan ??
            "Starter"
          }
        />
      </Card>

      {/* agreement */}

      <Card>
        <Title>
          Acuerdo Comercial
        </Title>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span
            style={{
              color: "#8b8b8b",
            }}
          >
            Estado
          </span>

          <strong
            style={{
              color:
                agreementAccepted
                  ? "#22c55e"
                  : "#f59e0b",
            }}
          >
            {agreementAccepted
              ? "Aceptado"
              : "Pendiente"}
          </strong>
        </div>

        <p
          style={{
            marginTop: 18,
            color: "#8b8b8b",
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          La creación del restaurante
          solamente podrá finalizar
          cuando el acuerdo comercial
          haya sido aceptado y firmado.
        </p>
      </Card>

      {/* ayuda */}

      <Card>
        <Title>
          Recomendaciones
        </Title>

        <ul
          style={{
            margin: 0,
            marginTop: 16,
            paddingLeft: 18,
            color: "#8b8b8b",
            lineHeight: 1.9,
          }}
        >
          <li>
            Usa un slug corto.
          </li>

          <li>
            Sube un logo cuadrado.
          </li>

          <li>
            Configura WhatsApp.
          </li>

          <li>
            Firma el Agreement.
          </li>
        </ul>
      </Card>
    </aside>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#171717,#101010)",
        border:
          "1px solid rgba(255,255,255,.06)",
        borderRadius: 24,
        padding: 22,
      }}
    >
      {children}
    </div>
  );
}

function Title({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3
      style={{
        margin: 0,
        color: "#fff",
        fontSize: 18,
        fontWeight: 800,
      }}
    >
      {children}
    </h3>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        marginTop: 16,
        gap: 16,
      }}
    >
      <span
        style={{
          color: "#8b8b8b",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#fff",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value}
      </strong>
    </div>
  );
}


