"use client";

import { useState } from "react";

interface Props {
  order: any;
}

const STATUS_ORDER = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
];

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    nextLabel: string;
  }
> = {
  pending: {
    label: "Pendiente",
    nextLabel: "Aceptar pedido",
  },

  accepted: {
    label: "Aceptado",
    nextLabel: "Comenzar preparación",
  },

  preparing: {
    label: "En preparación",
    nextLabel: "Marcar como listo",
  },

  ready: {
    label: "Listo",
    nextLabel: "Marcar como entregado",
  },

  completed: {
    label: "Entregado",
    nextLabel: "Pedido completado",
  },

  cancelled: {
    label: "Cancelado",
    nextLabel: "Pedido cancelado",
  },
};

export default function OrderActionCenter({
  order,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const currentStatus =
    order.status ?? "pending";

  const config =
    STATUS_CONFIG[currentStatus] ??
    STATUS_CONFIG.pending;

  const currentIndex =
    STATUS_ORDER.indexOf(
      currentStatus
    );

  const nextStatus =
    currentIndex >= 0 &&
    currentIndex <
      STATUS_ORDER.length - 1
      ? STATUS_ORDER[
          currentIndex + 1
        ]
      : null;

  const isFinished =
    currentStatus ===
      "completed" ||
    currentStatus ===
      "cancelled";

  async function changeStatus(
    status: string
  ) {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(
        "/api/orders/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ??
            "No fue posible actualizar el pedido."
        );

        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible actualizar el pedido."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="action-native">
      <style>{`
        .action-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .action-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding:
            17px
            0
            16px;

          border-top:
            1px solid rgba(255,255,255,.07);

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .action-heading {
          color: #555;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .action-current {
          display: flex;
          align-items: center;

          gap: 8px;

          margin-top: 5px;

          color: #ddd;

          font-size: 14px;
          font-weight: 650;
        }

        .action-dot {
          width: 7px;
          height: 7px;

          flex: 0 0 7px;

          border-radius: 50%;

          background: #f97316;

          box-shadow:
            0 0 0 4px
              rgba(249,115,22,.08);
        }

        /* ==========================================
           PRIMARY ACTION
        ========================================== */

        .action-primary {
          display: flex;
          align-items: center;
          justify-content: space-between;

          width: 100%;

          margin-top: 14px;
          padding: 15px 2px;

          border: 0;
          border-bottom:
            1px solid rgba(255,255,255,.07);

          background: transparent;

          color: #f97316;

          font-size: 14px;
          font-weight: 700;

          text-align: left;

          cursor: pointer;

          transition:
            color .18s ease,
            padding .18s ease;
        }

        .action-primary:hover:not(:disabled) {
          padding-left: 4px;
          color: #fb923c;
        }

        .action-primary:active:not(:disabled) {
          transform: scale(.995);
        }

        .action-primary:disabled {
          cursor: default;
          opacity: .45;
        }

        .action-primary-label {
          display: flex;
          align-items: center;

          gap: 9px;
        }

        .action-primary-arrow {
          color: #555;

          font-size: 20px;
          font-weight: 400;

          transition:
            transform .18s ease,
            color .18s ease;
        }

        .action-primary:hover
        .action-primary-arrow {
          transform: translateX(3px);
          color: #888;
        }

        /* ==========================================
           STATUS TRACK
        ========================================== */

        .status-track {
          display: flex;
          align-items: flex-start;

          width: 100%;

          padding:
            18px
            0
            4px;
        }

        .status-node {
          position: relative;

          display: flex;
          flex: 1;

          flex-direction: column;
          align-items: center;

          min-width: 0;
        }

        .status-node:not(:last-child)::after {
          content: "";

          position: absolute;

          top: 4px;
          left: 50%;

          width: 100%;
          height: 1px;

          background:
            rgba(255,255,255,.07);

          z-index: 0;
        }

        .status-node.done:not(:last-child)::after {
          background:
            rgba(249,115,22,.28);
        }

        .status-dot-wrap {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 9px;
          height: 9px;

          z-index: 1;
        }

        .status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #292929;

          box-shadow:
            0 0 0 4px #050505;
        }

        .status-node.done
        .status-dot {
          background: #f97316;
        }

        .status-node.current
        .status-dot {
          width: 9px;
          height: 9px;

          background: #f97316;

          box-shadow:
            0 0 0 4px #050505,
            0 0 0 5px
              rgba(249,115,22,.10);
        }

        .status-label {
          width: 100%;

          margin-top: 9px;

          padding: 0 3px;

          color: #444;

          font-size: 9px;
          font-weight: 600;

          line-height: 1.3;

          text-align: center;
        }

        .status-node.done
        .status-label {
          color: #777;
        }

        .status-node.current
        .status-label {
          color: #ddd;
        }

        /* ==========================================
           CANCEL
        ========================================== */

        .action-cancel {
          display: block;

          width: 100%;

          margin-top: 12px;
          padding: 8px 0;

          border: 0;

          background: transparent;

          color: #444;

          font-size: 11px;
          font-weight: 550;

          cursor: pointer;

          transition:
            color .18s ease;
        }

        .action-cancel:hover:not(:disabled) {
          color: #ef4444;
        }

        .action-cancel:disabled {
          cursor: default;
          opacity: .45;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 480px) {
          .action-header {
            padding-top: 15px;
          }

          .action-current {
            font-size: 13px;
          }

          .status-label {
            font-size: 8px;
          }

          .status-track {
            padding-top: 17px;
          }
        }

        @media (max-width: 360px) {
          .status-label {
            font-size: 7px;
          }
        }
      `}</style>

      {/* CURRENT STATUS */}

      <div className="action-header">
        <div>
          <div className="action-heading">
            Gestión
          </div>

          <div className="action-current">
            <span className="action-dot" />

            {config.label}
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION */}

      {!isFinished &&
        nextStatus && (
          <button
            type="button"
            className="action-primary"
            disabled={loading}
            onClick={() =>
              changeStatus(
                nextStatus
              )
            }
          >
            <span className="action-primary-label">
              <span>
                {loading
                  ? "Actualizando..."
                  : config.nextLabel}
              </span>
            </span>

            {!loading && (
              <span className="action-primary-arrow">
                →
              </span>
            )}
          </button>
        )}

      {/* STATUS TRACK */}

      <div className="status-track">
        {STATUS_ORDER.map(
          (status, index) => {
            const isCurrent =
              status ===
              currentStatus;

            const isDone =
              currentIndex >= 0 &&
              index < currentIndex;

            return (
              <div
                key={status}
                className={[
                  "status-node",
                  isDone
                    ? "done"
                    : "",
                  isCurrent
                    ? "current"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="status-dot-wrap">
                  <span className="status-dot" />
                </div>

                <div className="status-label">
                  {STATUS_CONFIG[
                    status
                  ].label}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* CANCEL */}

      {!isFinished && (
        <button
          type="button"
          className="action-cancel"
          disabled={loading}
          onClick={() =>
            changeStatus(
              "cancelled"
            )
          }
        >
          Cancelar pedido
        </button>
      )}
    </section>
  );
}