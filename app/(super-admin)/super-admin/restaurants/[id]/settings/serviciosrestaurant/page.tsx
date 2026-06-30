"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ServiciosRestaurantPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data } = await supabase
        .from("restaurant_services")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order");
      setServices(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function toggleService(service: any) {
    await supabase
      .from("restaurant_services")
      .update({ active: !service.active })
      .eq("id", service.id);
    loadServices();
  }

  async function deleteService(serviceId: string) {
    if (!confirm("¿Eliminar este servicio permanentemente?")) return;
    await supabase.from("restaurant_services").delete().eq("id", serviceId);
    loadServices();
  }

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando servicios...</main>;

  return (
    <PermissionGuard permission="serviciosrestaurant">
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "40px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "40px", fontWeight: "800", margin: "10px 0" }}>⚙️ Servicios</h1>
          <p style={{ color: "#999" }}>Gestiona los servicios que ofreces en tu restaurante.</p>
          <div style={{ color: "#f97316", fontWeight: "700", marginTop: "10px" }}>
            Total servicios: {services.length}
          </div>
        </div>

        {/* ACTIONS */}
        <Link 
          href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/nuevo`}
          style={{ display: "inline-block", background: "#f97316", color: "#fff", padding: "14px 24px", borderRadius: "14px", textDecoration: "none", fontWeight: "700", marginBottom: "30px" }}
        >
          ➕ Nuevo Servicio
        </Link>

        {/* LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {services.map((service) => (
            <div key={service.id} 
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "25px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "15px" }}>
                <div>
                  <h2 style={{ margin: "0 0 5px 0" }}>{service.icon} {service.title}</h2>
                  <p style={{ color: service.active ? "#4ade80" : "#ef4444", fontWeight: "700", margin: "5px 0" }}>
                    {service.active ? "🟢 Activo" : "🔴 Oculto"}
                  </p>
                  <p style={{ color: "#aaa", fontSize: "14px", margin: "5px 0" }}>{service.description}</p>
                </div>
                
                {/* BUTTONS */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/${service.id}`}
                    style={{ background: "#2563eb", color: "#fff", padding: "10px 18px", borderRadius: "10px", textDecoration: "none", fontWeight: "600" }}
                  >
                    ✏️ Editar
                  </Link>
                  <button onClick={() => toggleService(service)}
                    style={{ background: service.active ? "#dc2626" : "#16a34a", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}
                  >
                    {service.active ? "🔴 Ocultar" : "🟢 Activar"}
                  </button>
                  <button onClick={() => deleteService(service.id)}
                    style={{ background: "#111", border: "1px solid rgba(255,255,255,.08)", color: "#fff", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PermissionGuard>
  );
}