"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  initialOrder: any;
  restaurantSlug?: string;
}

export default function TrackingClient({
  initialOrder,
  restaurantSlug,
}: Props) {
  const [order, setOrder] =
    useState(initialOrder);

  useEffect(() => {
    const channel =
      supabase
        .channel(
          `tracking-${order.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${order.id}`,
          },
          (payload) => {
            console.log(
              "ORDER UPDATED",
              payload
            );

            setOrder(payload.new);
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [order.id]);

  const steps = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "completed",
  ];

  const currentStep =
    steps.indexOf(order.status);

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Seguimiento del Pedido
      </h1>

      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <p
          style={{
            color: "#888",
          }}
        >
          Código de seguimiento
        </p>

        <h1
          style={{
            color: "#fff",
          }}
        >
          {order.tracking_code}
        </h1>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#f97316",
          marginBottom: "20px",
        }}
      >
        Estado actual:
        {" "}
        <strong>
          {order.status}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "40px",
        }}
      >
        {[
          "Recibido",
          "Aceptado",
          "Preparando",
          "Listo",
          "Entregado",
        ].map(
          (
            step,
            index
          ) => (
            <div
              key={step}
              style={{
                flex: 1,
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius:
                    "50%",
                  margin:
                    "0 auto 10px",
                  background:
                    index <=
                    currentStep
                      ? "#f97316"
                      : "#333",
                  color:
                    "#fff",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                {index + 1}
              </div>

              <span
                style={{
                  color:
                    "#ddd",
                }}
              >
                {step}
              </span>
            </div>
          )
        )}
      </div>

      <div
        style={{
          textAlign: "center",
        }}
      >
        <Link
          href={`/${restaurantSlug}`}
        >
          <button
            style={{
              padding:
                "15px 30px",
              borderRadius:
                "14px",
              border:
                "none",
              background:
                "#f97316",
              color:
                "#fff",
              cursor:
                "pointer",
            }}
          >
            Volver
          </button>
        </Link>
      </div>
    </main>
  );
}