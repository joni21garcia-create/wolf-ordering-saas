"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Eye } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function DiscoverSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [discoverVisible, setDiscoverVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("discover_visible")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setDiscoverVisible(data.discover_visible ?? false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function saveData() {
    try {
      setSaving(true);

      await supabase
        .from("restaurants")
        .update({
          discover_visible: discoverVisible,
        })
        .eq("id", restaurantId);

      alert("Configuración de Discover actualizada.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "40px", color: "#fff" }}>
        Cargando...
      </main>
    );
  }

  return (
    <PermissionGuard permission="discover">
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 20px",
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />

          <h1
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "32px",
              fontWeight: 800,
              marginTop: "10px",
            }}
          >
            <Eye size={32} />
            Discover
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "8px",
            }}
          >
            Controla si este restaurante aparecerá en la página principal de
            Discover.
          </p>
        </div>

        <div
          style={{
            background: "rgba(17,17,17,.95)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Visibilidad
          </h2>

          <SwitchField
            label="Mostrar restaurante en Discover"
            checked={discoverVisible}
            onChange={setDiscoverVisible}
          />

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "16px",
              background: "rgba(249,115,22,.08)",
              border: "1px solid rgba(249,115,22,.18)",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#fff" }}>
              ¿Qué sucede si desactivas esta opción?
            </strong>

            <ul
              style={{
                marginTop: "15px",
                paddingLeft: "20px",
                color: "#bbb",
              }}
            >
              <li>El restaurante dejará de aparecer en Discover.</li>
              <li>No aparecerá en las búsquedas públicas.</li>
              <li>El enlace directo seguirá funcionando.</li>
              <li>Los clientes podrán seguir haciendo pedidos mediante el enlace.</li>
              <li>Puedes volver a publicarlo cuando quieras.</li>
            </ul>
          </div>

          <button
            onClick={saveData}
            disabled={saving}
            style={{
              width: "100%",
              marginTop: "30px",
              background: "#f97316",
              color: "#fff",
              border: "none",
              padding: "16px",
              borderRadius: "14px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {saving
              ? "Guardando..."
              : "💾 Guardar configuración"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "6px 0",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: "18px",
          height: "18px",
          cursor: "pointer",
        }}
      />

      <span
        style={{
          fontSize: "14px",
          color: "#eee",
        }}
      >
        {label}
      </span>
    </div>
  );
}