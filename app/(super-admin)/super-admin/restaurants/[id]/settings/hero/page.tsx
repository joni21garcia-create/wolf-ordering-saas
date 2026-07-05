"use client";

import { useEffect, useState, useRef } from "react";
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
      const { data } = await supabase
        .from("restaurant_hero_slides")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });
      
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
      await supabase
        .from("restaurant_hero_slides")
        .update({
          title: selectedSlide.title ?? "",
          subtitle: selectedSlide.subtitle ?? "",
          image_url: selectedSlide.image_url ?? "",
          button_text: selectedSlide.button_text ?? "",
          button_url: selectedSlide.button_url ?? "",
          active: !!selectedSlide.active,
        })
        .eq("id", selectedSlide.id);
      
      alert("Slide actualizado correctamente");
      loadSlides();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally { setSaving(false); }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando Hero...</main>;

  return (
    <PermissionGuard permission="hero">
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", margin: "10px 0" }}>🚀 Hero Slides</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          {/* SIDEBAR */}
          <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px" }}>
            <h3 style={{ marginTop: 0 }}>Slides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {slides.map((slide, i) => (
                <div key={slide.id} onClick={() => setSelectedSlide(slide)} 
                  style={{ 
                    padding: "12px", 
                    borderRadius: "12px", 
                    cursor: "pointer", 
                    background: selectedSlide?.id === slide.id ? "rgba(249,115,22,.15)" : "rgba(255,255,255,.03)", 
                    border: `1px solid ${selectedSlide?.id === slide.id ? "#f97316" : "transparent"}` 
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Slide {i + 1}</strong>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: slide.active ? "#22c55e" : "#ef4444" }} />
                  </div>
                  <div style={{ color: "#888", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                       dangerouslySetInnerHTML={{ __html: slide.title || "Sin título" }} />
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR */}
          <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", padding: "20px" }}>
            {!selectedSlide ? <p>Selecciona un slide</p> : (
              <>
                <label style={{ display: "block", color: "#aaa", marginBottom: "10px" }}>Imagen del Slide</label>
                {selectedSlide.image_url && <img src={selectedSlide.image_url} alt="Hero preview" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "12px", marginBottom: "15px" }} />}
                
                {/* CHECKBOX DE ACTIVACIÓN */}
                <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(255,255,255,.03)", borderRadius: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#fff", fontWeight: "bold" }}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedSlide.active} 
                      onChange={(e) => setSelectedSlide({ ...selectedSlide, active: e.target.checked })}
                      style={{ marginRight: "12px", width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    {selectedSlide.active ? "✅ Slide Activo (Visible)" : "❌ Slide Inactivo (Oculto)"}
                  </label>
                </div>
                
                {/* CAMPOS EDITABLES EN VIVO CON IDENTIFICADOR ÚNICO DE RESETEO */}
                <EditableField key={`title-${selectedSlide.id}`} label="Título" value={selectedSlide.title ?? ""} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, title: v })} />
                <EditableField key={`subtitle-${selectedSlide.id}`} label="Subtítulo" value={selectedSlide.subtitle ?? ""} onChange={(v: string) => setSelectedSlide({ ...selectedSlide, subtitle: v })} />
                
                {/* CAMPOS DE UNA SOLA LÍNEA NORMALES */}
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

// =====================================================
// COMPONENTE EDITABLE CON RESETEO DE FOCO POR ID
// =====================================================
function EditableField({ label, value, onChange }: any) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const changeSize = (direction: "increase" | "decrease") => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    let targetElement = range.commonAncestorContainer as HTMLElement;
    if (targetElement.nodeType === Node.TEXT_NODE) {
      targetElement = targetElement.parentElement!;
    }

    const isInternalSpan = targetElement !== editorRef.current && targetElement.tagName === "SPAN";

    let currentSize = 16;
    const computedSize = window.getComputedStyle(targetElement).fontSize;
    if (computedSize) {
      currentSize = parseInt(computedSize, 10);
    }

    const newSize = direction === "increase" ? currentSize + 3 : Math.max(10, currentSize - 3);
    const sizeString = `${newSize}px`;

    if (range.toString().length > 0) {
      if (isInternalSpan && targetElement.innerText.trim() === range.toString().trim()) {
        targetElement.style.fontSize = sizeString;
      } else {
        const span = document.createElement("span");
        span.style.fontSize = sizeString;
        span.style.display = "inline-block";
        span.style.lineHeight = "1.2";
        
        span.appendChild(range.extractContents());
        range.insertNode(span);
      }
    } else {
      const span = document.createElement("span");
      span.style.fontSize = sizeString;
      span.style.display = "inline-block";
      span.style.lineHeight = "1.2";
      span.innerHTML = "&#8203;"; 

      range.deleteContents();
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.setStart(span, 1);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label style={{ color: "#777", fontSize: "12px" }}>{label}</label>
        
        <div style={{ display: "flex", gap: "4px", background: "#222", padding: "3px", borderRadius: "6px", border: "1px solid #333" }}>
          <button type="button" onClick={() => changeSize("decrease")} style={btnStyle}>─ A</button>
          <button type="button" onClick={() => changeSize("increase")} style={btnStyle}>┼ A</button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        style={{
          width: "100%",
          minHeight: "85px",
          background: "#111",
          border: "1px solid #333",
          color: "#fff",
          padding: "12px",
          borderRadius: "10px",
          fontSize: "16px",
          fontFamily: "inherit",
          boxSizing: "border-box",
          outline: "none",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word"
        }}
      />
    </div>
  );
}

const btnStyle = {
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
  padding: "4px 14px",
  fontSize: "12px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "700" as const,
  transition: "all 0.15s"
};

function InputField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#777", fontSize: "12px" }}>{label}</label>
      <input 
        type="text"
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        style={{
          width: "100%",
          background: "#111",
          border: "1px solid #333",
          color: "#fff",
          padding: "12px",
          borderRadius: "10px",
          fontSize: "14px",
          boxSizing: "border-box",
          outline: "none"
        }} 
      />
    </div>
  );
}