"use client";

interface Props {
  reviewsUrl?: string | null;
  enabled?: boolean | null;
}

function GoogleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.73-.06-1.27-.2-1.83H12v3.46h5.38a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.74-4.27 2.74-7.15Z"
      />
      <path
        fill="#34A853"
        d="M12 21.67c2.7 0 4.97-.9 6.62-2.45l-3.22-2.5c-.9.6-2.05.96-3.4.96-2.61 0-4.83-1.76-5.62-4.13H3.05v2.58A10 10 0 0 0 12 21.67Z"
      />
      <path
        fill="#FBBC05"
        d="M6.38 13.55A6.02 6.02 0 0 1 6.05 12c0-.54.11-1.06.33-1.55V7.87H3.05A9.99 9.99 0 0 0 2 12c0 1.61.39 3.13 1.05 4.13l3.33-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.32c1.47 0 2.78.5 3.82 1.5l2.87-2.87C16.96 3.36 14.7 2.33 12 2.33a10 10 0 0 0-8.95 5.54l3.33 2.58C7.17 8.08 9.39 6.32 12 6.32Z"
      />
    </svg>
  );
}

export default function GoogleReviewButton({
  reviewsUrl,
  enabled,
}: Props) {
  if (!enabled || !reviewsUrl) return null;

  return (
    <a
      href={reviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="google-review-button"
      aria-label="Califícanos en Google"
    >
      <span className="google-mark">
        <GoogleIcon />
      </span>

      <span className="review-copy">
        <span className="review-title">Califícanos en Google</span>
        <span className="review-stars" aria-label="Cinco estrellas">
          ★★★★★
        </span>
      </span>

      <span className="review-arrow" aria-hidden="true">
        →
      </span>

      <style jsx>{`
        .google-review-button {
          width: fit-content;
          max-width: 100%;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 12px 7px 8px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.28);
          color: inherit;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition:
            transform 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .google-review-button:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .google-review-button:active {
          transform: translateY(0);
        }

        .google-mark {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #fff;
        }

        .review-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .review-title {
          color: #fff;
          font-size: 11px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .review-stars {
          color: #fbbc04;
          font-size: 12px;
          line-height: 1;
          letter-spacing: 1px;
        }

        .review-arrow {
          margin-left: 3px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 17px;
          line-height: 1;
        }

        @media (max-width: 560px) {
          .google-review-button {
            min-height: 46px;
            padding-right: 10px;
            border-radius: 14px;
          }

          .google-mark {
            width: 30px;
            height: 30px;
            flex-basis: 30px;
          }

          .review-title {
            font-size: 10px;
          }

          .review-stars {
            font-size: 11px;
          }
        }
      `}</style>
    </a>
  );
}
