type Props = {
  total: number;
  accepted: number;
  pending: number;
  documents: number;
};

export default function LegalStats({
  total,
  accepted,
  pending,
  documents,
}: Props) {
  const cards = [
    {
      title: "Total acuerdos",
      value: total,
      color: "#ffffff",
    },
    {
      title: "Firmados",
      value: accepted,
      color: "#22c55e",
    },
    {
      title: "Pendientes",
      value: pending,
      color: "#f59e0b",
    },
    {
      title: "Documentos",
      value: documents,
      color: "#60a5fa",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",
        gap: 20,
        marginBottom: 30,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#171717",
            border: "1px solid #303030",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <div
            style={{
              color: "#9ca3af",
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: card.color,
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}


