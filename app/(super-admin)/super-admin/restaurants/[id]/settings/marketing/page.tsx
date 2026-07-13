"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

import { Marketing } from "@/components/marketing";

import type { RestaurantData } from "@/types/marketing";

export default function MarketingPage() {
  const params = useParams();

  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] =
    useState<RestaurantData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadRestaurant();
  }, []);

  async function loadRestaurant() {
    setLoading(true);

    setError(null);

    const { data, error } = await supabase
      .from("restaurants")
      .select(`
        id,
        name,
        slug,
        logo_url,
        primary_color
      `)
      .eq("id", restaurantId)
      .single();

    if (error || !data) {
      console.error(error);

      setError(
        "No fue posible cargar el restaurante."
      );

      setLoading(false);

      return;
    }

    setRestaurant(data);

    setLoading(false);
  }

  return (
    <PermissionGuard permission="marketing">

      <main style={mainContainer}>

        <div style={contentWrapper}>

          <header
            style={{
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
                color: "#6b7280",
              }}
            >
              <BackToSettings
                restaurantId={restaurantId}
              />

              <span>
                Configuración / Marketing
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 48,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              📣 Marketing
            </h1>

            <p
              style={{
                marginTop: 12,
                color: "#9ca3af",
                maxWidth: 700,
                lineHeight: 1.7,
              }}
            >
              Genera códigos QR profesionales,
              descarga material listo para
              imprimir y comparte fácilmente el
              menú digital de tu restaurante.
            </p>
          </header>

          {loading && (
            <LoadingCard />
          )}

          {!loading && error && (
            <ErrorCard message={error} />
          )}

          {!loading &&
            !error &&
            restaurant && (
              <Marketing
                restaurant={restaurant}
              />
            )}

        </div>

      </main>

    </PermissionGuard>
  );
}

function LoadingCard() {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 24,
        padding: 80,
        textAlign: "center",
        color: "#9ca3af",
        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      Cargando módulo de marketing...
    </div>
  );
}

function ErrorCard({
  message,
}: {
  message: string;
}) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 24,
        padding: 80,
        textAlign: "center",
        color: "#ef4444",
        fontWeight: 700,
        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      {message}
    </div>
  );
}

const mainContainer: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top right,#1a0a00,#050505)",
  padding: "40px 20px",
  color: "#fff",
};

const contentWrapper: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
};