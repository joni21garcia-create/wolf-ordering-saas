"use client";

import RestaurantActions from "./RestaurantActions";
import RestaurantStatus from "./RestaurantStatus";

type Props = {
  restaurant: any;

  onDuplicate?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export default function RestaurantCard({
  restaurant,
  onDuplicate,
  onToggleStatus,
  onDelete,
}: Props) {
  const initials = (
    restaurant?.name || "R"
  )
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <article
      style={{
        position: "relative",

        display: "flex",
        flexDirection: "column",

        borderRadius: 28,

        overflow: "visible",

        background:
          "linear-gradient(180deg,#181818,#131313)",

        border:
          "1px solid rgba(255,255,255,.06)",

        boxShadow:
          "0 18px 50px rgba(0,0,0,.22)",

        transition:
          "all .25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-6px)";

        e.currentTarget.style.boxShadow =
          "0 30px 70px rgba(0,0,0,.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 18px 50px rgba(0,0,0,.22)";
      }}
    >
      {/* Banner */}

      <div
        style={{
          position: "relative",

          height: 118,

          overflow: "hidden",

          borderTopLeftRadius: 28,

          borderTopRightRadius: 28,

          background:
            restaurant.banner_url
              ? `url(${restaurant.banner_url}) center / cover`
              : "linear-gradient(135deg,#ff8a1f,#ff6200)",
        }}
      >
        <div
          style={{
            position: "absolute",

            inset: 0,

            background:
              "linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.60))",
          }}
        />
      </div>

      {/* Logo */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",

          marginTop: -42,

          position: "relative",

          zIndex: 2,
        }}
      >
        {restaurant.logo_url ? (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            style={{
              width: 88,
              height: 88,

              borderRadius: "50%",

              objectFit: "cover",

              border: "4px solid #181818",

              background: "#222",

              boxShadow:
                "0 18px 35px rgba(0,0,0,.35)",
            }}
          />
        ) : (
          <div
            style={{
              width: 88,
              height: 88,

              borderRadius: "50%",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              background:
                "linear-gradient(135deg,#ff8a1f,#ff6200)",

              border: "4px solid #181818",

              color: "#fff",

              fontSize: 28,

              fontWeight: 800,

              boxShadow:
                "0 18px 35px rgba(0,0,0,.35)",
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Contenido */}

      <div
        style={{
          padding: "22px 24px 26px",

          display: "flex",

          flexDirection: "column",

          gap: 18,
        }}
      >
        {/* Nombre */}

        <div
          style={{
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,

              color: "#fff",

              fontSize: 25,

              fontWeight: 800,
            }}
          >
            {restaurant.name}
          </h2>

          <p
            style={{
              marginTop: 8,

              color: "#8f8f8f",

              fontSize: 14,

              marginBottom: 0,
            }}
          >
            /{restaurant.slug}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <RestaurantStatus
            active={restaurant.active}
          />
        </div>

        <div
          style={{
            height: 1,

            background:
              "rgba(255,255,255,.06)",
          }}
        />
                {/* Información */}

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          <InfoRow
            icon="📱"
            value={
              restaurant.owner_phone ||
              restaurant.phone ||
              "No registrado"
            }
          />

          <InfoRow
            icon="✉️"
            value={
              restaurant.contact_email ||
              restaurant.email ||
              "No registrado"
            }
          />

          <InfoRow
            icon="🍽️"
            value={`${restaurant.products_count ?? 0} Productos`}
          />

          <InfoRow
            icon="🕒"
            value={
              restaurant.updated_at
                ? new Date(
                    restaurant.updated_at
                  ).toLocaleDateString("es-EC", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Sin actualizar"
            }
          />
        </div>

        {/* Separador */}

        <div
          style={{
            height: 1,
            background:
              "rgba(255,255,255,.06)",
            marginTop: 2,
          }}
        />

        {/* Acciones */}

        <RestaurantActions
          restaurantId={restaurant.id}
          active={restaurant.active}
          onDuplicate={onDuplicate}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

/* ====================================================== */
/* COMPONENTES AUXILIARES                                 */
/* ====================================================== */

function InfoRow({
  icon,
  value,
}: {
  icon: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,

          borderRadius: 12,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          background:
            "rgba(255,255,255,.04)",

          border:
            "1px solid rgba(255,255,255,.05)",

          fontSize: 16,
        }}
      >
        {icon}
      </div>

      <span
        style={{
          flex: 1,

          color: "#d7d7d7",

          fontSize: 14,

          lineHeight: 1.5,

          overflow: "hidden",

          textOverflow: "ellipsis",

          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}