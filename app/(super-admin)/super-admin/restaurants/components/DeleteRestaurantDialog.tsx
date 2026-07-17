"use client";

type Props = {
  open: boolean;
  restaurantName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteRestaurantDialog({
  open,
  restaurantName,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* Icono */}
        <div style={iconContainer}>
          <div style={iconCircle}>🗑️</div>
        </div>

        {/* Título */}
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 30,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          Eliminar restaurante
        </h2>

        {/* Descripción */}
        <p
          style={{
            margin: 0,
            textAlign: "center",
            color: "#9b9b9b",
            lineHeight: 1.8,
            fontSize: 15,
          }}
        >
          Estás a punto de eliminar el restaurante
          <br />
          <strong
            style={{
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            {restaurantName}
          </strong>
          .
          <br />
          Esta acción no podrá deshacerse.
        </p>

        {/* Botones */}
        <div style={buttons}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={cancelButton}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={deleteButton}
          >
            {loading ? "Eliminando..." : "Eliminar restaurante"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================================================== */
/* Estilos                                                */
/* ====================================================== */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
  background: "rgba(0,0,0,.72)",
  backdropFilter: "blur(10px)",
  zIndex: 999999,
  animation: "fadeIn .18s ease",
};

const modal: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  display: "flex",
  flexDirection: "column",
  gap: 28,
  padding: 34,
  borderRadius: 28,
  background: "linear-gradient(180deg,#191919,#141414)",
  border: "1px solid rgba(255,255,255,.08)",
  boxShadow: "0 35px 80px rgba(0,0,0,.45)",
};

const iconContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const iconCircle: React.CSSProperties = {
  width: 92,
  height: 92,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 38,
  background: "linear-gradient(135deg,#ef444425,#dc262625)",
  border: "1px solid rgba(239,68,68,.25)",
  boxShadow: "0 18px 45px rgba(239,68,68,.18)",
};

const buttons: React.CSSProperties = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
};

const cancelButton: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  height: 52,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#202020",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  transition: ".25s",
};

const deleteButton: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  height: 52,
  border: "none",
  borderRadius: 16,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  color: "#fff",
  background: "linear-gradient(135deg,#ef4444,#dc2626)",
  boxShadow: "0 15px 35px rgba(239,68,68,.25)",
  transition: ".25s",
};