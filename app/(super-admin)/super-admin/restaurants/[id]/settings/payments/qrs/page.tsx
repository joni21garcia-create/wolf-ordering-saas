"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";

interface PaymentQR {
  id: string;
  restaurant_id: string;
  name: string;
  qr_image_url: string;
  account_holder: string | null;
  account_number: string | null;
  active: boolean;
  sort_order: number;
}

export default function PaymentQRsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [qrs, setQrs] = useState<PaymentQR[]>([]);
  const [openQR, setOpenQR] = useState<string | null>(null);

  useEffect(() => {
    loadQRs();
  }, []);

  const loadQRs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurant_payment_qrs")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setQrs((data || []) as PaymentQR[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQR = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("restaurant_payment_qrs")
      .update({ active: !current })
      .eq("id", id);

    if (error) return alert("Error actualizando QR");
    loadQRs();
  };

  const deleteQR = async (id: string) => {
    if (!confirm("¿Eliminar este QR permanentemente?")) return;
    const { error } = await supabase
      .from("restaurant_payment_qrs")
      .delete()
      .eq("id", id);

    if (error) return alert("Error eliminando QR");
    loadQRs();
  };

  return (
    <main className="qr-page">
      <div className="qr-shell">
        <header className="qr-header">
          <BackToSettings restaurantId={restaurantId} />

          <div className="header-row">
            <div>
              <span className="eyebrow">PAGOS · QR</span>
              <h1>QRs de Pago</h1>
              <p>Administra tus códigos QR desde el móvil.</p>
            </div>

            <Link
              href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`}
              className="new-qr"
            >
              <span>＋</span>
              Nuevo
            </Link>
          </div>
        </header>

        <div className="summary">
          <div>
            <strong>{qrs.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{qrs.filter((q) => q.active).length}</strong>
            <span>Activos</span>
          </div>
          <div>
            <strong>{qrs.filter((q) => !q.active).length}</strong>
            <span>Ocultos</span>
          </div>
        </div>

        {loading ? (
          <div className="state">Cargando QRs...</div>
        ) : qrs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">▦</div>
            <strong>No hay QRs configurados</strong>
            <small>
              Agrega un código QR para facilitar el pago de tus clientes.
            </small>
            <Link
              href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`}
              className="empty-button"
            >
              Crear primer QR
            </Link>
          </div>
        ) : (
          <div className="qr-list">
            {qrs.map((qr) => {
              const isOpen = openQR === qr.id;

              return (
                <section
                  key={qr.id}
                  className={`qr-item ${isOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="qr-head"
                    onClick={() => setOpenQR(isOpen ? null : qr.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="qr-thumb">
                      <img src={qr.qr_image_url} alt="" />
                    </div>

                    <div className="qr-copy">
                      <div className="qr-title-row">
                        <strong>{qr.name}</strong>
                        <span className={qr.active ? "pill active" : "pill hidden"}>
                          {qr.active ? "ACTIVO" : "OCULTO"}
                        </span>
                      </div>

                      <small>
                        {qr.account_holder || "Sin titular"}
                        {qr.account_number
                          ? ` · ••••${qr.account_number.slice(-4)}`
                          : ""}
                      </small>
                    </div>

                    <span className="chevron">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="qr-body">
                      <div className="qr-preview">
                        <img src={qr.qr_image_url} alt={qr.name} />
                      </div>

                      <div className="details">
                        <div>
                          <span>Titular</span>
                          <strong>{qr.account_holder || "—"}</strong>
                        </div>
                        <div>
                          <span>Cuenta</span>
                          <strong>{qr.account_number || "—"}</strong>
                        </div>
                      </div>

                      <div className="qr-actions">
                        <button
                          type="button"
                          className="toggle-action"
                          onClick={() => toggleQR(qr.id, qr.active)}
                        >
                          <span className={qr.active ? "mini-switch on" : "mini-switch"}>
                            <i />
                          </span>
                          {qr.active ? "Ocultar QR" : "Mostrar QR"}
                        </button>

                        <Link
                          href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/${qr.id}/edit`}
                          className="edit-action"
                        >
                          ✎ Editar
                        </Link>

                        <button
                          type="button"
                          className="delete-action"
                          onClick={() => deleteQR(qr.id)}
                        >
                          🗑 Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .qr-page {
          min-height:100dvh;
          width:100%;
          box-sizing:border-box;
          padding:14px 10px 34px;
          background:#080808;
          color:#fff;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }

        .qr-shell {
          width:100%;
          max-width:720px;
          margin:0 auto;
        }

        .qr-header {
          margin-bottom:9px;
        }

        .header-row {
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:8px;
          margin-top:8px;
        }

        .eyebrow {
          display:block;
          color:#f97316;
          font-size:7px;
          font-weight:900;
          letter-spacing:1.2px;
        }

        .header-row h1 {
          margin:2px 0 0;
          font-size:23px;
          line-height:1.05;
          letter-spacing:-.55px;
          font-weight:900;
        }

        .header-row p {
          margin:4px 0 0;
          color:rgba(255,255,255,.34);
          font-size:8px;
        }

        .new-qr {
          min-height:31px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:3px;
          padding:0 10px;
          border:1px solid rgba(249,115,22,.2);
          border-radius:8px;
          background:#f97316;
          color:#fff;
          text-decoration:none;
          font-size:8px;
          font-weight:850;
          white-space:nowrap;
        }

        .new-qr span {
          font-size:13px;
          line-height:1;
        }

        .summary {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:5px;
          margin:10px 0 7px;
        }

        .summary div {
          padding:8px 5px;
          border:1px solid rgba(255,255,255,.05);
          border-radius:9px;
          background:#101010;
          text-align:center;
        }

        .summary strong {
          display:block;
          color:#f97316;
          font-size:14px;
          line-height:1;
        }

        .summary span {
          display:block;
          margin-top:3px;
          color:rgba(255,255,255,.27);
          font-size:6px;
          font-weight:700;
          letter-spacing:.4px;
          text-transform:uppercase;
        }

        .qr-list {
          display:flex;
          flex-direction:column;
          gap:5px;
        }

        .qr-item {
          overflow:hidden;
          border:1px solid rgba(255,255,255,.055);
          border-radius:10px;
          background:#101010;
        }

        .qr-item.open {
          border-color:rgba(249,115,22,.18);
        }

        .qr-head {
          width:100%;
          min-height:58px;
          display:flex;
          align-items:center;
          gap:8px;
          padding:7px;
          border:0;
          background:transparent;
          color:#fff;
          text-align:left;
          cursor:pointer;
        }

        .qr-thumb {
          width:42px;
          height:42px;
          display:grid;
          place-items:center;
          flex-shrink:0;
          overflow:hidden;
          border-radius:7px;
          background:#fff;
        }

        .qr-thumb img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .qr-copy {
          min-width:0;
          flex:1;
        }

        .qr-title-row {
          display:flex;
          align-items:center;
          gap:5px;
          min-width:0;
        }

        .qr-title-row strong {
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size:9px;
          font-weight:850;
        }

        .qr-copy > small {
          display:block;
          margin-top:3px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          color:rgba(255,255,255,.25);
          font-size:6.5px;
        }

        .pill {
          flex-shrink:0;
          padding:2px 4px;
          border-radius:999px;
          font-size:5px;
          font-weight:900;
          letter-spacing:.3px;
        }

        .pill.active {
          background:rgba(34,197,94,.08);
          color:#22c55e;
          border:1px solid rgba(34,197,94,.14);
        }

        .pill.hidden {
          background:rgba(239,68,68,.07);
          color:#ef4444;
          border:1px solid rgba(239,68,68,.13);
        }

        .chevron {
          width:24px;
          height:24px;
          display:grid;
          place-items:center;
          flex-shrink:0;
          border-radius:7px;
          background:rgba(255,255,255,.035);
          color:rgba(255,255,255,.42);
          font-size:13px;
        }

        .open .chevron {
          color:#f97316;
          background:rgba(249,115,22,.07);
        }

        .qr-body {
          padding:8px;
          border-top:1px solid rgba(255,255,255,.045);
        }

        .qr-preview {
          width:100%;
          height:160px;
          display:grid;
          place-items:center;
          overflow:hidden;
          border-radius:8px;
          background:#fff;
        }

        .qr-preview img {
          width:145px;
          height:145px;
          object-fit:contain;
        }

        .details {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:5px;
          margin-top:6px;
        }

        .details div {
          min-width:0;
          padding:7px;
          border-radius:7px;
          background:rgba(255,255,255,.025);
        }

        .details span {
          display:block;
          color:rgba(255,255,255,.2);
          font-size:6px;
          text-transform:uppercase;
          letter-spacing:.35px;
        }

        .details strong {
          display:block;
          margin-top:3px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          color:rgba(255,255,255,.62);
          font-size:7.5px;
        }

        .qr-actions {
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          gap:4px;
          margin-top:6px;
        }

        .qr-actions button,
        .qr-actions a {
          min-height:32px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:3px;
          box-sizing:border-box;
          border-radius:7px;
          font:800 7px system-ui,sans-serif;
          text-decoration:none;
          cursor:pointer;
        }

        .toggle-action {
          border:1px solid rgba(255,255,255,.06);
          background:rgba(255,255,255,.025);
          color:rgba(255,255,255,.56);
        }

        .edit-action {
          border:1px solid rgba(249,115,22,.15);
          background:rgba(249,115,22,.055);
          color:#f97316;
        }

        .delete-action {
          border:1px solid rgba(239,68,68,.13);
          background:rgba(239,68,68,.045);
          color:#ef4444;
        }

        .mini-switch {
          width:25px;
          height:14px;
          display:inline-flex;
          align-items:center;
          padding:2px;
          box-sizing:border-box;
          border-radius:999px;
          background:#303030;
        }

        .mini-switch i {
          width:10px;
          height:10px;
          display:block;
          border-radius:50%;
          background:#fff;
          transition:transform .15s;
        }

        .mini-switch.on {
          background:#16a34a;
        }

        .mini-switch.on i {
          transform:translateX(11px);
        }

        .empty {
          padding:28px 15px;
          border:1px dashed rgba(255,255,255,.07);
          border-radius:10px;
          background:#101010;
          text-align:center;
        }

        .empty-icon {
          width:38px;
          height:38px;
          display:grid;
          place-items:center;
          margin:0 auto 7px;
          border-radius:10px;
          background:rgba(249,115,22,.07);
          color:#f97316;
          font-size:17px;
        }

        .empty strong {
          display:block;
          color:rgba(255,255,255,.6);
          font-size:9px;
        }

        .empty small {
          display:block;
          max-width:280px;
          margin:4px auto 10px;
          color:rgba(255,255,255,.25);
          font-size:7px;
          line-height:1.45;
        }

        .empty-button {
          min-height:32px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 11px;
          border-radius:7px;
          background:#f97316;
          color:#fff;
          text-decoration:none;
          font-size:8px;
          font-weight:850;
        }

        .state {
          padding:35px 10px;
          color:rgba(255,255,255,.28);
          text-align:center;
          font-size:8px;
        }

        @media(max-width:390px) {
          .qr-page {
            padding-left:8px;
            padding-right:8px;
          }

          .qr-actions {
            grid-template-columns:1fr;
          }

          .qr-preview {
            height:145px;
          }
        }
      `}</style>
    </main>
  );
  }