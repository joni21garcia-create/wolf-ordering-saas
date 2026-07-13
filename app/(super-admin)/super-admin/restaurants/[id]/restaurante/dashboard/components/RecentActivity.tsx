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
        marginBottom: 50,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 20,

          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,

              color: "#fff",

              fontSize: "clamp(28px,4vw,36px)",

              fontWeight: 800,
            }}
          >
            Actividad reciente
          </h2>

          <p
            style={{
              marginTop: 10,

              color: "#8f8f8f",

              lineHeight: 1.8,

              maxWidth: 700,
            }}
          >
            Últimos cambios realizados dentro del
            restaurante.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",

            borderRadius: 999,

            background:
              "rgba(255,255,255,.04)",

            border:
              "1px solid rgba(255,255,255,.08)",

            color: "#bdbdbd",

            fontWeight: 700,

            fontSize: 14,
          }}
        >
          {activities.length} registros
        </div>
      </div>

      {activities.length === 0 ? (
        <div
          style={{
            padding: 50,

            textAlign: "center",

            borderRadius: 26,

            background:
              "linear-gradient(180deg,#181818,#141414)",

            border:
              "1px solid rgba(255,255,255,.06)",

            color: "#909090",
          }}
        >
          Todavía no existen actividades para mostrar.
        </div>
      ) : (
        <div
          style={{
            display: "grid",

            gap: 18,
          }}
        >
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              description={
                activity.description
              }
              time={activity.time}
            />
          ))}
        </div>
      )}
    </section>
  );
}