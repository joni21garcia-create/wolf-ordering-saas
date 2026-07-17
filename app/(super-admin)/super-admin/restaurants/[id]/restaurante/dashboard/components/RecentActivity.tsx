"use client";

import ActivityItem from "./ActivityItem";

type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
};

type Props = {
  activities: Activity[];
};

export default function RecentActivity({
  activities,
}: Props) {
  return (
    <section
      style={{
        marginTop: 32,
        marginBottom: 24,
        paddingTop: 24,
        borderTop: "1px solid rgba(255, 255, 255, 0.05)", // Línea divisoria elegante
      }}
    >
      {/* Cabecera ultra-discreta en una sola línea */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            Actividad Reciente
          </h4>
          <p
            style={{
              margin: "2px 0 0 0",
              color: "#606060",
              fontSize: 11,
            }}
          >
            Últimos eventos registrados en el restaurante
          </p>
        </div>

        {/* Contador premium y minimalista */}
        <div
          style={{
            fontSize: 11,
            color: "#808080",
            fontWeight: 600,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            padding: "4px 10px",
            borderRadius: 6,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {activities.length} {activities.length === 1 ? "registro" : "registros"}
        </div>
      </div>

      {/* Contenido principal */}
      {activities.length === 0 ? (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            borderRadius: 10,
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px solid rgba(255, 255, 255, 0.03)",
            color: "#606060",
            fontSize: 12,
          }}
        >
          Sin actividades recientes para mostrar.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 10, // Separación apretada y limpia a juego con el resto del panel
          }}
        >
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              description={activity.description}
              time={activity.time}
            />
          ))}
        </div>
      )}
    </section>
  );
}