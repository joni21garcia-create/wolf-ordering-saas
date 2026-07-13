"use client";

import ColumnBoard from "./ColumnBoard";

import type {
  Order,
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
  delivery_mode: "fixed" | "manual";
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
      {/* DESKTOP */}

      <div
        className="orders-desktop"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            minWidth: 1820,
          }}
        >
          <ColumnBoard
            title="Pendientes"
            color="#f97316"
            orders={board.pending}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />

          <ColumnBoard
            title="Aceptados"
            color="#3b82f6"
            orders={board.accepted}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />

          <ColumnBoard
            title="Preparando"
            color="#8b5cf6"
            orders={board.preparing}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />

          <ColumnBoard
            title="Listos"
            color="#22c55e"
            orders={board.ready}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />

          <ColumnBoard
            title="En camino"
            color="#06b6d4"
            orders={board.delivery}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />

          <ColumnBoard
            title="Completados"
            color="#71717a"
            orders={board.completed}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />
        </div>
      </div>

      {/* MOBILE */}

      <div
        className="orders-mobile"
        style={{
          display: "none",
        }}
      >
        {mobileTab ===
          "pending" && (
          <ColumnBoard
            title="Pendientes"
            color="#f97316"
            orders={board.pending}
            deliverySettings={deliverySettings}
            onRefresh={onRefresh}
            onViewDetail={onViewDetail}
            onUpdateStatus={
              onUpdateStatus
            }
            onUpdatePayment={
              onUpdatePayment
            }
          />
        )}

        {mobileTab ===
          "preparing" && (
          <>
            <ColumnBoard
              title="Aceptados"
              color="#3b82f6"
              orders={
                board.accepted
              }
              deliverySettings={deliverySettings}
              onRefresh={
                onRefresh
              }
              onViewDetail={onViewDetail}
              onUpdateStatus={
                onUpdateStatus
              }
              onUpdatePayment={
                onUpdatePayment
              }
            />

            <div
              style={{
                height: 20,
              }}
            />

            <ColumnBoard
              title="Preparando"
              color="#8b5cf6"
              orders={
                board.preparing
              }
              deliverySettings={deliverySettings}
              onRefresh={
                onRefresh
              }
              onViewDetail={onViewDetail}
              onUpdateStatus={
                onUpdateStatus
              }
              onUpdatePayment={
                onUpdatePayment
              }
            />
          </>
        )}

        {mobileTab ===
          "ready" && (
          <>
            <ColumnBoard
              title="Listos"
              color="#22c55e"
              orders={board.ready}
              deliverySettings={deliverySettings}
              onRefresh={
                onRefresh
              }
              onViewDetail={onViewDetail}
              onUpdateStatus={
                onUpdateStatus
              }
              onUpdatePayment={
                onUpdatePayment
              }
            />

            <div
              style={{
                height: 20,
              }}
            />

            <ColumnBoard
              title="En camino"
              color="#06b6d4"
              orders={
                board.delivery
              }
              deliverySettings={deliverySettings}
              onRefresh={
                onRefresh
              }
              onViewDetail={onViewDetail}
              onUpdateStatus={
                onUpdateStatus
              }
              onUpdatePayment={
                onUpdatePayment
              }
            />
          </>
        )}

        {mobileTab ===
          "completed" && (
          <ColumnBoard
            title="Completados"
            color="#71717a"
            orders={
              board.completed
            }
            deliverySettings={deliverySettings}
            onRefresh={
              onRefresh
            }
            onViewDetail={onViewDetail}
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