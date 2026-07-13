"use client";

type Props = {
  search: string;
  onSearch: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;

  total: number;
};

export default function RestaurantsToolbar({
  search,
  onSearch,
  status,
  onStatusChange,
  sort,
  onSortChange,
  total,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 34,

        background:
          "linear-gradient(180deg,#181818,#141414)",

        border:
          "1px solid rgba(255,255,255,.06)",

        borderRadius: 24,

        padding: 26,

        display: "flex",

        flexDirection: "column",

        gap: 24,

        boxShadow:
          "0 15px 40px rgba(0,0,0,.18)",
      }}
    >
      {/* ======================================== */}

      {/* Primera fila */}

      {/* ======================================== */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          gap: 24,

          flexWrap: "wrap",
        }}
      >
        {/* Buscar */}

        <div
          style={{
            flex: 1,

            minWidth: 280,

            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",

              left: 18,

              top: "50%",

              transform:
                "translateY(-50%)",

              color: "#8b8b8b",

              fontSize: 18,

              pointerEvents: "none",
            }}
          >
            🔍
          </span>

          <input
            value={search}
            onChange={(e) =>
              onSearch(
                e.target.value
              )
            }
            placeholder="Buscar restaurante..."
            style={{
              width: "100%",

              height: 52,

              borderRadius: 16,

              border:
                "1px solid rgba(255,255,255,.08)",

              background: "#101010",

              color: "#fff",

              outline: "none",

              paddingLeft: 52,

              paddingRight: 18,

              fontSize: 15,

              transition: ".25s",
            }}
          />
        </div>

        {/* Contador */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 12,

            padding:
              "12px 18px",

            borderRadius: 16,

            background:
              "rgba(255,255,255,.04)",

            border:
              "1px solid rgba(255,255,255,.06)",
          }}
        >
          <div
            style={{
              width: 10,

              height: 10,

              borderRadius: "50%",

              background: "#22c55e",
            }}
          />

          <span
            style={{
              color: "#d6d6d6",

              fontSize: 14,

              fontWeight: 600,
            }}
          >
            {total} restaurantes
          </span>
        </div>
      </div>

      {/* ======================================== */}

      {/* Segunda fila */}

      {/* ======================================== */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: 18,
        }}
      >
        {/* Estado */}

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(
              e.target.value
            )
          }
          style={selectStyle}
        >
          <option value="all">
            Todos los estados
          </option>

          <option value="active">
            Activos
          </option>

          <option value="inactive">
            Inactivos
          </option>
        </select>

        {/* Orden */}
                <select
          value={sort}
          onChange={(e) =>
            onSortChange(
              e.target.value
            )
          }
          style={selectStyle}
        >
          <option value="recent">
            Más recientes
          </option>

          <option value="oldest">
            Más antiguos
          </option>

          <option value="az">
            Nombre (A-Z)
          </option>

          <option value="za">
            Nombre (Z-A)
          </option>
        </select>

        {/* Información */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            minHeight: 52,

            borderRadius: 16,

            background:
              "rgba(255,255,255,.03)",

            border:
              "1px solid rgba(255,255,255,.06)",

            color: "#9f9f9f",

            fontSize: 14,

            fontWeight: 500,
          }}
        >
          Plataforma Wolf Ordering
        </div>
      </div>
    </section>
  );
}

/* ======================================================= */
/* Estilos                                                 */
/* ======================================================= */

const selectStyle: React.CSSProperties = {
  width: "100%",

  height: 52,

  borderRadius: 16,

  border: "1px solid rgba(255,255,255,.08)",

  background: "#101010",

  color: "#fff",

  padding: "0 16px",

  fontSize: 14,

  cursor: "pointer",

  outline: "none",

  appearance: "none",

  WebkitAppearance: "none",

  MozAppearance: "none",

  transition: ".25s",
};