"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ServiciosRestaurantPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [services, setServices] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const { data } =
      await supabase
        .from("restaurant_services")
        .select("*")
        .eq(
          "restaurant_id",
          restaurantId
        )
        .order("sort_order");

    setServices(data || []);
    setLoading(false);
  }

  async function toggleService(
    service: any
  ) {
    await supabase
      .from(
        "restaurant_services"
      )
      .update({
        active:
          !service.active,
      })
      .eq(
        "id",
        service.id
      );

    loadServices();
  }

  async function deleteService(
    serviceId: string
  ) {
    const ok = confirm(
      "¿Eliminar servicio?"
    );

    if (!ok) return;

    await supabase
      .from(
        "restaurant_services"
      )
      .delete()
      .eq(
        "id",
        serviceId
      );

    loadServices();
  }

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
  <PermissionGuard permission="serviciosrestaurant">
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "35px",
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
          Configuración / Servicios
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          ⚙️Servicios Restaurante 
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "12px",
          }}
        >
          Administra los
          servicios visibles
          en tu landing.
        </p>

        <p
          style={{
            color: "#f97316",
            marginTop: "10px",
            fontWeight: "700",
          }}
        >
          Total servicios:
          {" "}
          {services.length}
        </p>
      </div>

      <Link
        href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/nuevo`}
        style={{
          display: "inline-block",
          background:
            "#f97316",
          color: "#fff",
          padding:
            "14px 24px",
          borderRadius:
            "14px",
          textDecoration:
            "none",
          fontWeight: "700",
          marginBottom:
            "35px",
        }}
      >
        ➕ Nuevo Servicio
      </Link>

      <div>
        {services.map(
          (service) => (
            <div
              key={service.id}
              style={{
                background:
                  "rgba(255,255,255,.03)",

                backdropFilter:
                  "blur(20px)",

                border:
                  "1px solid rgba(255,255,255,.08)",

                boxShadow:
                  "0 10px 40px rgba(0,0,0,.25)",

                borderRadius:
                  "24px",

                padding:
                  "25px",

                marginBottom:
                  "20px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "start",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color:
                        "#fff",
                    }}
                  >
                    {service.icon}
                    {" "}
                    {
                      service.title
                    }
                  </h2>

                  <p
                    style={{
                      color:
                        service.active
                          ? "#4ade80"
                          : "#ef4444",

                      fontWeight:
                        "700",
                    }}
                  >
                    {service.active
                      ? "🟢 Activo"
                      : "🔴 Oculto"}
                  </p>

                  <p
                    style={{
                      color:
                        "#aaa",
                    }}
                  >
                    {
                      service.description
                    }
                  </p>

                  <p
                    style={{
                      color:
                        "#777",
                      fontSize:
                        "13px",
                    }}
                  >
                    Orden:
                    {" "}
                    {
                      service.sort_order
                    }
                  </p>

                  <p
                    style={{
                      color:
                        "#666",
                      fontSize:
                        "12px",
                    }}
                  >
                    Creado:
                    {" "}
                    {new Date(
                      service.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  gap: "10px",
                  flexWrap:
                    "wrap",
                  marginTop:
                    "20px",
                }}
              >
                <Link
                  href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/${service.id}`}
                  style={{
                    background:
                      "#2563eb",
                    color:
                      "#fff",
                    padding:
                      "10px 18px",
                    borderRadius:
                      "10px",
                    textDecoration:
                      "none",
                    fontWeight:
                      "600",
                  }}
                >
                  ✏️ Editar
                </Link>

                <button
                  onClick={() =>
                    toggleService(
                      service
                    )
                  }
                  style={{
                    background:
                      service.active
                        ? "#dc2626"
                        : "#16a34a",

                    border:
                      "none",

                    color:
                      "#fff",

                    padding:
                      "10px 18px",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "600",
                  }}
                >
                  {service.active
                    ? "🔴 Ocultar"
                    : "🟢 Activar"}
                </button>

                <button
                  onClick={() =>
                    deleteService(
                      service.id
                    )
                  }
                  style={{
                    background:
                      "#111",

                    border:
                      "1px solid rgba(255,255,255,.08)",

                    color:
                      "#fff",

                    padding:
                      "10px 18px",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "600",
                  }}
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  </PermissionGuard>
);
}