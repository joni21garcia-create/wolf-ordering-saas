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
        marginBottom: 24,
        background: "#141414",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* Barra de búsqueda compacta */}
      <div
        style={{
          flex: 1,
          minWidth: 240,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#777",
            fontSize: 15,
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar restaurante..."
          style={{
            width: "100%",
            height: 42,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.08)",
            background: "#0d0d0d",
            color: "#fff",
            outline: "none",
            paddingLeft: 42,
            paddingRight: 14,
            fontSize: 14,
            transition: ".2s",
          }}
        />
      </div>

      {/* Controles derechos (Filtros, Orden y Total) en una sola línea */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Estado */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        {/* Orden */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          style={selectStyle}
        >
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="az">Nombre (A-Z)</option>
          <option value="za">Nombre (Z-A)</option>
        </select>

        {/* Contador minimalista */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 42,
            padding: "0 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{
              color: "#ccc",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {total} {total === 1 ? "restaurante" : "restaurantes"}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ======================================================= */
/* Estilos compactos                                       */
/* ======================================================= */

const selectStyle: React.CSSProperties = {
  height: 42,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#0d0d0d",
  color: "#fff",
  padding: "0 14px",
  fontSize: 13,
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  transition: ".2s",
};


