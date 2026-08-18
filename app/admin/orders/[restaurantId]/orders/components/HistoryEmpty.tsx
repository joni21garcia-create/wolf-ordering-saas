"use client";

export default function HistoryEmpty() {
  return (
    <section className="empty">

      <div className="empty-icon">
        📂
      </div>

      <div className="empty-eyebrow">
        HISTORIAL DE PEDIDOS
      </div>

      <h2>
        No se encontraron pedidos
      </h2>

      <p>
        Intenta cambiar los filtros, ampliar el rango de fechas o limpiar
        la búsqueda para visualizar pedidos del historial.
      </p>


      <style jsx>{`

        .empty {
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;

          min-height:260px;

          padding:40px 24px;

          text-align:center;

          border-radius:20px;

          border:
            1px solid rgba(255,255,255,.07);

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.04),
              rgba(255,255,255,.015)
            );
        }


        .empty-icon {
          width:72px;
          height:72px;

          display:grid;
          place-items:center;

          margin-bottom:16px;

          border-radius:18px;

          border:
            1px solid rgba(249,115,22,.12);

          background:
            rgba(249,115,22,.06);

          font-size:34px;
        }


        .empty-eyebrow {
          margin-bottom:7px;

          color:#f97316;

          font-size:9px;
          font-weight:800;

          letter-spacing:1.4px;

          text-transform:uppercase;
        }


        h2 {
          margin:0;

          color:#fff;

          font-size:22px;
          line-height:1.2;

          font-weight:800;

          letter-spacing:-.4px;
        }


        p {
          max-width:520px;

          margin:10px auto 0;

          color:#777;

          font-size:12px;

          line-height:1.6;
        }


        @media(max-width:600px) {

          .empty {
            min-height:220px;

            padding:32px 18px;

            border-radius:16px;
          }


          .empty-icon {
            width:62px;
            height:62px;

            margin-bottom:14px;

            border-radius:15px;

            font-size:29px;
          }


          h2 {
            font-size:19px;
          }


          p {
            font-size:11px;
            line-height:1.55;
          }

        }

      `}</style>

    </section>
  );
}