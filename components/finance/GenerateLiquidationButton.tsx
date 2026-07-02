"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  restaurantId: string;
}

export default function GenerateLiquidationButton({
  restaurantId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (
      !confirm(
        "¿Deseas crear una nueva liquidación?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/liquidations/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurantId,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        alert(result.error);
        return;
      }

      alert("Liquidación creada correctamente.");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al generar la liquidación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      style={{
        background: "#f97316",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "700",
      }}
    >
      {loading
        ? "Generando..."
        : "🧾 Generar Liquidación"}
    </button>
  );
}