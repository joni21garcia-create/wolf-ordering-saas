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

  const restaurantId =
    params.restaurantId;

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
      } =
        await supabase.auth.getSession();

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

  const filtered =
    useMemo(() => {
      return orders.filter(
        (order) => {
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
            order.payment_status ===
              payment;

          const matchType =
            orderType === "" ||
            order.order_type ===
              orderType;

          const created =
            new Date(
              order.created_at
            );

          const matchFrom =
            !from ||
            created >=
              new Date(from);

          const matchTo =
            !to ||
            created <=
              new Date(
                `${to}T23:59:59`
              );

          return (
            matchSearch &&
            matchStatus &&
            matchPayment &&
            matchType &&
            matchFrom &&
            matchTo
          );
        }
      );
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

    const cancelled = filtered.filter(
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
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#050505,#0b0b0b)",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 1800,
            margin: "0 auto",
          }}
        >
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
            <div
              style={{
                color: "#999",
                textAlign: "center",
                padding: 60,
              }}
            >
              Cargando pedidos...
            </div>
          ) : filtered.length === 0 ? (
            <HistoryEmpty />
          ) : (
            <HistoryTable
              restaurantId={
                restaurantId
              }
              orders={filtered}
            />
          )}
        </div>
      </main>
    </PermissionGuard>
  );
}