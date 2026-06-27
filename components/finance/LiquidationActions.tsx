"use client";

import { useState } from "react";

interface Props {
  liquidationId: string;
  status: string;
}

export default function LiquidationActions({
  liquidationId,
  status,
}: Props) {
  const [loadingPaid, setLoadingPaid] =
    useState(false);

  const [
    loadingInvoice,
    setLoadingInvoice,
  ] = useState(false);

  const [
  loadingSync,
  setLoadingSync,
] = useState(false);

  const markPaid =
    async () => {
console.log(
  "LIQUIDATION ID FRONT:",
  liquidationId
);

      try {
        setLoadingPaid(true);

        const response =
          await fetch(
            "/api/liquidations/mark-paid",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                liquidationId,
              }),
            }
          );

        const result =
          await response.json();

console.log("RESULT:", result);

        if (
          result.success
        ) {
          alert(
            "Liquidación marcada como pagada"
          );

          window.location.reload();
        } else {
          alert(
            result.error
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Error al marcar pago"
        );
      } finally {
        setLoadingPaid(false);
      }
    };

  const generateInvoice =
    async () => {
      try {
        setLoadingInvoice(true);

        const response =
          await fetch(
            "/api/invoices/generate",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                liquidationId,
              }),
            }
          );


        const result =
          await response.json();

        if (
          result.success
        ) {
          alert(
            "Invoice generado correctamente"
          );

          window.location.reload();
        } else {
          alert(
            result.error
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Error al generar invoice"
        );
      } finally {
        setLoadingInvoice(false);
      }
    };


    const syncLiquidation =
  async () => {
    try {
      setLoadingSync(true);

      const response =
        await fetch(
          "/api/liquidations/sync",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              liquidationId,
            }),
          }
        );

      const result =
        await response.json();

      if (
        result.success
      ) {
        alert(
          "Liquidación actualizada"
        );

        window.location.reload();
      } else {
        alert(
          result.error
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Error al actualizar liquidación"
      );
    } finally {
      setLoadingSync(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
   <button
  onClick={markPaid}
  disabled={
    loadingPaid ||
    status === "paid"
  }
  style={{
    background:
      status === "paid"
        ? "#374151"
        : "#22c55e",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  {loadingPaid
    ? "Procesando..."
    : status === "paid"
    ? "✅ Pagado"
    : "💵 Marcar Pagado"}
</button>

<button
  onClick={syncLiquidation}
  disabled={loadingSync}
  style={{
    background: "#8b5cf6",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  {loadingSync
    ? "Actualizando..."
    : "🔄 Actualizar Liquidación"}
</button>

<button
  onClick={generateInvoice}
  disabled={loadingInvoice}
  style={{
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  {loadingInvoice
    ? "Generando..."
    : "📄 Generar Invoice"}
</button>
    </div>
  );
}