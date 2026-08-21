 "use client";

interface Props {
  title?: string;
  description?: string;
}

export default function AnalyticsEmpty({
  title = "No existen datos para mostrar",
  description = "No se encontraron pedidos con los filtros seleccionados. Modifica el rango de fechas o elimina los filtros para visualizar información.",
}: Props) {
  return (
    <section className="empty-state">
      <style jsx>{`
        .empty-state {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 360px;
          padding: 56px 28px;
          text-align: center;
          background: linear-gradient(180deg, #141414, #0a0a0a);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
        }

        .icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 18px;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.14);
          font-size: 32px;
        }

        .title {
          margin: 0;
          max-width: 640px;
          color: #fff;
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 800;
          line-height: 1.1;
        }

        .description {
          margin: 14px auto 0;
          max-width: 600px;
          color: #888;
          font-size: 14px;
          line-height: 1.65;
        }

        @media (max-width: 560px) {
          .empty-state {
            min-height: 300px;
            padding: 40px 18px;
            border-radius: 18px;
          }

          .icon {
            width: 56px;
            height: 56px;
            margin-bottom: 15px;
            border-radius: 16px;
            font-size: 28px;
          }

          .description {
            font-size: 13px;
            line-height: 1.55;
          }
        }
      `}</style>

      <div className="icon" aria-hidden="true">
        📊
      </div>

      <h2 className="title">{title}</h2>

      <p className="description">{description}</p>
    </section>
  );
}