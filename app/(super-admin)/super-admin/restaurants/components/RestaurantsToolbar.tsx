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
    <section className="toolbar" aria-label="Buscar y filtrar restaurantes">
      <label className="search">
        <span aria-hidden="true">⌕</span>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar restaurante..."
          aria-label="Buscar restaurante"
        />
        {search && (
          <button
            type="button"
            className="clear"
            onClick={() => onSearch("")}
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </label>

      <div className="controls">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Ordenar restaurantes"
        >
          <option value="recent">Recientes</option>
          <option value="oldest">Antiguos</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>

        <span className="count">
          <i />
          {total}
        </span>
      </div>

      <style jsx>{`
        .toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 9px;
          align-items: center;
          margin-bottom: 14px;
          padding: 9px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 14px;
          background: rgba(14, 14, 14, 0.72);
        }

        .search {
          min-width: 0;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
        }

        .search > span {
          color: #777;
          font-size: 19px;
          line-height: 1;
          transform: rotate(-20deg);
        }

        input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #eee;
          font: inherit;
          font-size: 11px;
        }

        input::placeholder {
          color: #555;
        }

        .clear {
          border: 0;
          background: transparent;
          color: #777;
          cursor: pointer;
          font-size: 17px;
          line-height: 1;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        select {
          height: 38px;
          max-width: 92px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 10px;
          padding: 0 9px;
          outline: 0;
          background: #111;
          color: #aaa;
          font-size: 10px;
          cursor: pointer;
        }

        .count {
          height: 38px;
          min-width: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
          color: #888;
          font-size: 10px;
        }

        .count i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 7px rgba(34, 197, 94, 0.35);
        }

        @media (max-width: 560px) {
          .toolbar {
            grid-template-columns: 1fr;
            padding: 8px;
            gap: 7px;
            border-radius: 13px;
          }

          .controls {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
          }

          select,
          .count {
            width: 100%;
            max-width: none;
          }
        }

        @media (max-width: 380px) {
          .toolbar {
            margin-bottom: 12px;
            background: rgba(14, 14, 14, 0.58);
          }

          .search,
          select,
          .count {
            height: 36px;
          }

          select {
            font-size: 9px;
          }
        }
      `}</style>
    </section>
  );
}