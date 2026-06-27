"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function PaymentsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [qrCount, setQrCount] =
    useState(0);

  const [form, setForm] =
    useState({
      accepts_cash: true,
      accepts_transfer: false,
      accepts_qr: false,
      accepts_delivery_payment: true,

      bank_name: "",
      account_holder: "",
      account_number: "",

      prep_time_min: 20,
      prep_time_max: 30,
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      try {
        const {
          data: restaurant,
        } = await supabase
          .from("restaurants")
          .select("*")
          .eq(
            "id",
            restaurantId
          )
          .single();

        if (restaurant) {
          setForm({
            accepts_cash:
              restaurant.accepts_cash ?? true,

            accepts_transfer:
              restaurant.accepts_transfer ??
              false,

            accepts_qr:
              restaurant.accepts_qr ?? false,

            accepts_delivery_payment:
              restaurant.accepts_delivery_payment ??
              true,

            bank_name:
              restaurant.bank_name || "",

            account_holder:
              restaurant.account_holder || "",

            account_number:
              restaurant.account_number || "",

            prep_time_min:
              restaurant.prep_time_min || 20,

            prep_time_max:
              restaurant.prep_time_max || 30,
          });
        }

        const { count } =
          await supabase
            .from(
              "restaurant_payment_qrs"
            )
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "restaurant_id",
              restaurantId
            );

        setQrCount(
          count || 0
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const saveSettings =
    async () => {
      try {
        setSaving(true);

        console.log("restaurantId", restaurantId);
        const { error } =
          await supabase
            .from(
              "restaurants"
            )
            .update({
              accepts_cash:
                form.accepts_cash,

              accepts_transfer:
                form.accepts_transfer,

              accepts_qr:
                form.accepts_qr,

              accepts_delivery_payment:
                form.accepts_delivery_payment,

              bank_name:
                form.bank_name,

              account_holder:
                form.account_holder,

              account_number:
                form.account_number,

              prep_time_min:
                form.prep_time_min,

              prep_time_max:
                form.prep_time_max,
            })
            .eq(
              "id",
              restaurantId
            );

        if (error)
          throw error;

        alert(
          "Configuración guardada"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Error guardando configuración"
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <main
        style={{
          padding: "40px",
          color: "#fff",
        }}
      >
        Cargando...
      </main>
    );
  }

return (
  <PermissionGuard permission="payments">
    <main
      style={{
        maxWidth: "1500px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            color: "#888",
          }}
        >
            <BackToSettings
  restaurantId={restaurantId}
/>
          Configuración /
          Pagos
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          Centro de Pagos
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: "10px",
          }}
        >
          Administra métodos
          de pago y tiempos
          operativos.
        </p>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={card}>
          <h2>
            {qrCount}
          </h2>

          <p>
            QRs Configurados
          </p>
        </div>

        <div style={card}>
          <h2>
            {
              form.prep_time_min
            }
            -
            {
              form.prep_time_max
            }
          </h2>

          <p>
            Tiempo Preparación
          </p>
        </div>

        <div style={card}>
          <h2>
            {[
              form.accepts_cash,
              form.accepts_transfer,
              form.accepts_qr,
              form.accepts_delivery_payment,
            ].filter(Boolean)
              .length}
          </h2>

          <p>
            Métodos Activos
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 380px",
          gap: "25px",
        }}
      >
        {/* IZQUIERDA */}

        <div
          style={{
            display: "grid",
            gap: "25px",
          }}
        >
          <section
            style={card}
          >
            <h2>
              Métodos de Pago
            </h2>

            <Switch
              label="Pago en efectivo"
              value={
                form.accepts_cash
              }
              onChange={(
                value
              ) =>
                setForm({
                  ...form,
                  accepts_cash:
                    value,
                })
              }
            />

            <Switch
              label="Transferencia"
              value={
                form.accepts_transfer
              }
              onChange={(
                value
              ) =>
                setForm({
                  ...form,
                  accepts_transfer:
                    value,
                })
              }
            />

            <Switch
              label="Pago QR"
              value={
                form.accepts_qr
              }
              onChange={(
                value
              ) =>
                setForm({
                  ...form,
                  accepts_qr:
                    value,
                })
              }
            />

            <Switch
              label="Pago contra entrega"
              value={
                form.accepts_delivery_payment
              }
              onChange={(
                value
              ) =>
                setForm({
                  ...form,
                  accepts_delivery_payment:
                    value,
                })
              }
            />
          </section>

          <section
            style={card}
          >
            <h2>
              Cuenta Bancaria
            </h2>

            <input
              placeholder="Banco"
              value={
                form.bank_name
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  bank_name:
                    e.target.value,
                })
              }
              style={input}
            />

            <input
              placeholder="Titular"
              value={
                form.account_holder
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  account_holder:
                    e.target.value,
                })
              }
              style={input}
            />

            <input
              placeholder="Número cuenta"
              value={
                form.account_number
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  account_number:
                    e.target.value,
                })
              }
              style={input}
            />
          </section>
        </div>

        {/* DERECHA */}

        <div
          style={{
            display: "grid",
            gap: "25px",
            height:
              "fit-content",
          }}
        >
          <section
            style={card}
          >
            <h2>
              Tiempo de Preparación
            </h2>

            <input
              type="number"
              value={
                form.prep_time_min
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  prep_time_min:
                    Number(
                      e.target.value
                    ),
                })
              }
              style={input}
            />

            <input
              type="number"
              value={
                form.prep_time_max
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  prep_time_max:
                    Number(
                      e.target.value
                    ),
                })
              }
              style={input}
            />
          </section>

          <section
            style={card}
          >
            <h2>
              QRs de Pago
            </h2>

            <p
              style={{
                color: "#888",
              }}
            >
              Gestiona múltiples
              códigos QR para
              tus clientes.
            </p>

            <Link
              href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs`}
            >
              <button
                style={{
                  marginTop:
                    "15px",
                  width: "100%",
                  background:
                    "#f97316",
                  border: "none",
                  color:
                    "#fff",
                  padding:
                    "14px",
                  borderRadius:
                    "14px",
                  cursor:
                    "pointer",
                }}
              >
                Administrar QRs
              </button>
            </Link>
          </section>

          <button
            onClick={
              saveSettings
            }
            disabled={
              saving
            }
            style={{
              background:
                "#16a34a",
              border: "none",
              color: "#fff",
              padding:
                "18px",
              borderRadius:
                "16px",
              fontWeight:
                "700",
              cursor:
                "pointer",
            }}
          >
            {saving
              ? "Guardando..."
              : "Guardar Configuración"}
          </button>
        </div>
      </div>
     </main>
    </PermissionGuard>
  )
}

function Switch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        marginBottom: "15px",
      }}
    >
      {label}

      <input
        type="checkbox"
        checked={value}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
      />
    </label>
  );
}

const card = {
  background:
    "rgba(17,17,17,.95)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "24px",
  padding: "25px",
};

const input = {
  width: "100%",
  marginTop: "10px",
  marginBottom: "15px",
  background:
    "rgba(255,255,255,.04)",
  border:
    "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
};