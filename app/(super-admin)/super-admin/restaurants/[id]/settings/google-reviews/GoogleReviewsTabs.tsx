"use client";

export type GoogleReviewsSection =
  | "link"
  | "qr"
  | "poster";

interface Props {
  active: GoogleReviewsSection;
  onChange: (
    section: GoogleReviewsSection
  ) => void;
}

const tabs = [
  {
    id: "link",
    label: "Enlace",
    icon: "↗",
  },
  {
    id: "qr",
    label: "Código QR",
    icon: "▦",
  },
  {
    id: "poster",
    label: "Cartel",
    icon: "🖼",
  },
] as const;

export default function GoogleReviewsTabs({
  active,
  onChange,
}: Props) {
  return (
    <nav
      aria-label="Google Reviews"
      className="tabs"
    >
      <style jsx>{`
        .tabs {
          display: flex;
          gap: 6px;
          width: 100%;
          overflow-x: auto;
          padding: 4px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px;
          background:
            rgba(255,255,255,.025);
          scrollbar-width: none;
          box-sizing: border-box;
        }

        .tabs::-webkit-scrollbar {
          display:none;
        }

        button {
          flex: 1 0 auto;
          min-height: 40px;
          padding: 0 16px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:7px;
          border:1px solid transparent;
          border-radius:10px;
          background:transparent;
          color:#777;
          font-size:11px;
          font-weight:800;
          cursor:pointer;
          white-space:nowrap;
          transition:.18s ease;
        }

        button:hover {
          color:#fff;
          background:
            rgba(255,255,255,.05);
        }

        button.active {
          color:#fff;
          border-color:
            rgba(249,115,22,.35);

          background:
            rgba(249,115,22,.12);
        }

        .icon {
          font-size:13px;
        }

        @media(max-width:560px){

          button {
            min-height:38px;
            padding:0 13px;
            font-size:10px;
          }

        }
      `}</style>


      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={
            active === tab.id
              ? "active"
              : ""
          }
          onClick={() =>
            onChange(tab.id)
          }
        >
          <span className="icon">
            {tab.icon}
          </span>

          {tab.label}
        </button>
      ))}
    </nav>
  );
}