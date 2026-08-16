"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;
  /**
   * When rendered inside WolfMobileAccordion, the accordion owns
   * the section header. This prevents a card/header inside a card.
   */
  embedded?: boolean;
}

export default function GeneralSection({
  form,
  setForm,
  embedded = false,
}: Props) {
  return (
    <section className={`general-section ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <header className="general-header">
          <div className="general-step">01</div>

          <div className="general-heading">
            <h2>Información General</h2>
            <p>
              Datos básicos para identificar el restaurante dentro de Wolf
              Ordering.
            </p>
          </div>
        </header>
      )}

      <div className="general-fields">
        {/* Nombre */}
        <div className="field">
          <label style={label}>Nombre del restaurante</label>

          <input
            style={input}
            placeholder="Restaurante Demo"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* Slug */}
        <div className="field">
          <div className="label-row">
            <label style={label}>Slug</label>
            <span className="field-hint">URL pública</span>
          </div>

          <input
            style={input}
            placeholder="restaurante-demo"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
          />
        </div>

        {/* Descripción */}
        <div className="description-field">
          <div className="label-row">
            <label style={label}>Descripción</label>
            <span className="field-hint">Opcional</span>
          </div>

          <textarea
            style={{
              ...input,
              resize: "vertical",
              minHeight: 124,
            }}
            placeholder="Describe brevemente el restaurante..."
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      <style jsx>{`
        .general-section {
          display: grid;
          gap: clamp(18px, 3vw, 26px);
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .general-section.embedded {
          gap: 16px;
        }

        .general-header {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          align-items: start;
          gap: 14px;
          min-width: 0;
        }

        .general-step {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(255, 107, 0, 0.09);
          border: 1px solid rgba(255, 107, 0, 0.16);
          color: #ff6b00;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .general-heading {
          min-width: 0;
        }

        .general-heading h2 {
          margin: 0 0 6px;
          color: #fff;
          font-size: clamp(21px, 5.5vw, 30px);
          line-height: 1.08;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .general-heading p {
          margin: 0;
          max-width: 620px;
          color: #8b8b8b;
          font-size: 13px;
          line-height: 1.55;
        }

        .general-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          min-width: 0;
        }

        .field,
        .description-field {
          min-width: 0;
          width: 100%;
        }

        .description-field {
          grid-column: 1 / -1;
        }

        .label-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          min-width: 0;
        }

        .field-hint {
          color: #656565;
          font-size: 10px;
          line-height: 1;
          white-space: nowrap;
        }

        .field :global(input),
        .description-field :global(textarea) {
          display: block;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 700px) {
          .general-section {
            gap: 17px;
          }

          .general-section.embedded {
            gap: 13px;
          }

          .general-header {
            grid-template-columns: 36px minmax(0, 1fr);
            gap: 11px;
          }

          .general-step {
            width: 36px;
            height: 36px;
            border-radius: 11px;
            font-size: 10px;
          }

          .general-heading h2 {
            font-size: 23px;
            line-height: 1.08;
          }

          .general-heading p {
            font-size: 11px;
            line-height: 1.5;
          }

          .general-fields {
            grid-template-columns: minmax(0, 1fr);
            gap: 14px;
          }

          .description-field {
            grid-column: auto;
          }

        }

        @media (max-width: 420px) {
          .general-section {
            gap: 15px;
          }

          .general-header {
            grid-template-columns: 32px minmax(0, 1fr);
            gap: 9px;
          }

          .general-step {
            width: 32px;
            height: 32px;
            border-radius: 10px;
          }

          .general-heading h2 {
            font-size: 21px;
          }

          .general-heading p {
            font-size: 10.5px;
          }

          .general-fields {
            gap: 12px;
          }

          .field-hint {
            font-size: 9px;
          }

        }
      `}</style>
    </section>
  );
}

const label = {
  display: "block",
  color: "#fff",
  fontWeight: 700,
  marginBottom: 10,
};

const input = {
  width: "100%",
  padding: "15px 18px",
  borderRadius: 14,
  background: "#0f0f0f",
  border:
    "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  outline: "none",
  fontSize: 15,
} as const;