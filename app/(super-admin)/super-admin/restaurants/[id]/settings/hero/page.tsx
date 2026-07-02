"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function HeroSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);

  useEffect(() => { loadSlides(); }, []);

  const loadSlides = async () => {
    try {
      const { data } = await supabase.from("restaurant_hero_slides")
        .select("*").eq("restaurant_id", restaurantId).order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setSlides(data);
        setSelectedSlide(data[0]);
      }
    } finally { setLoading(false); }
  };

  const saveSlide = async () => {
    if (!selectedSlide) return;
    try {
      setSaving(true);
      await supabase.from("restaurant_hero_slides")
        .update({
          title: selectedSlide.title ?? "",
          subtitle: selectedSlide.subtitle ?? "",
          image_url: selectedSlide.image_url ?? "",
          button_text: selectedSlide.button_text ?? "",
          button_url: selectedSlide.button_url ?? "",
          active: !!selectedSlide.active,
        })
        .eq("id", selectedSlide.id);
      alert("Hero actualizado");
      loadSlides();
    } finally { setSaving(false); }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando Hero...</main>;

  return (
    <PermissionGuard permission="hero">
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", color: "#fff" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", margin: "10px 0" }}>🚀 Hero Slides</h1>
        </div>

        {/* CSS Grid blindado: auto-fit maneja la adaptabilidad sin media queries en el JS */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "20px" 
        }}>
          
          {/* SIDEBAR */}
          <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px" }}>
            <h3 style={{ marginTop: 0 }}>Slides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {slides.map((slide, i) => (
                <div key={slide.id} onClick={() => setSelectedSlide(slide)} 
                  style={{ padding: "12px", borderRadius: "12px", cursor: "pointer", background: selectedSlide?.id === slide.id ? "rgba(249,115,22,.15)" : "rgba(255,255,255,.03)", border: `1px solid ${selectedSlide?.id === slide.id ? "#f97316" : "transparent"}` }}>
                  <strong>Slide {i + 1}</strong>
                  <div style={{ color: "#888", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slide.title || "Sin título"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR */}
          <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px" }}>
            {!selectedSlide ? <p>Selecciona un slide</p> : (
              <>
                <label style={{ display: "block", color: "#aaa", marginBottom: "10px" }}>Imagen del Slide</label>
                {selectedSlide.image_url && <img src={selectedSlide.image_url} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "12px", marginBottom: "15px" }} />}
                
                <InputField label="Título" value={selectedSlide.title ?? ""} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, title: v })} />
                <InputField label="Subtítulo" value={selectedSlide.subtitle ?? ""} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, subtitle: v })} />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <InputField label="Texto Botón" value={selectedSlide.button_text ?? ""} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, button_text: v })} />
                  <InputField label="URL" value={selectedSlide.button_url ?? ""} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, button_url: v })} />
                </div>

                <button onClick={saveSlide} disabled={saving} style={{ width: "100%", marginTop: "20px", background: "#f97316", border: "none", padding: "16px", borderRadius: "12px", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#777", fontSize: "12px" }}>{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px" }} 
      />
    </div>
  );
}