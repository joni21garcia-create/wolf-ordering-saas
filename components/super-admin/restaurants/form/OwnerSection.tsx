"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  /**
   * When rendered inside WolfMobileAccordion, the accordion owns
   * the section title. This prevents a title/card inside another card.
   */
  embedded?: boolean;
}

export default function OwnerSection({
  form,
  setForm,
  embedded = false,
}: Props) {
  return (
    <section className={`owner-section ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <div className="owner-header">
          <h2>Propietario</h2>

          <p>
            Esta persona será el responsable administrativo del restaurante y
            quien firmará el Agreement.
          </p>
        </div>
      )}

      <div className="owner-grid">
        <div className="field">
          <label htmlFor="owner-name">Nombre del propietario</label>

          <input
            id="owner-name"
            type="text"
            placeholder="Juan Pérez"
            value={form.owner_name}
            onChange={(e) =>
              setForm({
                ...form,
                owner_name: e.target.value,
              })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="owner-email">Email principal</label>

          <input
            id="owner-email"
            type="email"
            placeholder="correo@empresa.com"
            value={form.owner_email}
            onChange={(e) =>
              setForm({
                ...form,
                owner_email: e.target.value,
              })
            }
          />
        </div>

        <div className="field whatsapp-field">
          <label htmlFor="owner-whatsapp">WhatsApp</label>

          <input
            id="owner-whatsapp"
            type="tel"
            inputMode="tel"
            placeholder="+593..."
            value={form.whatsapp}
            onChange={(e) =>
              setForm({
                ...form,
                whatsapp: e.target.value,
              })
            }
          />
        </div>
      </div>

      <style jsx>{`
        .owner-section {
          width: 100%;
          min-width: 0;
          display: grid;
          gap: 24px;
          box-sizing: border-box;
        }

        .owner-section.embedded {
          gap: 16px;
        }

        .owner-header {
          display: grid;
          gap: 7px;
        }

        .owner-header h2 {
          margin: 0;
          color: #fff;
          font-size: clamp(25px, 5vw, 30px);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .owner-header p {
          max-width: 680px;
          margin: 0;
          color: #8b8b8b;
          font-size: 14px;
          line-height: 1.65;
        }

        .owner-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          min-width: 0;
        }

        .field {
          min-width: 0;
          display: grid;
          gap: 8px;
        }

        .field label {
          color: #fff;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 800;
        }

        .field input {
          width: 100%;
          min-width: 0;
          min-height: 52px;
          box-sizing: border-box;
          padding: 14px 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: #0f0f0f;
          color: #fff;
          outline: none;
          font: inherit;
          font-size: 15px;
          line-height: 1.2;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .field input::placeholder {
          color: #666;
        }

        .field input:focus {
          border-color: rgba(249, 115, 22, 0.55);
          background: #111;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
        }

        .whatsapp-field {
          grid-column: 1 / -1;
        }

        @media (max-width: 700px) {
          .owner-section {
            gap: 18px;
          }

          .owner-section.embedded {
            gap: 14px;
          }

          .owner-header h2 {
            font-size: 25px;
          }

          .owner-header p {
            font-size: 14px;
            line-height: 1.6;
          }

          .owner-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .whatsapp-field {
            grid-column: auto;
          }

          .field {
            gap: 7px;
          }

          .field label {
            font-size: 13px;
          }

          .field input {
            min-height: 50px;
            padding: 13px 14px;
            border-radius: 13px;
            font-size: 16px;
          }
        }

        @media (min-width: 701px) {
          .owner-section.embedded .owner-header h2 {
            font-size: 24px;
          }

          .owner-section.embedded .owner-header p {
            font-size: 13px;
          }
        }

        @media (max-width: 360px) {
          .owner-section {
            gap: 15px;
          }

          .owner-section.embedded {
            gap: 12px;
          }

          .field input {
            min-height: 48px;
          }
        }
      `}</style>
    </section>
  );
}