"use client";

interface GoogleButtonProps {
  onClick: () => void;
}

export default function GoogleButton({
  onClick,
}: GoogleButtonProps) {
  return (
    <>
      <style jsx>{`
        .google-button {
          position: relative;
          width: 100%;
          height: 56px;

          margin-top: 14px;

          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.09);

          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.025)
            );

          color: #fff;
          cursor: pointer;

          font-size: 15px;
          font-weight: 600;

          display: flex;
          justify-content: center;
          align-items: center;
          gap: 11px;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.06),
            0 8px 24px rgba(0,0,0,.18);

          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .google-button:hover {
          transform: translateY(-1px);

          border-color: rgba(255,255,255,.16);

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.075),
              rgba(255,255,255,.035)
            );

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.08),
            0 12px 28px rgba(0,0,0,.25);
        }

        .google-button:active {
          transform: translateY(0);
        }

        .google-icon {
          width: 19px;
          height: 19px;
          display: block;
        }
      `}</style>

      <button
        onClick={onClick}
        type="button"
        className="google-button"
      >
        <img
          className="google-icon"
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={19}
          height={19}
        />

        <span>Continuar con Google</span>
      </button>
    </>
  );
}