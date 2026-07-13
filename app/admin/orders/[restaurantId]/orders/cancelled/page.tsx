"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import PermissionGuard from "@/components/auth/PermissionGuard";

import HistoryHeader from "../components/HistoryHeader";
import HistoryStats from "../components/HistoryStats";
import HistoryFilters from "../components/HistoryFilters";
import HistoryTable from "../components/HistoryTable";
import HistoryEmpty from "../components/HistoryEmpty";

export default function CancelledPage() {
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
          }
        );

      const result =
        await response.json();

      if (result.success) {
        setOrders(
          (result.orders ?? []).filter(
            (o: any) =>
              o.status ===
              "cancelled"
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    useMemo(() => {
      return orders.filter(
        (order) => {
          if (!search) return true;

          const term =
            search.toLowerCase();

          return (
            order.customer_name
              ?.toLowerCase()
              .includes(term) ||
            order.customer_phone
              ?.toLowerCase()
              .includes(term) ||
            order.tracking_code
              ?.toLowerCase()
              .includes(term)
          );
        }
      );
    }, [orders, search]);

  return (
    <PermissionGuard permission="cancelled">
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#050505,#090909)",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 1700,
            margin: "0 auto",
          }}
        >
          <HistoryHeader
            restaurantId={
              restaurantId
            }
            title="Pedidos Cancelados"
            subtitle="Consulta todos los pedidos cancelados del restaurante."
          />

          <HistoryStats
            orders={filtered}
          />

<HistoryFilters
  search={search}
  onSearch={setSearch}
  onClear={() => setSearch("")}
/>

          {loading ? null : filtered.length ===
            0 ? (
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