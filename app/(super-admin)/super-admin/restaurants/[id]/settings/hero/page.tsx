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

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const { data } = await supabase
        .from("restaurant_hero_slides")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setSlides(data);
        setSelectedSlide(data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSlide = async () => {
    if (!selectedSlide) return;
    try {
      setSaving(true);
      await supabase
        .from("restaurant_hero_slides")
        .update({
          title: selectedSlide.title,
          subtitle: selectedSlide.subtitle,
          image_url: selectedSlide.image_url,
          button_text: selectedSlide.button_text,
          button_url: selectedSlide.button_url,
          active: selectedSlide.active,
          sort_order: selectedSlide.sort_order,
        })
        .eq("id", selectedSlide.id);
      alert("Hero actualizado");
      loadSlides();
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("restaurantId", restaurantId);
      formData.append("preset", "hero");
      const response = await fetch("/api/images/upload", { method: "POST", body: formData });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      setSelectedSlide({ ...selectedSlide, image_url: json.url });
    } catch (error) {
      console.error(error);
      alert("Error subiendo imagen");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando Hero...</main>;

  return (
    <PermissionGuard permission="hero">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <div style={{ marginBottom: "40px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "40px", fontWeight: "800", margin: "10px 0" }}>🚀 Hero Slides</h1>
          <p style={{ color: "#999" }}>Configura promociones, campañas y mensajes principales.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "30px", alignItems: "start" }}>
          {/* SIDEBAR */}
          <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "20px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Slides</h3>
            {slides.map((slide, index) => (
              <div key={slide.id} onClick={() => setSelectedSlide(slide)} 
                style={{ padding: "16px", borderRadius: "14px", cursor: "pointer", marginBottom: "10px", 
                background: selectedSlide?.id === slide.id ? "rgba(249,115,22,.12)" : "rgba(255,255,255,.03)",
                border: selectedSlide?.id === slide.id ? "1px solid #f97316" : "1px solid rgba(255,255,255,.05)" }}>
                <strong style={{ display: "block" }}>Slide {index + 1}</strong>
                <div style={{ color: "#888", fontSize: "12px" }}>{slide.title || "Sin título"}</div>
              </div>
            ))}
          </div>

          {/* EDITOR */}
          <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
            {!selectedSlide ? <div style={{ color: "#888" }}>Selecciona un slide.</div> : (
              <>
                <h2 style={{ marginTop: 0 }}>Editor Hero</h2>
                <div style={{ marginBottom: "25px" }}>
                  <label style={{ display: "block", marginBottom: "10px", color: "#aaa" }}>Imagen</label>
                  {selectedSlide.image_url && <img src={selectedSlide.image_url} alt="" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px", marginBottom: "15px" }} />}
                  <input type="file" accept="image/*" onChange={uploadImage} />
                </div>
                <InputField label="Título" value={selectedSlide.title} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, title: v })} />
                <InputField label="Subtítulo" value={selectedSlide.subtitle} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, subtitle: v })} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <InputField label="Texto Botón" value={selectedSlide.button_text} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, button_text: v })} />
                    <InputField label="URL Botón" value={selectedSlide.button_url} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, button_url: v })} />
                </div>
                
                <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                  <input type="checkbox" checked={selectedSlide.active} onChange={(e) => setSelectedSlide({ ...selectedSlide, active: e.target.checked })} />
                  Activo
                </label>

                <button onClick={saveSlide} disabled={saving} style={{ marginTop: "30px", background: "#f97316", color: "#fff", border: "none", padding: "16px 30px", borderRadius: "14px", fontWeight: "700", cursor: "pointer", width: "100%" }}>
                  {saving ? "Guardando..." : "💾 Guardar cambios"}
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
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "14px" }}>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} 
        style={{ width: "100%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", padding: "14px", borderRadius: "12px", outline: "none" }} />
    </div>
  );
}