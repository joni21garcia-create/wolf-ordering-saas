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
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <MetricCard
          key={`${metric.title}-${index}`}
          {...metric}
        />
      ))}

      <style jsx>{`
        .metrics-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1100px) {
          .metrics-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 600px) {
          .metrics-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
            gap: 10px;
            margin-bottom: 18px;
          }
        }

        @media (max-width: 360px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
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
      className="metric-card"
      style={
        {
          "--metric-color": color,
        } as React.CSSProperties
      }
    >
      <div className="metric-accent" />

      <div className="metric-title">
        {title}
      </div>

      <div className="metric-value">
        {value}
      </div>

      {subtitle && (
        <div className="metric-subtitle">
          {subtitle}
        </div>
      )}

      <style jsx>{`
        .metric-card {
          position: relative;
          min-width: 0;
          min-height: 140px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 20px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.015)
            );
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: color-mix(
            in srgb,
            var(--metric-color) 25%,
            rgba(255, 255, 255, 0.07)
          );
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.02)
            );
        }

        .metric-accent {
          position: absolute;
          top: 0;
          left: 20px;
          width: 34px;
          height: 2px;
          border-radius: 0 0 4px 4px;
          background: var(--metric-color);
          opacity: 0.9;
        }

        .metric-title {
          overflow: hidden;
          color: #888;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.9px;
          line-height: 1.2;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .metric-value {
          margin-top: 10px;
          overflow: hidden;
          color: var(--metric-color);
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 850;
          letter-spacing: -1px;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .metric-subtitle {
          margin-top: 8px;
          overflow: hidden;
          color: #666;
          font-size: 10px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .metric-card {
            min-height: 112px;
            padding: 15px;
            border-radius: 15px;
          }

          .metric-accent {
            left: 15px;
            width: 28px;
          }

          .metric-title {
            font-size: 8px;
            letter-spacing: 0.7px;
          }

          .metric-value {
            margin-top: 8px;
            font-size: 25px;
            letter-spacing: -0.7px;
          }

          .metric-subtitle {
            margin-top: 5px;
            font-size: 9px;
          }
        }

        @media (max-width: 360px) {
          .metric-card {
            min-height: 105px;
          }

          .metric-value {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}