"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    const { data } = await supabase.from("restaurants").select("*").order("created_at", { ascending: false });
    setRestaurants(data || []);
    setLoading(false);
  };

  const deleteRestaurant = async (id: string) => {
    if (!confirm("¿Eliminar restaurante?")) return;
    const { error } = await supabase.from("restaurants").delete().eq("id", id);
    if (error) { alert("Error eliminando restaurante"); return; }
    loadRestaurants();
  };

  return (
    <PermissionGuard permission="restaurants">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Wolf Ordering</p>
            <h1 style={{ margin: 0, fontSize: "40px", fontWeight: "800" }}>Restaurantes</h1>
          </div>
          <Link href="/super-admin/restaurants/new">
            <button style={{ background: "#f97316", border: "none", color: "#fff", padding: "14px 24px", borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "15px", boxShadow: "0 10px 20px rgba(249,115,22,.2)" }}>
              + Nuevo Restaurante
            </button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Total", val: restaurants.length },
            { label: "Activos", val: restaurants.filter(r => r.active).length },
            { label: "Inactivos", val: restaurants.filter(r => !r.active).length }
          ].map((stat, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: "20px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "5px" }}>{stat.val}</div>
              <div style={{ color: "#777", fontSize: "13px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>Cargando restaurantes...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "25px" }}>
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", overflow: "hidden" }}>
                <div style={{ height: "100px", background: restaurant.banner_url ? `url(${restaurant.banner_url}) center/cover` : "linear-gradient(135deg,#333,#111)" }} />
                
                <div style={{ padding: "0 24px 24px 24px" }}>
                  <img src={restaurant.logo_url || "/placeholder.png"} alt={restaurant.name} style={{ width: "70px", height: "70px", borderRadius: "50%", marginTop: "-35px", border: "4px solid #050505", background: "#111", objectFit: "cover" }} />
                  
                  <h2 style={{ fontSize: "20px", margin: "12px 0 4px" }}>{restaurant.name}</h2>
                  <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>{restaurant.slug}</p>
                  
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <span style={{ background: restaurant.active ? "#22c55e20" : "#ef444420", color: restaurant.active ? "#22c55e" : "#ef4444", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
                      {restaurant.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: "10px" }}>
                    <Link href={`/super-admin/restaurants/${restaurant.id}/edit`}><button style={btnStyle("#f97316", "#fff")}>Editar</button></Link>
                    <Link href={`/super-admin/restaurants/${restaurant.id}/settings`}><button style={btnStyle("rgba(255,255,255,.05)", "#fff")}>Configuración</button></Link>
                    <button onClick={() => deleteRestaurant(restaurant.id)} style={btnStyle("rgba(239,68,68,.1)", "#ef4444")}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PermissionGuard>
  );
}

const btnStyle = (bg: string, color: string) => ({
  width: "100%", padding: "12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", background: bg, color: color, cursor: "pointer", fontWeight: 600, fontSize: "14px"
});