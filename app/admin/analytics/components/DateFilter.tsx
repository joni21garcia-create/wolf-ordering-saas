"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DateFilter() {
  const router = useRouter();

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const handleSearch =
    () => {
      if (!from || !to) {
        alert(
          "Selecciona ambas fechas"
        );
        return;
      }

      router.push(
        `/admin/analytics?from=${from}&to=${to}`
      );
    };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginTop: "30px",
        marginBottom: "30px",
        flexWrap: "wrap",
      }}
    >
      <input
        type="date"
        value={from}
        onChange={(e) =>
          setFrom(
            e.target.value
          )
        }
        style={{
          padding: "12px",
          borderRadius: "12px",
          border:
            "1px solid #333",
          background:
            "#111",
          color: "#fff",
        }}
      />

      <input
        type="date"
        value={to}
        onChange={(e) =>
          setTo(
            e.target.value
          )
        }
        style={{
          padding: "12px",
          borderRadius: "12px",
          border:
            "1px solid #333",
          background:
            "#111",
          color: "#fff",
        }}
      />

      <button
        onClick={
          handleSearch
        }
        style={{
          background:
            "#f97316",
          color: "#fff",
          border: "none",
          padding:
            "12px 20px",
          borderRadius:
            "12px",
          fontWeight:
            "700",
          cursor:
            "pointer",
        }}
      >
        Consultar
      </button>
    </div>
  );
}