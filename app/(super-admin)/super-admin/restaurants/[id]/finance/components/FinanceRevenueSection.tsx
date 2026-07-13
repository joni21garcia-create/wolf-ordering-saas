"use client";

interface Props {
  today: number;
  week: number;
  month: number;
}

export default function FinanceRevenueSection({
  today,
  week,
  month,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 42,
      }}
    >
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 18,
        }}
      >
        <RevenueCard
          title="Wolf Hoy"
          value={today}
          subtitle="Comisión generada hoy"
        />

        <RevenueCard
          title="Wolf Semana"
          value={week}
          subtitle="Comisión semanal"
        />

        <RevenueCard
          title="Wolf Mes"
          value={month}
          subtitle="Comisión mensual"
          featured
        />
      </div>
    </section>
  );
}

function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
        marginBottom: 22,
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          🐺 Wolf Revenue
        </h2>

        <p
          style={{
            marginTop: 8,
            color: "#8b8b8b",
          }}
        >
          Ingresos correspondientes a Wolf Ordering SaaS.
        </p>
      </div>

      <div
        style={{
          padding: "10px 18px",
          borderRadius: 999,
          background:
            "rgba(249,115,22,.12)",

          color: "#f97316",

          border:
            "1px solid rgba(249,115,22,.20)",

          fontWeight: 700,
        }}
      >
        Revenue
      </div>
    </div>
  );
}

function RevenueCard({
  title,
  value,
  subtitle,
  featured,
}: {
  title: string;
  value: number;
  subtitle: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        background: featured
          ? "linear-gradient(135deg,#f97316,#c2410c)"
          : "linear-gradient(180deg,#171717,#101010)",

        border: featured
          ? "none"
          : "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 24,

        boxShadow: featured
          ? "0 20px 50px rgba(249,115,22,.30)"
          : "0 18px 45px rgba(0,0,0,.35)",

        transition: ".25s",
      }}
    >
      <div
        style={{
          fontSize: 30,
          marginBottom: 18,
        }}
      >
        🐺
      </div>

      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: ".6px",
          fontWeight: 700,
          color: featured
            ? "#fff"
            : "#888",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 40,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        ${value.toFixed(2)}
      </div>

      <div
        style={{
          marginTop: 14,
          color: featured
            ? "rgba(255,255,255,.85)"
            : "#8b8b8b",

          fontSize: 14,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}