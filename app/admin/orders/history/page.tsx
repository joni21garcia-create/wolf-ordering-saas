"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { supabase }
from "@/lib/supabase/client";


export default function OrdersHistoryPage() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

const loadOrders =
  async () => {
    try {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        console.log(
          "No existe sesión"
        );
        return;
      }

      const response =
        await fetch(
          "/api/orders/get-orders",
          {
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

      const result =
        await response.json();

      console.log(
        "ORDERS RESULT:",
        result
      );

      if (result.success) {
        setOrders(
          result.orders || []
        );
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const filteredOrders =
    orders.filter(
      (order: any) => {
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

return (
  <PermissionGuard permission="history">
      <div
        style={{
          minHeight: "100vh",
          background: `
          radial-gradient(
            circle at top right,
            rgba(249,115,22,.12),
            transparent 35%
          ),
          linear-gradient(
            180deg,
            #050505,
            #0d0d0d
          )
        `,
          padding: "40px",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "40px",
          }}
        >
          <div>
            <h1
              style={{
                color:
                  "#fff",
                fontSize:
                  "52px",
                fontWeight:
                  "900",
                margin: 0,
              }}
            >
              📋 Historial
              de Pedidos
            </h1>

            <p
              style={{
                color:
                  "rgba(255,255,255,.6)",
                marginTop:
                  "10px",
              }}
            >
              Consulta
              pedidos
              anteriores
              del
              restaurante
            </p>
          </div>

          <Link
            href="/admin/orders"
          >
            <button
              style={{
                background:
                  "#f97316",
                color:
                  "#fff",
                border:
                  "none",
                padding:
                  "14px 24px",
                borderRadius:
                  "14px",
                cursor:
                  "pointer",
                fontWeight:
                  "700",
              }}
            >
              ← Volver
            </button>
          </Link>
        </div>

        <div
          style={{
            marginBottom:
              "30px",
          }}
        >
          <input
            placeholder="Buscar por nombre, teléfono o tracking..."
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "18px",
              borderRadius:
                "18px",
              border:
                "1px solid rgba(255,255,255,.08)",
              background:
                "rgba(255,255,255,.04)",
              color:
                "#fff",
              outline:
                "none",
            }}
          />
        </div>

        <div
          style={{
            display:
              "grid",
            gap: "18px",
          }}
        >
          {filteredOrders.map(
            (
              order: any
            ) => (
              <div
                key={
                  order.id
                }
                style={{
                  background:
                    "linear-gradient(180deg,#151515,#0b0b0b)",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius:
                    "24px",
                  padding:
                    "24px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.25)",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "15px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "rgba(249,115,22,.15)",
                      color:
                        "#f97316",
                      padding:
                        "8px 14px",
                      borderRadius:
                        "999px",
                      fontWeight:
                        "800",
                    }}
                  >
                    {
                      order.tracking_code
                    }
                  </div>

                  <strong
                    style={{
                      color:
                        "#fff",
                    }}
                  >
                    $
                    {Number(
                      order.total
                    ).toFixed(
                      2
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    color:
                      "#fff",
                    marginBottom:
                      "8px",
                  }}
                >
                  👤{" "}
                  {
                    order.customer_name
                  }
                </div>

                <div
                  style={{
                    color:
                      "#aaa",
                    marginBottom:
                      "8px",
                  }}
                >
                  📞{" "}
                  {
                    order.customer_phone
                  }
                </div>

                <div
                  style={{
                    color:
                      "#aaa",
                    marginBottom:
                      "8px",
                  }}
                >
                  📅{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </div>

                <div
                  style={{
                    color:
                      "#aaa",
                    marginBottom:
                      "15px",
                  }}
                >
                  Estado:
                  {" "}
                  {
                    order.status
                  }
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                >
                  <button
                    style={{
                      width:
                        "100%",
                      background:
                        "#f97316",
                      color:
                        "#fff",
                      border:
                        "none",
                      padding:
                        "14px",
                      borderRadius:
                        "14px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "700",
                    }}
                  >
                    Ver
                    Detalle
                  </button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}