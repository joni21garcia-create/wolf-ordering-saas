"use client";

import { useEffect, useState } from "react";

export default function UpdateBanner() {

  const [updateAvailable, setUpdateAvailable] =
    useState(false);

  useEffect(() => {

  function onUpdateAvailable() {

    console.log(
      "[PWA] Hay una nueva versión disponible."
    );

    setUpdateAvailable(true);

  }

  window.addEventListener(
    "wolf-update-available",
    onUpdateAvailable
  );

  return () => {

    window.removeEventListener(
      "wolf-update-available",
      onUpdateAvailable
    );

  };

}, []);

  if (!updateAvailable) {
    return null;
  }

  return (

    <div
      style={{
        position: "fixed",
        left: 20,
        right: 20,
        bottom: 20,
        zIndex: 99999,
        background: "#111827",
        color: "#fff",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,.35)",
      }}
    >

      <div>

        <strong>
          🚀 Nueva versión disponible
        </strong>

        <div
          style={{
            fontSize: 14,
            opacity: .8,
          }}
        >
          Recarga la aplicación para actualizar.
        </div>

      </div>

      <button

        onClick={() => location.reload()}

        style={{

          background: "#f97316",

          color: "#fff",

          border: "none",

          padding: "10px 18px",

          borderRadius: 10,

          cursor: "pointer",

        }}

      >

        Actualizar

      </button>

    </div>

  );

}