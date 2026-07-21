"use client";

type Props = {
  total: number;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function LegalToolbar({
  total,
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <input
          type="text"
          value={search}
          placeholder="Buscar restaurante, propietario o correo..."
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: 340,
            maxWidth: "100%",
            padding: "12px 16px",
            background: "#171717",
            border: "1px solid #303030",
            borderRadius: 12,
            color: "#fff",
            outline: "none",
            fontSize: 14,
          }}
        />

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            padding: "12px 16px",
            background: "#171717",
            border: "1px solid #303030",
            borderRadius: 12,
            color: "#fff",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="Todos">Todos</option>
          <option value="Firmados">Firmados</option>
          <option value="Pendientes">Pendientes</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            color: "#999",
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          {total} resultado{total !== 1 ? "s" : ""}
        </span>

        <button
          type="button"
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Exportar CSV
        </button>
      </div>
    </div>
  );
}