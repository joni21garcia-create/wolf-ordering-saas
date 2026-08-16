"use client";

export default function SettingsFooter() {
  return (
    <footer className="footer">
      <div className="brand">
        <span className="wolf" aria-hidden="true">
          🐺
        </span>

        <div>
          <strong>Wolf Ordering SaaS</strong>
          <span>Restaurant Settings · v2</span>
        </div>
      </div>

      <span className="status">
        <i />
        Sistema operativo
      </span>

      <style jsx>{`
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 18px;
          padding: 10px 2px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .wolf {
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: rgba(255, 106, 0, 0.07);
          font-size: 12px;
        }

        .brand div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .brand strong {
          color: #777;
          font-size: 8px;
          font-weight: 750;
        }

        .brand span {
          color: #4f4f4f;
          font-size: 7px;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #555;
          font-size: 7px;
          font-weight: 650;
          white-space: nowrap;
        }

        .status i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34, 197, 94, 0.35);
        }

        @media (max-width: 430px) {
          .footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}