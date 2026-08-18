"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import PermissionGuard from "@/components/auth/PermissionGuard";

import HistoryHeader from "../components/HistoryHeader";
import HistoryMetrics from "../components/HistoryMetrics";
import HistoryFilters from "../components/HistoryFilters";
import HistoryTable from "../components/HistoryTable";
import HistoryEmpty from "../components/HistoryEmpty";

export default function HistoryPage() {
  const params = useParams<{
    restaurantId: string;
  }>();

  const restaurantId = params.restaurantId;

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [payment, setPayment] =
    useState("");

  const [orderType, setOrderType] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response =
        await fetch(
          "/api/orders/get-orders",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store",
          }
        );

      const json =
        await response.json();

      if (!json.success) return;

      setOrders(json.orders ?? []);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const term =
        search.toLowerCase();

      const matchSearch =
        search === "" ||
        order.customer_name
          ?.toLowerCase()
          .includes(term) ||
        order.customer_phone
          ?.includes(search) ||
        order.tracking_code
          ?.toLowerCase()
          .includes(term);

      const matchStatus =
        status === "" ||
        order.status === status;

      const matchPayment =
        payment === "" ||
        order.payment_status === payment;

      const matchType =
        orderType === "" ||
        order.order_type === orderType;

      const created =
        new Date(order.created_at);

      const matchFrom =
        !from ||
        created >= new Date(from);

      const matchTo =
        !to ||
        created <=
          new Date(`${to}T23:59:59`);

      return (
        matchSearch &&
        matchStatus &&
        matchPayment &&
        matchType &&
        matchFrom &&
        matchTo
      );
    });
  }, [
    orders,
    search,
    from,
    to,
    status,
    payment,
    orderType,
  ]);

  const metrics = useMemo(() => {
    const sales = filtered.reduce(
      (acc, order) =>
        acc + Number(order.total ?? 0),
      0
    );

    const average =
      filtered.length > 0
        ? sales / filtered.length
        : 0;

    const cancelled =
      filtered.filter(
        (o) => o.status === "cancelled"
      ).length;

    return [
      {
        title: "Pedidos",
        value: filtered.length,
        subtitle: "Resultados encontrados",
      },
      {
        title: "Ventas",
        value: `$${sales.toFixed(2)}`,
        subtitle: "Total vendido",
        color: "#22c55e",
      },
      {
        title: "Ticket Promedio",
        value: `$${average.toFixed(2)}`,
        subtitle: "Promedio por pedido",
        color: "#3b82f6",
      },
      {
        title: "Cancelados",
        value: cancelled,
        subtitle: "Pedidos cancelados",
        color: "#ef4444",
      },
    ];
  }, [filtered]);

  return (
    <PermissionGuard permission="history">
      <main className="page">
        <div className="container">
          <HistoryHeader
            restaurantId={restaurantId}
            title="Historial de Pedidos"
            subtitle="Consulta todos los pedidos utilizando filtros avanzados, búsqueda y rangos de fechas."
          />

          <HistoryMetrics
            metrics={metrics}
          />

          <HistoryFilters
            search={search}
            onSearch={setSearch}
            from={from}
            onFrom={setFrom}
            to={to}
            onTo={setTo}
            status={status}
            onStatus={setStatus}
            payment={payment}
            onPayment={setPayment}
            orderType={orderType}
            onOrderType={setOrderType}
            onClear={() => {
              setSearch("");
              setFrom("");
              setTo("");
              setStatus("");
              setPayment("");
              setOrderType("");
            }}
          />

          {loading ? (
            <div className="loading">
              <span className="loading-spinner" />
              <span>Cargando pedidos...</span>
            </div>
          ) : filtered.length === 0 ? (
            <HistoryEmpty />
          ) : (
            <HistoryTable
              restaurantId={restaurantId}
              orders={filtered}
            />
          )}
        </div>
      </main>

      <style jsx>{`
        .page {
          width: 100%;
          min-height: 100vh;
          box-sizing: border-box;
          overflow-x: hidden;
          background:
            linear-gradient(
              180deg,
              #050505 0%,
              #0b0b0b 100%
            );
          padding: 24px;
        }

        .container {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .loading {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #777;
          font-size: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.015);
        }

        .loading-spinner {
          width: 14px;
          height: 14px;
          flex: 0 0 14px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1200px) {
          .page {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .page {
            padding: 16px;
          }

          .container {
            max-width: 100%;
          }

          .loading {
            min-height: 150px;
          }
        }

        @media (max-width: 480px) {
          .page {
            padding: 12px;
          }

          .loading {
            min-height: 130px;
            font-size: 11px;
          }
        }

        @media (max-width: 360px) {
          .page {
            padding: 10px;
          }
        }
      `}</style>
    </PermissionGuard>
  );
}