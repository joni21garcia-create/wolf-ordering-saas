"use client";

type Props = {
  title: string;
  description: string;
  time: string;
};

export default function ActivityItem({
  title,
  description,
  time,
}: Props) {
  return (
    <article
      style={{
        position: "relative",

        overflow: "hidden",

        display: "flex",

        alignItems: "flex-start",

        gap: 20,

        padding: 24,

        borderRadius: 24,

        background:
          "linear-gradient(180deg,#181818,#141414)",

        border:
          "1px solid rgba(255,255,255,.06)",

        transition: ".25s",

        boxShadow:
          "0 18px 45px rgba(0,0,0,.18)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-4px)";

        e.currentTarget.style.boxShadow =
          "0 28px 60px rgba(0,0,0,.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 18px 45px rgba(0,0,0,.18)";
      }}
    >
      {/* Timeline */}

      <div
        style={{
          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 14,

            height: 14,

            borderRadius: "50%",

            background: "#f97316",

            boxShadow:
              "0 0 16px rgba(249,115,22,.9)",
          }}
        />

        <div
          style={{
            width: 2,

            flex: 1,

            minHeight: 70,

            marginTop: 10,

            background:
              "linear-gradient(#f97316,transparent)",
          }}
        />
      </div>

      {/* Información */}

      <div
        style={{
          flex: 1,

          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent: "space-between",

            alignItems: "flex-start",

            gap: 20,

            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,

                color: "#fff",

                fontSize: 20,

                fontWeight: 700,
              }}
            >
              {title}
            </h3>

            <p
              style={{
                marginTop: 10,

                marginBottom: 0,

                color: "#9b9b9b",

                lineHeight: 1.8,

                fontSize: 15,
              }}
            >
              {description}
            </p>
          </div>

          <div
            style={{
              padding: "8px 14px",

              borderRadius: 999,

              background:
                "rgba(249,115,22,.12)",

              border:
                "1px solid rgba(249,115,22,.22)",

              color: "#f97316",

              fontWeight: 700,

              fontSize: 13,

              whiteSpace: "nowrap",
            }}
          >
            {time}
          </div>
        </div>

        {/* Barra */}

        <div
          style={{
            marginTop: 22,

            height: 4,

            borderRadius: 999,

            overflow: "hidden",

            background:
              "rgba(255,255,255,.05)",
          }}
        >
          <div
            style={{
              width: "100%",

              height: "100%",

              borderRadius: 999,

              background:
                "linear-gradient(90deg,#f97316,transparent)",
            }}
          />
        </div>
      </div>
    </article>
  );
}