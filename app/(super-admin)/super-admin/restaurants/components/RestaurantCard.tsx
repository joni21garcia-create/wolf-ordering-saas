"use client";

import RestaurantActions from "./RestaurantActions";
import RestaurantStatus from "./RestaurantStatus";

type Props = {
  restaurant: any;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export default function RestaurantCard({
  restaurant,
  onToggleStatus,
  onDelete,
}: Props) {
  const initials = (restaurant?.name || "R")
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Fecha de actualización o creación
  const dateValue = restaurant.updated_at || restaurant.created_at;

  return (
    <article
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: 18,
        overflow: "visible",
        background: "linear-gradient(180deg,#181818,#131313)",
        border: "1px solid rgba(255,255,255,.06)",
        boxShadow: "0 8px 24px rgba(0,0,0,.18)",
        transition: "all .25s ease",
      }}
    >
      {/* Banner */}
      <div
        style={{
          position: "relative",
          height: 68,
          overflow: "hidden",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          background: restaurant.banner_url
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
          marginTop: -28,
          position: "relative",
          zIndex: 2,
        }}
      >
        {restaurant.logo_url ? (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #181818",
              background: "#222",
              boxShadow: "0 8px 20px rgba(0,0,0,.35)",
            }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(135deg,#ff8a1f,#ff6200)",
              border: "3px solid #181818",
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(0,0,0,.35)",
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: "12px 14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Nombre */}
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {restaurant.name}
          </h2>

          <p
            style={{
              marginTop: 2,
              color: "#8f8f8f",
              fontSize: 12,
              marginBottom: 0,
            }}
          >
            /{restaurant.slug}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <RestaurantStatus active={restaurant.active} />
        </div>

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,.06)",
          }}
        />

        {/* Información corregida según tus columnas */}
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          <InfoRow
            icon="📱"
            value={
              restaurant.whatsapp ||
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
              dateValue
                ? new Date(dateValue).toLocaleDateString("es-EC", {
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
            background: "rgba(255,255,255,.06)",
            marginTop: 2,
          }}
        />

        {/* Acciones */}
        <RestaurantActions
          restaurantId={restaurant.id}
          active={restaurant.active}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

function InfoRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.05)",
          fontSize: 13,
        }}
      >
        {icon}
      </div>

      <span
        style={{
          flex: 1,
          color: "#d7d7d7",
          fontSize: 12,
          lineHeight: 1.3,
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