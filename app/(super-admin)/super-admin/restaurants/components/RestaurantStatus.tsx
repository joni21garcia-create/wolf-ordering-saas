 "use client";

type Props = {
  active: boolean;
};

export default function RestaurantStatus({ active }: Props) {
  return (
    <span className={`status ${active ? "active" : "inactive"}`}>
      <span className="dot" aria-hidden="true" />
      {active ? "Activo" : "Inactivo"}

      <style jsx>{`
        .status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          font-size: 9px;
          font-weight: 700;
          line-height: 1;
        }

        .dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
        }

        .active {
          color: #4ade80;
        }

        .active .dot {
          background: #22c55e;
          box-shadow: 0 0 7px rgba(34, 197, 94, 0.38);
        }

        .inactive {
          color: #f87171;
        }

        .inactive .dot {
          background: #ef4444;
          box-shadow: 0 0 7px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </span>
  );
}