"use client";

interface Metric {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

interface Props {
  metrics: Metric[];
}

export default function HistoryMetrics({
  metrics,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(230px,1fr))",
        gap: 20,
        marginBottom: 32,
      }}
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          {...metric}
        />
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color = "#f97316",
}: Metric) {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 22,
        padding: 24,
        backdropFilter: "blur(14px)",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          color: "#8b8b8b",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: 38,
          fontWeight: 800,
          lineHeight: 1,
          marginTop: 12,
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          style={{
            color: "#777",
            fontSize: 14,
            marginTop: 14,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </section>
  );
}