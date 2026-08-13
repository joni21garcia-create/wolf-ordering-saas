"use client";

import ColumnBoard from "./ColumnBoard";

import {
  WolfFlex,
  WolfScrollArea,
  WolfSpacer,
} from "@/lib/wolf-ui";

import type {
  OrdersBoardType,
} from "./types";

interface Props {
  board: OrdersBoardType;

  mobileTab:
    | "pending"
    | "preparing"
    | "ready"
    | "completed";

  deliverySettings: {
    delivery_mode:
      | "fixed"
      | "manual";

    delivery_fee: number;

    free_delivery_enabled: boolean;

    free_delivery_minimum: number;
  };

  onUpdateStatus: (
    orderId: string,
    status: string
  ) => Promise<void>;

  onUpdatePayment: (
    orderId: string,
    payment: string
  ) => Promise<void>;

  onRefresh: () => Promise<void>;

  onViewDetail: (
    orderId: string
  ) => void;
}


/* =========================================================
   DESKTOP COLUMNS
   ========================================================= */

const desktopColumns = [
  {
    key: "pending",
    title: "Pendientes",
    color: "#F97316",
  },

  {
    key: "accepted",
    title: "Aceptados",
    color: "#3B82F6",
  },

  {
    key: "preparing",
    title: "Preparando",
    color: "#8B5CF6",
  },

  {
    key: "ready",
    title: "Listos",
    color: "#22C55E",
  },

  {
    key: "delivery",
    title: "En camino",
    color: "#06B6D4",
  },

  {
    key: "completed",
    title: "Completados",
    color: "#71717A",
  },
] as const;


/* =========================================================
   ORDERS BOARD
   ========================================================= */

export default function OrdersBoard({
  board,
  mobileTab,
  deliverySettings,
  onUpdateStatus,
  onUpdatePayment,
  onRefresh,
  onViewDetail,
}: Props) {

  return (
    <>
      {/* ===================================================
          DESKTOP
          =================================================== */}

<div
  className="orders-desktop"
  style={{
    width: "100%",
    minWidth: 0,
    height: "calc(100dvh - 220px)",
    minHeight: 0,
    overflowX: "auto",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
    scrollBehavior: "auto",
    touchAction: "auto",
    boxSizing: "border-box",
    paddingBottom: 20,
  }}
>
  <WolfFlex
    gap="md"
    align="start"
    style={{
      /*
       * Ocupa como mínimo todo el espacio disponible,
       * pero puede crecer horizontalmente cuando
       * existan más columnas.
       */
      width: "max-content",
      minWidth: "100%",

      boxSizing:
        "border-box",

      padding:
        "0 12px",
    }}
  >
          {desktopColumns.map(
            (column) => (
              <ColumnBoard
                key={
                  column.key
                }

                title={
                  column.title
                }

                color={
                  column.color
                }

                orders={
                  board[
                    column.key
                  ]
                }

                deliverySettings={
                  deliverySettings
                }

                onRefresh={
                  onRefresh
                }

                onViewDetail={
                  onViewDetail
                }

                onUpdateStatus={
                  onUpdateStatus
                }

                onUpdatePayment={
                  onUpdatePayment
                }
              />
            )
          )}
        </WolfFlex>
</div>


      {/* ===================================================
          MOBILE
          =================================================== */}

      <div
        className="orders-mobile"
        style={{
          display: "none",
        }}
      >

        {/* -----------------------------------------------
            PENDIENTES
            ----------------------------------------------- */}

        {mobileTab ===
          "pending" && (
          <ColumnBoard
            title="Pendientes"
            color="#F97316"
            orders={
              board.pending
            }

            deliverySettings={
              deliverySettings
            }

            onRefresh={
              onRefresh
            }

            onViewDetail={
              onViewDetail
            }

            onUpdateStatus={
              onUpdateStatus
            }

            onUpdatePayment={
              onUpdatePayment
            }
          />
        )}


        {/* -----------------------------------------------
            ACEPTADOS + PREPARANDO
            ----------------------------------------------- */}

        {mobileTab ===
          "preparing" && (
          <>
            <ColumnBoard
              title="Aceptados"
              color="#3B82F6"
              orders={
                board.accepted
              }

              deliverySettings={
                deliverySettings
              }

              onRefresh={
                onRefresh
              }

              onViewDetail={
                onViewDetail
              }

              onUpdateStatus={
                onUpdateStatus
              }

              onUpdatePayment={
                onUpdatePayment
              }
            />

            <WolfSpacer />

            <ColumnBoard
              title="Preparando"
              color="#8B5CF6"
              orders={
                board.preparing
              }

              deliverySettings={
                deliverySettings
              }

              onRefresh={
                onRefresh
              }

              onViewDetail={
                onViewDetail
              }

              onUpdateStatus={
                onUpdateStatus
              }

              onUpdatePayment={
                onUpdatePayment
              }
            />
          </>
        )}


        {/* -----------------------------------------------
            LISTOS + EN CAMINO
            ----------------------------------------------- */}

        {mobileTab ===
          "ready" && (
          <>
            <ColumnBoard
              title="Listos"
              color="#22C55E"
              orders={
                board.ready
              }

              deliverySettings={
                deliverySettings
              }

              onRefresh={
                onRefresh
              }

              onViewDetail={
                onViewDetail
              }

              onUpdateStatus={
                onUpdateStatus
              }

              onUpdatePayment={
                onUpdatePayment
              }
            />

            <WolfSpacer />

            <ColumnBoard
              title="En camino"
              color="#06B6D4"
              orders={
                board.delivery
              }

              deliverySettings={
                deliverySettings
              }

              onRefresh={
                onRefresh
              }

              onViewDetail={
                onViewDetail
              }

              onUpdateStatus={
                onUpdateStatus
              }

              onUpdatePayment={
                onUpdatePayment
              }
            />
          </>
        )}


        {/* -----------------------------------------------
            COMPLETADOS
            ----------------------------------------------- */}

        {mobileTab ===
          "completed" && (
          <ColumnBoard
            title="Completados"
            color="#71717A"
            orders={
              board.completed
            }

            deliverySettings={
              deliverySettings
            }

            onRefresh={
              onRefresh
            }

            onViewDetail={
              onViewDetail
            }

            onUpdateStatus={
              onUpdateStatus
            }

            onUpdatePayment={
              onUpdatePayment
            }
          />
        )}

      </div>
    </>
  );
}