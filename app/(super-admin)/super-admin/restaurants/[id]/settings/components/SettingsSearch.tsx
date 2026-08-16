"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SettingsSearch({ value, onChange }: Props) {
  return (
    <section className="search">
      <div className="field">
        <span className="icon" aria-hidden="true">
          ⌕
        </span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar configuración..."
          aria-label="Buscar configuración"
          autoComplete="off"
          spellCheck={false}
        />

        {value && (
          <button
            type="button"
            className="clear"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      <style jsx>{`
        .search {
          width: 100%;
          margin: 0;
        }

        .field {
          position: relative;
          width: 100%;
        }

        .icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 17px;
          line-height: 1;
          pointer-events: none;
        }

        input {
          width: 100%;
          height: 38px;
          box-sizing: border-box;
          padding: 0 36px 0 34px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 10px;
          outline: none;
          background: rgba(255, 255, 255, 0.025);
          color: #e8e8e8;
          font: inherit;
          font-size: 10px;
          -webkit-appearance: none;
          transition:
            border-color 0.16s ease,
            background 0.16s ease;
        }

        input::placeholder {
          color: #555;
        }

        input:focus {
          border-color: rgba(255, 145, 75, 0.28);
          background: rgba(255, 255, 255, 0.035);
        }

        .clear {
          position: absolute;
          right: 8px;
          top: 50%;
          width: 23px;
          height: 23px;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          padding: 0;
          border: 0;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.05);
          color: #888;
          font: inherit;
          font-size: 15px;
          line-height: 1;
          cursor: pointer;
        }

        .clear:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ddd;
        }

        @media (max-width: 430px) {
          input {
            height: 40px;
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
}