"use client";

import { useEffect, useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function GalleryPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { upload } = useImageUpload();

  useEffect(() => { loadGallery(); }, []);

  const loadGallery = async () => {
    const { data } = await supabase.from("restaurant_gallery").select("*").eq("restaurant_id", restaurantId).order("sort_order", { ascending: true });
    setImages(data || []);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await upload({ file, restaurantId, preset: "gallery" });
    if (result.success) {
      await supabase.from("restaurant_gallery").insert({ restaurant_id: restaurantId, image_url: result.url, active: true, sort_order: images.length + 1 });
      loadGallery();
    }
    setUploading(false);
  };

  return (
    <PermissionGuard permission="gallery">
      <main style={mainContainer}>
        <div style={contentWrapper}>
          
          {/* HEADER */}
          <header style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#6b7280" }}>
              <BackToSettings restaurantId={restaurantId} />
              <span>Configuración / Galería</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              <h1 style={{ fontSize: "48px", fontWeight: "900", margin: 0 }}>🖼️ Galería</h1>
              <label style={uploadBtn}>
                {uploading ? "Subiendo..." : "+ Agregar Imagen"}
                <input type="file" accept="image/*" hidden onChange={uploadImage} />
              </label>
            </div>
          </header>

          {/* STATS */}
          <div style={gridContainer}>
            <StatCard title="Total Imágenes" value={images.length} />
            <StatCard title="Visibles" value={images.filter(i => i.active).length} />
          </div>

          {/* GRID */}
          <div style={imageGrid}>
            {images.map((img) => (
              <div key={img.id} style={imageCard}>
                <img src={img.image_url} alt="Galeria" style={imgStyle} />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={async () => {
                      await supabase.from("restaurant_gallery").update({ active: !img.active }).eq("id", img.id);
                      loadGallery();
                    }} style={actionBtn(img.active ? "#f59e0b" : "#22c55e")}>
                      {img.active ? "Ocultar" : "Mostrar"}
                    </button>
                    <button onClick={async () => {
                      if(confirm("¿Eliminar?")) {
                        await supabase.from("restaurant_gallery").delete().eq("id", img.id);
                        loadGallery();
                      }
                    }} style={actionBtn("#ef4444")}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}

// ESTILOS
const mainContainer = { minHeight: "100vh", background: "radial-gradient(circle at top right, #1a0a00, #050505)", padding: "40px 20px", color: "#fff" };
const contentWrapper = { maxWidth: "1200px", margin: "0 auto" };
const gridContainer = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" };
const imageGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" };
const imageCard = { background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "20px", overflow: "hidden" };
const imgStyle = { width: "100%", height: "200px", objectFit: "cover" as const };
const uploadBtn = { background: "#f97316", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };
const actionBtn = (color: string) => ({
  flex: 1, background: `${color}15`, color: color, border: "none", padding: "10px", borderRadius: "8px", fontWeight: "600", cursor: "pointer"
});

function StatCard({ title, value }: any) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "20px", padding: "20px" }}>
      <p style={{ color: "#777", fontSize: "12px", textTransform: "uppercase" }}>{title}</p>
      <h2 style={{ margin: "5px 0 0 0" }}>{value}</h2>
    </div>
  );
}