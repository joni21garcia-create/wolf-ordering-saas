type Props = {
  total: number;
  accepted: number;
  pending: number;
  documents: number;
};

type Tone = "neutral" | "success" | "warning" | "info";

const toneStyles: Record<Tone, { value: string; dot: string }> = {
  neutral: { value: "#fff", dot: "rgba(255,255,255,.35)" },
  success: { value: "#22c55e", dot: "#22c55e" },
  warning: { value: "#f59e0b", dot: "#f59e0b" },
  info: { value: "#60a5fa", dot: "#60a5fa" },
};

export default function LegalStats({
  total,
  accepted,
  pending,
  documents,
}: Props) {
  const cards: Array<{ title: string; value: number; tone: Tone }> = [
    { title: "Total acuerdos", value: total, tone: "neutral" },
    { title: "Firmados", value: accepted, tone: "success" },
    { title: "Pendientes", value: pending, tone: "warning" },
    { title: "Documentos", value: documents, tone: "info" },
  ];

  return (
    <section aria-label="Resumen legal" className="legal-stats">
      {cards.map((card) => {
        const tone = toneStyles[card.tone];

        return (
          <article key={card.title} className="legal-stat-card">
            <div className="legal-stat-label">
              <span
                className="legal-stat-dot"
                style={{ background: tone.dot }}
              />
              {card.title}
            </div>

            <strong
              className="legal-stat-value"
              style={{ color: tone.value }}
            >
              {card.value}
            </strong>
          </article>
        );
      })}

      <style jsx>{`
        .legal-stats {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin: 0 0 10px;
        }

        .legal-stat-card {
          min-width: 0;
          min-height: 72px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 11px 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 12px;
          background: #101010;
        }

        .legal-stat-label {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          overflow: hidden;
          color: rgba(255, 255, 255, 0.38);
          font-size: 8px;
          line-height: 1.2;
          font-weight: 750;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .legal-stat-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 999px;
        }

        .legal-stat-value {
          display: block;
          margin-top: 7px;
          font-size: clamp(20px, 3vw, 27px);
          line-height: 1;
          letter-spacing: -0.045em;
          font-weight: 900;
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 620px) {
          .legal-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }

          .legal-stat-card {
            min-height: 65px;
            padding: 9px 10px;
            border-radius: 10px;
          }

          .legal-stat-label {
            font-size: 7px;
          }

          .legal-stat-value {
            margin-top: 5px;
            font-size: 21px;
          }
        }

        @media (max-width: 360px) {
          .legal-stat-card {
            min-height: 61px;
            padding: 8px 9px;
          }

          .legal-stat-value {
            font-size: 19px;
          }
        }
      `}</style>
    </section>
  );
}