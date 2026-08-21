"use client";

interface Props {
  restaurantName: string;
  logoUrl: string | null;
  reviewsUrl: string;
}

export default function GoogleReviewsPreview({
  restaurantName,
  logoUrl,
  reviewsUrl,
}: Props) {
  return (
    <aside className="preview">
      <style jsx>{`
        .preview {
          position: sticky;
          top: 18px;
          min-width: 0;
          padding: 18px;
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              #f97316 0%,
              #ec4899 55%,
              #7c3aed 100%
            );
          box-sizing: border-box;
        }

        .label {
          color: rgba(255, 255, 255, 0.88);
          text-align: center;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .phone {
          width: min(100%, 330px);
          margin: 16px auto 0;
          padding: 28px 18px 22px;
          border-radius: 28px;
          background: #fff;
          color: #18181b;
          box-sizing: border-box;
          text-align: center;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
        }

        .logo {
          width: 76px;
          height: 76px;
          margin: 0 auto 18px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 50%;
          background: #111;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.14);
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fallback {
          font-size: 28px;
        }

        h2 {
          max-width: 100%;
          margin: 0;
          font-size: 25px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          overflow-wrap: anywhere;
        }

        .message {
          margin: 9px 0 4px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.4;
        }

        .stars {
          margin-top: 8px;
          color: #f59e0b;
          font-size: 25px;
          line-height: 1;
          letter-spacing: 3px;
        }

        .google-label {
          margin-top: 8px;
          color: #71717a;
          font-size: 10px;
          font-weight: 700;
        }

        .review-button {
          width: 100%;
          min-height: 48px;
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 13px;
          background: #2563eb;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          box-sizing: border-box;
        }

        .google-icon {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #fff;
          color: #4285f4;
          font-size: 12px;
          font-weight: 1000;
        }

        .disabled {
          background: #e4e4e7;
          color: #a1a1aa;
          cursor: default;
        }

        .bottom-text {
          margin-top: 15px;
          color: #a1a1aa;
          font-size: 10px;
          line-height: 1.4;
        }

        .direct {
          margin-top: 12px;
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
        }

        @media (max-width: 820px) {
          .preview {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 560px) {
          .preview {
            padding: 12px;
            border-radius: 18px;
          }

          .phone {
            width: min(100%, 300px);
            margin-top: 12px;
            padding: 22px 15px 18px;
            border-radius: 22px;
          }

          .logo {
            width: 68px;
            height: 68px;
            margin-bottom: 15px;
          }

          h2 {
            font-size: 21px;
          }

          .message {
            font-size: 12px;
          }

          .stars {
            font-size: 22px;
          }

          .review-button {
            min-height: 46px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="label">
        Vista previa pública
      </div>

      <div className="phone">
        <div className="logo">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={restaurantName || "Restaurante"}
            />
          ) : (
            <span
              className="fallback"
              aria-hidden="true"
            >
              🍽️
            </span>
          )}
        </div>

        <h2>
          {restaurantName || "Tu restaurante"}
        </h2>

        <p className="message">
          ¿Cómo fue tu experiencia?
        </p>

        <div
          className="stars"
          aria-label="Cinco estrellas"
        >
          ★★★★★
        </div>

        <div className="google-label">
          Tu opinión en Google nos ayuda mucho
        </div>

        {reviewsUrl ? (
          <a
            className="review-button"
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="google-icon"
              aria-hidden="true"
            >
              G
            </span>

            Dejar reseña en Google
          </a>
        ) : (
          <span className="review-button disabled">
            Configura el enlace de Google
          </span>
        )}

        <div className="bottom-text">
          El cliente puede entrar directamente a la
          página de reseñas sin escanear ningún QR.
        </div>

        {reviewsUrl && (
          <div className="direct">
            ↗ Enlace directo activo
          </div>
        )}
      </div>
    </aside>
  );
}