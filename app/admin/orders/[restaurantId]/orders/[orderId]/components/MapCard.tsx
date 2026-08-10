interface Props {
  order: any;
}

export default function MapCard({ order }: Props) {
  const address =
    order.delivery_address &&
    order.delivery_address !== "EMPTY"
      ? order.delivery_address
      : null;

  const sector =
    order.delivery_sector &&
    order.delivery_sector !== "EMPTY"
      ? order.delivery_sector
      : null;

  const mapUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`
    : null;

  return (
    <section className="map-native">
      <style>{`
        .map-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .map-header {
          padding: 2px 0 20px;
        }

        .map-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .map-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           LOCATION
        ========================================== */

        .map-location {
          display: flex;
          align-items: flex-start;
          gap: 14px;

          padding: 18px 0;

          border-top:
            1px solid rgba(255,255,255,.07);

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .map-pin {
          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(249,115,22,.08);

          color: #f97316;
        }

        .map-pin svg {
          width: 17px;
          height: 17px;
        }

        .map-address {
          min-width: 0;
        }

        .map-label {
          margin-bottom: 5px;

          color: #555;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .map-address-value {
          color: #eee;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.45;

          overflow-wrap: anywhere;
        }

        .map-sector {
          margin-top: 5px;

          color: #666;
          font-size: 12px;
        }

        /* ==========================================
           MAP PREVIEW
        ========================================== */

        .map-preview {
          position: relative;

          height: 190px;

          margin-top: 18px;

          overflow: hidden;

          border-radius: 18px;

          border:
            1px solid rgba(255,255,255,.06);

          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(249,115,22,.07),
              transparent 26%
            ),
            linear-gradient(
              135deg,
              #0d0d0d,
              #151515
            );
        }

        .map-grid {
          position: absolute;
          inset: 0;

          opacity: .32;

          background-image:
            linear-gradient(
              rgba(255,255,255,.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.045) 1px,
              transparent 1px
            );

          background-size:
            42px 42px;
        }

        .map-road {
          position: absolute;

          width: 150%;
          height: 1px;

          left: -25%;

          background:
            rgba(255,255,255,.07);

          transform: rotate(-13deg);
        }

        .map-road-one {
          top: 37%;
        }

        .map-road-two {
          top: 63%;

          transform:
            rotate(17deg);
        }

        .map-center {
          position: absolute;

          top: 50%;
          left: 50%;

          width: 52px;
          height: 52px;

          transform:
            translate(-50%, -50%);

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(249,115,22,.10);

          box-shadow:
            0 0 0 8px
              rgba(249,115,22,.035);
        }

        .map-center-dot {
          width: 13px;
          height: 13px;

          border-radius: 50%;

          background: #f97316;

          box-shadow:
            0 0 0 5px
              rgba(249,115,22,.14);
        }

        /* ==========================================
           ACTION
        ========================================== */

        .map-action {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          margin-top: 14px;

          padding: 15px 2px;

          color: #ddd;

          text-decoration: none;

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .map-action-text {
          font-size: 13px;
          font-weight: 650;
        }

        .map-action-chevron {
          color: #555;
          font-size: 21px;
        }

        .map-action:hover
        .map-action-text {
          color: #fff;
        }

        /* ==========================================
           EMPTY
        ========================================== */

        .map-empty {
          padding: 34px 4px;

          color: #666;

          font-size: 13px;
          line-height: 1.5;

          text-align: center;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .map-title {
            font-size: 20px;
          }

          .map-preview {
            height: 175px;
            border-radius: 16px;
          }

          .map-address-value {
            font-size: 14px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="map-header">
        <h2 className="map-title">
          Ubicación
        </h2>

        <div className="map-subtitle">
          Dirección de entrega del pedido
        </div>
      </div>

      {!address ? (
        <div className="map-empty">
          No existe una ubicación registrada
          para este pedido.
        </div>
      ) : (
        <>
          {/* LOCATION */}

          <div className="map-location">
            <div className="map-pin">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                />
              </svg>
            </div>

            <div className="map-address">
              <div className="map-label">
                Dirección
              </div>

              <div className="map-address-value">
                {address}
              </div>

              {sector && (
                <div className="map-sector">
                  {sector}
                </div>
              )}
            </div>
          </div>

          {/* VISUAL MAP */}

          <div className="map-preview">
            <div className="map-grid" />

            <div
              className="map-road map-road-one"
            />

            <div
              className="map-road map-road-two"
            />

            <div className="map-center">
              <div className="map-center-dot" />
            </div>
          </div>

          {/* OPEN MAP */}

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-action"
            >
              <span className="map-action-text">
                Abrir ubicación en Google Maps
              </span>

              <span className="map-action-chevron">
                ›
              </span>
            </a>
          )}
        </>
      )}
    </section>
  );
}