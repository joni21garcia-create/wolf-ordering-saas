"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function LocationPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [location, setLocation] =
    useState<any>(null);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation =
    async () => {
      const { data, error } =
        await supabase
          .from("restaurants")
          .select(`
            id,
            address,
            latitude,
            longitude,
            google_maps_url,
            primary_color,
            name
          `)
          .eq(
            "id",
            restaurantId
          )
          .single();

      if (error) {
        console.error(error);
        return;
      }

      setLocation(data);

      setLoading(false);
    };

  const saveLocation =
    async () => {
      try {
        setSaving(true);

        const { error } =
          await supabase
            .from("restaurants")
            .update({
              address:
                location.address,

              latitude:
                location.latitude,

              longitude:
                location.longitude,

              google_maps_url:
                location.google_maps_url,
            })
            .eq(
              "id",
              restaurantId
            );

        if (error) {
          console.error(error);

          alert(
            "Error guardando ubicación"
          );

          return;
        }

        alert(
          "Ubicación guardada correctamente"
        );
      } finally {
        setSaving(false);
      }
    };

  if (
    loading ||
    !location
  ) {
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

  const mapsUrl =
    location.google_maps_url?.trim()
      ? location.google_maps_url
      : `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

return (
  <PermissionGuard permission="location">
    <main
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            color: "#777",
            marginBottom: "10px",
          }}
        >
            <BackToSettings
  restaurantId={restaurantId}
/>
          Configuración /
          Ubicación
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          Ubicación del Restaurante
        </h1>

        <p
          style={{
            color: "#999",
            maxWidth: "800px",
            marginTop: "12px",
            lineHeight: 1.7,
          }}
        >
          Configura la ubicación
          exacta del restaurante para
          Google Maps, delivery,
          navegación y rutas.
        </p>
      </div>

      {/* UBICACION */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          📍 Datos de Ubicación
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          <TextCard
            label="Dirección"
            value={
              location.address || ""
            }
            onChange={(
              value: string
            ) =>
              setLocation({
                ...location,
                address: value,
              })
            }
          />

          <TextCard
            label="Latitud"
            value={
              location.latitude || ""
            }
            onChange={(
              value: string
            ) =>
              setLocation({
                ...location,
                latitude: value,
              })
            }
          />

          <TextCard
            label="Longitud"
            value={
              location.longitude || ""
            }
            onChange={(
              value: string
            ) =>
              setLocation({
                ...location,
                longitude: value,
              })
            }
          />
        </div>
      </div>

      {/* GOOGLE MAPS */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          🌎 Google Maps
        </h2>

        <TextCard
          label="URL Google Maps (Opcional)"
          value={
            location.google_maps_url ||
            ""
          }
          onChange={(
            value: string
          ) =>
            setLocation({
              ...location,
              google_maps_url:
                value,
            })
          }
        />
      </div>
            {/* VISTA PREVIA */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          🗺 Vista Previa
        </h2>

        {location.latitude &&
          location.longitude && (
            <div
              style={{
                overflow:
                  "hidden",
                borderRadius:
                  "20px",
                border:
                  "1px solid rgba(255,255,255,.08)",
              }}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                width="100%"
                height="400"
                loading="lazy"
                style={{
                  border:
                    "none",
                }}
              />
            </div>
          )}

        {!location.latitude &&
          !location.longitude && (
            <div
              style={{
                padding:
                  "40px",
                textAlign:
                  "center",
                color:
                  "#777",
              }}
            >
              Ingresa coordenadas para
              visualizar el mapa.
            </div>
          )}
      </div>

      {/* ACCIONES */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#111,#181818)",
          border:
            "1px solid rgba(249,115,22,.15)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "35px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          ⚡ Acciones Rápidas
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap:
              "wrap",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background:
                "#2563eb",
              color: "#fff",
              textDecoration:
                "none",
              padding:
                "14px 22px",
              borderRadius:
                "14px",
              fontWeight:
                "700",
            }}
          >
            📍 Abrir Google Maps
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${location.latitude}, ${location.longitude}`
              );

              alert(
                "Coordenadas copiadas"
              );
            }}
            style={{
              background:
                "#181818",
              border:
                "1px solid rgba(255,255,255,.08)",
              color: "#fff",
              padding:
                "14px 22px",
              borderRadius:
                "14px",
              cursor:
                "pointer",
              fontWeight:
                "700",
            }}
          >
            📋 Copiar Coordenadas
          </button>
        </div>
      </div>

      {/* AYUDA */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "35px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          💡 Cómo obtener coordenadas
        </h2>

        <div
          style={{
            color:
              "#999",
            lineHeight: 2,
          }}
        >
          <p>
            1. Abre Google Maps.
          </p>

          <p>
            2. Busca la ubicación del restaurante.
          </p>

          <p>
            3. Haz clic derecho sobre el punto exacto.
          </p>

          <p>
            4. Selecciona:
            ¿Qué hay aquí?
          </p>

          <p>
            5. Copia la latitud y longitud.
          </p>

          <p>
            6. Pégalas en este formulario.
          </p>
        </div>
      </div>

      {/* GUARDAR */}

      <button
        onClick={
          saveLocation
        }
        disabled={saving}
        style={{
          background:
            "#f97316",
          color: "#fff",
          border: "none",
          padding:
            "18px 40px",
          borderRadius: "18px",
          fontWeight: "800",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow:
            "0 20px 50px rgba(249,115,22,.35)",
        }}
      >
        {saving
          ? "Guardando..."
          : "💾 Guardar Ubicación"}
      </button>
      </main>
    </PermissionGuard>
)
}

function TextCard({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          color: "#aaa",
        }}
      >
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        style={{
          width: "100%",
          background:
            "rgba(255,255,255,.04)",
          border:
            "1px solid rgba(255,255,255,.08)",
          color: "#fff",
          padding: "14px",
          borderRadius:
            "14px",
        }}
      />
    </div>
  );
}