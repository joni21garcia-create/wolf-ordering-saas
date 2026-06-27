"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

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

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [qrs, setQrs] =
    useState<PaymentQR[]>([]);

  useEffect(() => {
    loadQRs();
  }, []);

  const loadQRs =
    async () => {
      try {
        setLoading(true);

        const { data, error } =
          await supabase
            .from(
              "restaurant_payment_qrs"
            )
            .select("*")
            .eq(
              "restaurant_id",
              restaurantId
            )
            .order(
              "sort_order",
              {
                ascending: true,
              }
            );

        if (error)
          throw error;

        setQrs(
          (data ||
            []) as PaymentQR[]
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const toggleQR =
    async (
      id: string,
      current: boolean
    ) => {
      const { error } =
        await supabase
          .from(
            "restaurant_payment_qrs"
          )
          .update({
            active:
              !current,
          })
          .eq("id", id);

      if (error) {
        alert(
          "Error actualizando QR"
        );
        return;
      }

      loadQRs();
    };

  const deleteQR =
    async (
      id: string
    ) => {
      const ok =
        confirm(
          "¿Eliminar este QR?"
        );

      if (!ok) return;

      const { error } =
        await supabase
          .from(
            "restaurant_payment_qrs"
          )
          .delete()
          .eq("id", id);

      if (error) {
        alert(
          "Error eliminando QR"
        );
        return;
      }

      loadQRs();
    };

  const totalQRs =
    qrs.length;

  const activeQRs =
    qrs.filter(
      (q) => q.active
    ).length;

  const hiddenQRs =
    totalQRs - activeQRs;

  return (
    <main
      style={{
        maxWidth: "1500px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <p
            style={{
              color: "#888",
              marginBottom: "8px",
            }}
          >
            
            Configuración /
            Pagos / QRs
          </p>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: "800",
              margin: 0,
            }}
          >
            QRs de Pago
          </h1>

          <p
            style={{
              color: "#888",
              marginTop: "12px",
            }}
          >
            Administra todos los
            métodos QR del
            restaurante.
          </p>
        </div>

        <Link
          href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`}
        >
          <button
            style={{
              background:
                "#f97316",
              border: "none",
              color: "#fff",
              padding:
                "16px 28px",
              borderRadius:
                "16px",
              cursor:
                "pointer",
              fontWeight:
                "700",
              fontSize:
                "15px",
            }}
          >
            + Nuevo QR
          </button>
        </Link>
      </div>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div style={statCard}>
          <h2>
            {totalQRs}
          </h2>

          <p>
            Total QRs
          </p>
        </div>

        <div style={statCard}>
          <h2>
            {activeQRs}
          </h2>

          <p>
            Activos
          </p>
        </div>

        <div style={statCard}>
          <h2>
            {hiddenQRs}
          </h2>

          <p>
            Ocultos
          </p>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div
          style={{
            color: "#888",
          }}
        >
          Cargando QRs...
        </div>
      )}

      {/* Empty State */}

      {!loading &&
        qrs.length === 0 && (
          <div
            style={{
              background:
                "rgba(17,17,17,.95)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius:
                "24px",
              padding:
                "60px",
              textAlign:
                "center",
            }}
          >
            <h2>
              No hay QRs
              configurados
            </h2>

            <p
              style={{
                color:
                  "#888",
              }}
            >
              Agrega el primer
              QR para comenzar.
            </p>

            <Link
              href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`}
            >
              <button
                style={{
                  marginTop:
                    "20px",
                  background:
                    "#f97316",
                  border:
                    "none",
                  color:
                    "#fff",
                  padding:
                    "14px 26px",
                  borderRadius:
                    "14px",
                  cursor:
                    "pointer",
                }}
              >
                Crear Primer QR
              </button>
            </Link>
          </div>
        )}

      {/* Cards */}

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {qrs.map((qr) => (
          <div
            key={qr.id}
            style={{
              background:
                "rgba(17,17,17,.95)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius:
                "24px",
              padding:
                "24px",
              display:
                "grid",
              gridTemplateColumns:
                "120px 1fr auto",
              gap: "25px",
              alignItems:
                "center",
            }}
          >
            <img
              src={
                qr.qr_image_url
              }
              alt={qr.name}
              style={{
                width: "120px",
                height:
                  "120px",
                objectFit:
                  "cover",
                borderRadius:
                  "16px",
              }}
            />

            <div>
              <h3
                style={{
                  marginBottom:
                    "10px",
                }}
              >
                {qr.name}
              </h3>

              <p>
                Titular:{" "}
                {qr.account_holder ||
                  "-"}
              </p>

              <p>
                Cuenta:{" "}
                {qr.account_number ||
                  "-"}
              </p>

              <div
                style={{
                  marginTop:
                    "12px",
                }}
              >
                <span
                  style={{
                    background:
                      qr.active
                        ? "#22c55e20"
                        : "#ef444420",
                    color:
                      qr.active
                        ? "#22c55e"
                        : "#ef4444",
                    padding:
                      "6px 12px",
                    borderRadius:
                      "999px",
                    fontSize:
                      "12px",
                    fontWeight:
                      "700",
                  }}
                >
                  {qr.active
                    ? "ACTIVO"
                    : "OCULTO"}
                </span>
              </div>
            </div>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "10px",
              }}
            >
              <button
                onClick={() =>
                  toggleQR(
                    qr.id,
                    qr.active
                  )
                }
                style={secondaryBtn}
              >
                {qr.active
                  ? "Ocultar"
                  : "Mostrar"}
              </button>

              <button
                onClick={() =>
                  deleteQR(
                    qr.id
                  )
                }
                style={
                  deleteBtn
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const statCard = {
  background:
    "rgba(17,17,17,.95)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "24px",
  padding: "25px",
  textAlign:
    "center" as const,
};

const secondaryBtn = {
  background:
    "rgba(255,255,255,.05)",
  border:
    "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  padding:
    "10px 14px",
  borderRadius:
    "12px",
  cursor:
    "pointer",
};

const deleteBtn = {
  background:
    "#ef444420",
  border:
    "1px solid #ef444455",
  color: "#ef4444",
  padding:
    "10px 14px",
  borderRadius:
    "12px",
  cursor:
    "pointer",
};