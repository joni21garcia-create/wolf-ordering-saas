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
    <section className="legal-toolbar" aria-label="Filtros legales">
      <div className="toolbar-main">
        <label className="search-box">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            placeholder="Buscar restaurante, propietario o correo..."
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              aria-label="Limpiar búsqueda"
              onClick={() => onSearchChange("")}
            >
              ×
            </button>
          )}
        </label>

        <label className="status-select">
          <span>Estado</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Firmados">Firmados</option>
            <option value="Pendientes">Pendientes</option>
          </select>
        </label>
      </div>

      <div className="toolbar-meta">
        <span className="result-count">
          <i />
          {total} resultado{total !== 1 ? "s" : ""}
        </span>

        <button type="button" className="export-button" disabled>
          Exportar CSV
        </button>
      </div>

      <style jsx>{`
        .legal-toolbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0 0 10px;
        }

        .toolbar-main {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .search-box {
          position: relative;
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          height: 38px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          background: #101010;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .search-box:focus-within {
          border-color: rgba(249, 115, 22, 0.35);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.045);
        }

        .search-icon {
          width: 28px;
          flex: 0 0 28px;
          color: rgba(255, 255, 255, 0.3);
          text-align: center;
          font-size: 15px;
          line-height: 1;
          transform: rotate(-20deg);
          user-select: none;
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          height: 100%;
          box-sizing: border-box;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          padding: 0 28px 0 0;
          font: 500 8px/1.2 system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .search-box input::-webkit-search-cancel-button {
          display: none;
        }

        .clear-search {
          position: absolute;
          right: 6px;
          top: 50%;
          width: 22px;
          height: 22px;
          transform: translateY(-50%);
          border: 0;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          line-height: 1;
          cursor: pointer;
        }

        .status-select {
          position: relative;
          flex: 0 0 auto;
        }

        .status-select span {
          position: absolute;
          left: 9px;
          top: 5px;
          z-index: 1;
          color: rgba(255, 255, 255, 0.22);
          font-size: 5px;
          line-height: 1;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          pointer-events: none;
        }

        .status-select select {
          width: 112px;
          height: 38px;
          box-sizing: border-box;
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          background: #101010;
          color: rgba(255, 255, 255, 0.72);
          padding: 12px 22px 2px 9px;
          outline: none;
          font: 750 7px/1.2 system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          cursor: pointer;
        }

        .status-select::after {
          content: "⌄";
          position: absolute;
          right: 8px;
          bottom: 7px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 10px;
          pointer-events: none;
        }

        .toolbar-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 0 0 auto;
        }

        .result-count {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 7px;
          font-weight: 700;
          white-space: nowrap;
        }

        .result-count i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
        }

        .export-button {
          min-height: 32px;
          padding: 0 9px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          background: #101010;
          color: rgba(255, 255, 255, 0.3);
          font: 750 6.5px system-ui, sans-serif;
          cursor: not-allowed;
          opacity: 0.65;
        }

        @media (max-width: 720px) {
          .legal-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .toolbar-main {
            width: 100%;
          }

          .toolbar-meta {
            width: 100%;
            justify-content: space-between;
          }

          .result-count {
            font-size: 7px;
          }

          .export-button {
            min-height: 34px;
            padding: 0 11px;
          }
        }

        @media (max-width: 430px) {
          .toolbar-main {
            align-items: stretch;
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .status-select,
          .status-select select {
            width: 100%;
          }

          .status-select select {
            height: 36px;
          }

          .export-button {
            flex: 0 0 auto;
          }
        }

        @media (max-width: 340px) {
          .toolbar-meta {
            align-items: center;
          }

          .export-button {
            padding: 0 8px;
          }
        }
      `}</style>
    </section>
  );
}