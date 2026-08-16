"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function LocationSection({
  form,
  setForm,
}: Props) {
  return (
    <>
      <section className="location-section">
        <div className="location-fields">
          {/* Dirección */}
          <div className="location-field location-address">
            <label>Dirección</label>

            <input
              className="location-input"
              placeholder="Av. Principal 123..."
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />
          </div>

          {/* Latitud */}
          <div className="location-field">
            <label>Latitud</label>

            <input
              className="location-input"
              placeholder="-0.229850"
              value={form.latitude}
              onChange={(e) =>
                setForm({
                  ...form,
                  latitude: e.target.value,
                })
              }
            />
          </div>

          {/* Longitud */}
          <div className="location-field">
            <label>Longitud</label>

            <input
              className="location-input"
              placeholder="-78.524950"
              value={form.longitude}
              onChange={(e) =>
                setForm({
                  ...form,
                  longitude: e.target.value,
                })
              }
            />
          </div>

          {/* Vista futura */}
          <div className="location-map-placeholder">
            <span className="location-map-icon" aria-hidden="true">
              📍
            </span>

            <span>
              Aquí se integrará el selector visual de Google Maps para
              obtener automáticamente la dirección y coordenadas del
              restaurante.
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .location-section {
          display: grid;
          gap: 26px;
          min-width: 0;
        }

        .location-intro {
          min-width: 0;
        }

        .location-intro h2 {
          color: #fff;
          font-size: 30px;
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .location-intro p {
          color: #8b8b8b;
          line-height: 1.8;
          margin: 0;
          max-width: 720px;
        }

        .location-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          min-width: 0;
        }

        .location-field {
          min-width: 0;
        }

        .location-address,
        .location-map-placeholder {
          grid-column: 1 / span 2;
        }

        .location-field label {
          display: block;
          color: #fff;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .location-input {
          display: block;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 15px 18px;
          border-radius: 14px;
          background: #0f0f0f;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          outline: none;
          font-size: 15px;
          line-height: 1.4;
        }

        .location-input::placeholder {
          color: #777;
        }

        .location-input:focus {
          border-color: rgba(249, 115, 22, 0.5);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
        }

        .location-map-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 0;
          margin-top: 12px;
          padding: 24px;
          box-sizing: border-box;
          border-radius: 18px;
          border: 1px dashed rgba(249, 115, 22, 0.35);
          background: rgba(249, 115, 22, 0.05);
          color: #9ca3af;
          text-align: center;
          line-height: 1.8;
        }

        .location-map-icon {
          flex: 0 0 auto;
        }

        @media (max-width: 640px) {
          .location-section {
            gap: 20px;
          }

          .location-intro h2 {
            font-size: clamp(25px, 7vw, 30px);
          }

          .location-intro p {
            font-size: 14px;
            line-height: 1.65;
          }

          .location-fields {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }

          .location-address,
          .location-map-placeholder {
            grid-column: auto;
          }

          .location-field label {
            margin-bottom: 8px;
          }

          .location-input {
            min-height: 52px;
            padding: 14px 15px;
            border-radius: 14px;
            font-size: 16px;
          }

          .location-map-placeholder {
            flex-direction: column;
            gap: 7px;
            margin-top: 4px;
            padding: 18px 15px;
            border-radius: 15px;
            font-size: 13px;
            line-height: 1.6;
          }
        }
      `}</style>
    </>
  );
}