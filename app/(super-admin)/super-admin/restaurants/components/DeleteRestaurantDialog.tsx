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
    <div
      className="overlay"
      onClick={loading ? undefined : onClose}
      role="presentation"
    >
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="warning-icon" aria-hidden="true">
          !
        </div>

        <div className="copy">
          <h2 id="delete-title">Eliminar restaurante</h2>

          <p id="delete-description">
            ¿Estás seguro de que quieres eliminar{" "}
            <strong>{restaurantName || "este restaurante"}</strong>?
          </p>

          <span>
            Esta acción no se puede deshacer.
          </span>
        </div>

        <div className="buttons">
          <button
            type="button"
            className="cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(7px);
          animation: fadeIn 0.16s ease-out;
        }

        .dialog {
          width: min(100%, 390px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: #151515;
          box-shadow: 0 24px 65px rgba(0, 0, 0, 0.42);
          animation: dialogIn 0.18s ease-out;
        }

        .warning-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          margin-bottom: 15px;
          border: 1px solid rgba(239, 68, 68, 0.22);
          border-radius: 11px;
          background: rgba(239, 68, 68, 0.08);
          color: #ef7777;
          font-size: 17px;
          font-weight: 800;
        }

        .copy {
          width: 100%;
          text-align: center;
        }

        h2 {
          margin: 0;
          color: #f4f4f4;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        p {
          margin: 10px 0 0;
          color: #aaa;
          font-size: 12px;
          line-height: 1.55;
        }

        p strong {
          color: #f0f0f0;
          font-weight: 700;
        }

        .copy > span {
          display: block;
          margin-top: 6px;
          color: #666;
          font-size: 10px;
        }

        .buttons {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 22px;
        }

        button {
          height: 40px;
          border-radius: 10px;
          font: inherit;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            opacity 0.16s ease;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .cancel {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: #c5c5c5;
        }

        .cancel:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.13);
        }

        .confirm {
          border: 1px solid rgba(239, 68, 68, 0.22);
          background: rgba(239, 68, 68, 0.1);
          color: #f07878;
        }

        .confirm:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.16);
          border-color: rgba(239, 68, 68, 0.34);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes dialogIn {
          from {
            opacity: 0;
            transform: translateY(5px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 430px) {
          .overlay {
            padding: 14px;
          }

          .dialog {
            padding: 21px 17px;
            border-radius: 16px;
          }

          .buttons {
            grid-template-columns: 1fr;
          }

          .confirm {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
  }