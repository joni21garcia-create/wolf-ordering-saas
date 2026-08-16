"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { saveHeroSlide } from "@/lib/restaurant/saveHeroSlide";

export default function HeroSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado para la subida de foto
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
      } else {
        setSlides([]);
        setSelectedSlide(null);
      }
    } catch (error) {
      console.error("Error al cargar los slides:", error);
    } finally { setLoading(false); }
  };

  // Lógica para subir la imagen seleccionada al Storage de Supabase utilizando el bucket público existente
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlide) return;

    try {
      setUploading(true);
      
      // Creamos un nombre de archivo único utilizando el timestamp

const formData = new FormData();

formData.append("file", file);
formData.append("restaurantId", restaurantId);
formData.append("preset", "hero");

const response = await fetch(
  "/api/images/upload",
  {
    method: "POST",
    body: formData,
  }
);

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.error);
}

setSelectedSlide({
  ...selectedSlide,
  image_url: data.url,
});

      alert("Imagen cargada con éxito 📸 (No olvides guardar los cambios)");

    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateNewSlideSpace = () => {
    setSelectedSlide({
      restaurant_id: restaurantId,
      image_url: "", // Inicia vacío para permitir seleccionar foto
      title: "Nuevo Slide",
      subtitle: "Descripción de tu promoción",
      button_text: "Ordenar",
      button_url: "",
      active: true,
      sort_order: slides.length
    });
  };

  const saveSlide = async () => {
    if (!selectedSlide) return;
    if (!selectedSlide.image_url) {
      alert("Por favor, selecciona o sube una foto para este slide antes de guardar.");
      return;
    }
    
    try {
      setSaving(true);
      await saveHeroSlide({
        id: selectedSlide.id,
        restaurantId: restaurantId,
        imageUrl: selectedSlide.image_url,
        title: selectedSlide.title ?? "",
        subtitle: selectedSlide.subtitle ?? "",
        buttonText: selectedSlide.button_text ?? "",
        buttonUrl: selectedSlide.button_url ?? "",
        active: !!selectedSlide.active,
        sortOrder: selectedSlide.sort_order ?? 0
      });
      
      alert("Slide guardado correctamente 🎉");
      loadSlides();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <main className="hero-page loading-page">
        <div className="loading">Cargando Hero...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="hero">
      <main className="hero-page">
        <div className="hero-shell">
          <header className="hero-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">EXPERIENCIA · HERO</span>
                <h1>Hero Slides</h1>
                <p>Gestiona las imágenes y promociones de tu portada.</p>
              </div>

              <button
                type="button"
                className="add-top"
                onClick={handleCreateNewSlideSpace}
              >
                <span>＋</span>
                Añadir
              </button>
            </div>
          </header>

          <div className="mobile-slide-picker">
            <div className="picker-label">
              <span>SLIDES</span>
              <strong>{slides.length}</strong>
            </div>

            <div className="slide-tabs">
              {slides.map((slide, i) => {
                const isSelected =
                  selectedSlide?.id === slide.id ||
                  (!slide.id &&
                    !selectedSlide?.id &&
                    selectedSlide?.sort_order === slide.sort_order);

                return (
                  <button
                    type="button"
                    key={slide.id || `new-${i}`}
                    className={isSelected ? "slide-tab selected" : "slide-tab"}
                    onClick={() => setSelectedSlide(slide)}
                  >
                    <span className="tab-number">{i + 1}</span>
                    <span className="tab-copy">
                      <strong>Slide {i + 1}</strong>
                      <small>{slide.title || "Sin título"}</small>
                    </span>
                    <span className={slide.active ? "tab-status on" : "tab-status"} />
                  </button>
                );
              })}

              {slides.length === 0 && (
                <div className="empty-slides">
                  <span>No hay slides todavía.</span>
                  <button type="button" onClick={handleCreateNewSlideSpace}>
                    Crear el primero
                  </button>
                </div>
              )}
            </div>
          </div>

          {!selectedSlide ? (
            <section className="empty-editor">
              <div className="empty-icon">✦</div>
              <strong>Selecciona un slide</strong>
              <span>O crea uno nuevo para comenzar.</span>
              <button type="button" onClick={handleCreateNewSlideSpace}>
                ＋ Crear slide
              </button>
            </section>
          ) : (
            <section className="editor">
              <div className="editor-top">
                <div>
                  <span className="eyebrow">EDITANDO</span>
                  <h2>
                    Slide{" "}
                    {(slides.findIndex(
                      (slide) =>
                        slide.id === selectedSlide.id ||
                        (!slide.id &&
                          !selectedSlide.id &&
                          slide.sort_order === selectedSlide.sort_order)
                    ) || 0) + 1}
                  </h2>
                </div>

                <button
                  type="button"
                  className={selectedSlide.active ? "status-pill active" : "status-pill"}
                  onClick={() =>
                    setSelectedSlide({
                      ...selectedSlide,
                      active: !selectedSlide.active,
                    })
                  }
                >
                  <span />
                  {selectedSlide.active ? "Activo" : "Oculto"}
                </button>
              </div>

              <div className="image-section">
                <div className="section-label">
                  <span>01</span>
                  <div>
                    <strong>Imagen principal</strong>
                    <small>Formato recomendado 16:9</small>
                  </div>
                </div>

                <label className={`hero-upload ${selectedSlide.image_url ? "has-image" : ""}`}>
                  {selectedSlide.image_url ? (
                    <img src={selectedSlide.image_url} alt="Vista previa del Hero" />
                  ) : (
                    <div className="upload-empty">
                      <span>＋</span>
                      <strong>Agregar imagen</strong>
                      <small>JPG, PNG o WebP</small>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />

                  {uploading && <div className="uploading">Subiendo foto...</div>}

                  {selectedSlide.image_url && !uploading && (
                    <div className="change-image">Cambiar imagen</div>
                  )}
                </label>
              </div>

              <div className="content-section">
                <div className="section-label">
                  <span>02</span>
                  <div>
                    <strong>Contenido</strong>
                    <small>Texto que aparecerá sobre el Hero</small>
                  </div>
                </div>

                <EditableField
                  key={`title-${selectedSlide.id || selectedSlide.sort_order || "new"}`}
                  label="Título"
                  value={selectedSlide.title ?? ""}
                  onChange={(v: string) =>
                    setSelectedSlide({ ...selectedSlide, title: v })
                  }
                />

                <EditableField
                  key={`subtitle-${selectedSlide.id || selectedSlide.sort_order || "new"}`}
                  label="Subtítulo"
                  value={selectedSlide.subtitle ?? ""}
                  onChange={(v: string) =>
                    setSelectedSlide({ ...selectedSlide, subtitle: v })
                  }
                />

                <div className="two-fields">
                  <InputField
                    label="Texto del botón"
                    value={selectedSlide.button_text ?? ""}
                    onChange={(v: string) =>
                      setSelectedSlide({ ...selectedSlide, button_text: v })
                    }
                  />

                  <InputField
                    label="URL"
                    value={selectedSlide.button_url ?? ""}
                    onChange={(v: string) =>
                      setSelectedSlide({ ...selectedSlide, button_url: v })
                    }
                  />
                </div>
              </div>

              <div className="preview-section">
                <div className="section-label">
                  <span>03</span>
                  <div>
                    <strong>Vista rápida</strong>
                    <small>Así se verá la promoción</small>
                  </div>
                </div>

                <div className="hero-preview">
                  {selectedSlide.image_url ? (
                    <img src={selectedSlide.image_url} alt="" />
                  ) : (
                    <div className="preview-placeholder">Sin imagen</div>
                  )}

                  <div className="preview-overlay">
                    <div>
                      <strong
                        dangerouslySetInnerHTML={{
                          __html: selectedSlide.title || "Título de tu promoción",
                        }}
                      />
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedSlide.subtitle ||
                            "Descripción de tu promoción",
                        }}
                      />
                      {selectedSlide.button_text && (
                        <b>{selectedSlide.button_text}</b>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={saveSlide}
                disabled={saving || uploading}
                className="save-button"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </section>
          )}
        </div>

        <style jsx global>{`
          .hero-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 36px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .hero-shell {
            width:100%;
            max-width:720px;
            margin:0 auto;
          }

          .hero-header {
            margin-bottom:9px;
          }

          .header-row {
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:8px;
            margin-top:8px;
          }

          .eyebrow {
            display:block;
            color:#f97316;
            font-size:7px;
            font-weight:900;
            letter-spacing:1.2px;
          }

          .header-row h1 {
            margin:2px 0 0;
            font-size:23px;
            line-height:1.05;
            letter-spacing:-.55px;
            font-weight:900;
          }

          .header-row p {
            margin:4px 0 0;
            color:rgba(255,255,255,.32);
            font-size:8px;
          }

          .add-top {
            min-height:31px;
            padding:0 10px;
            border:1px solid rgba(249,115,22,.18);
            border-radius:8px;
            background:rgba(249,115,22,.065);
            color:#f97316;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .add-top span {
            font-size:12px;
            vertical-align:-1px;
          }

          .mobile-slide-picker {
            padding:9px;
            margin-bottom:6px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:11px;
            background:#101010;
          }

          .picker-label {
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:6px;
          }

          .picker-label span {
            color:rgba(255,255,255,.28);
            font-size:7px;
            font-weight:850;
            letter-spacing:.8px;
          }

          .picker-label strong {
            color:#f97316;
            font-size:8px;
          }

          .slide-tabs {
            display:flex;
            gap:5px;
            overflow-x:auto;
            scrollbar-width:none;
            padding-bottom:1px;
          }

          .slide-tabs::-webkit-scrollbar {
            display:none;
          }

          .slide-tab {
            min-width:155px;
            display:flex;
            align-items:center;
            gap:6px;
            padding:7px;
            border:1px solid rgba(255,255,255,.05);
            border-radius:8px;
            background:#0b0b0b;
            color:#fff;
            text-align:left;
            cursor:pointer;
          }

          .slide-tab.selected {
            border-color:rgba(249,115,22,.35);
            background:rgba(249,115,22,.06);
          }

          .tab-number {
            width:23px;
            height:23px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:6px;
            background:rgba(249,115,22,.08);
            color:#f97316;
            font-size:7px;
            font-weight:900;
          }

          .tab-copy {
            min-width:0;
            flex:1;
          }

          .tab-copy strong,
          .tab-copy small {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }

          .tab-copy strong {
            font-size:8px;
          }

          .tab-copy small {
            margin-top:2px;
            color:rgba(255,255,255,.25);
            font-size:6.5px;
          }

          .tab-status {
            width:6px;
            height:6px;
            flex-shrink:0;
            border-radius:50%;
            background:#ef4444;
          }

          .tab-status.on {
            background:#22c55e;
          }

          .empty-slides {
            display:flex;
            align-items:center;
            gap:7px;
            padding:6px 2px;
            color:rgba(255,255,255,.25);
            font-size:7px;
          }

          .empty-slides button {
            border:0;
            background:transparent;
            color:#f97316;
            font:800 7px system-ui,sans-serif;
            cursor:pointer;
          }

          .editor,
          .empty-editor {
            padding:10px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:11px;
            background:#101010;
          }

          .editor-top {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-bottom:10px;
          }

          .editor-top h2 {
            margin:2px 0 0;
            font-size:14px;
            line-height:1;
            font-weight:900;
          }

          .status-pill {
            display:flex;
            align-items:center;
            gap:4px;
            padding:5px 7px;
            border:0;
            border-radius:999px;
            background:rgba(239,68,68,.07);
            color:#ef4444;
            font:800 6.5px system-ui,sans-serif;
            text-transform:uppercase;
            cursor:pointer;
          }

          .status-pill.active {
            background:rgba(34,197,94,.08);
            color:#22c55e;
          }

          .status-pill span {
            width:5px;
            height:5px;
            border-radius:50%;
            background:currentColor;
          }

          .section-label {
            display:flex;
            align-items:center;
            gap:7px;
            margin-bottom:8px;
          }

          .section-label > span {
            width:24px;
            height:24px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:7px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:7px;
            font-weight:900;
          }

          .section-label strong {
            display:block;
            font-size:9px;
            font-weight:850;
          }

          .section-label small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.22);
            font-size:6.5px;
          }

          .image-section,
          .content-section,
          .preview-section {
            padding:9px 0;
          }

          .content-section,
          .preview-section {
            border-top:1px solid rgba(255,255,255,.045);
          }

          .hero-upload {
            position:relative;
            display:block;
            min-height:170px;
            overflow:hidden;
            border:1px dashed rgba(249,115,22,.2);
            border-radius:9px;
            background:#0b0b0b;
            cursor:pointer;
          }

          .hero-upload input {
            position:absolute;
            inset:0;
            z-index:4;
            width:100%;
            height:100%;
            opacity:0;
            cursor:pointer;
          }

          .hero-upload img {
            display:block;
            width:100%;
            height:170px;
            object-fit:cover;
          }

          .upload-empty {
            min-height:170px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:4px;
          }

          .upload-empty > span {
            width:34px;
            height:34px;
            display:grid;
            place-items:center;
            margin-bottom:2px;
            border-radius:9px;
            background:rgba(249,115,22,.1);
            color:#f97316;
            font-size:20px;
          }

          .upload-empty strong {
            color:rgba(255,255,255,.62);
            font-size:9px;
          }

          .upload-empty small {
            color:rgba(255,255,255,.23);
            font-size:7px;
          }

          .change-image,
          .uploading {
            position:absolute;
            left:7px;
            right:7px;
            bottom:7px;
            z-index:5;
            padding:6px;
            border-radius:6px;
            background:rgba(0,0,0,.78);
            color:#fff;
            font-size:7px;
            font-weight:750;
            text-align:center;
            pointer-events:none;
          }

          .two-fields {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:5px;
          }

          .hero-preview {
            position:relative;
            overflow:hidden;
            aspect-ratio:16 / 9;
            border:1px solid rgba(255,255,255,.055);
            border-radius:9px;
            background:#0b0b0b;
          }

          .hero-preview > img {
            width:100%;
            height:100%;
            display:block;
            object-fit:cover;
          }

          .preview-placeholder {
            width:100%;
            height:100%;
            display:grid;
            place-items:center;
            color:rgba(255,255,255,.2);
            font-size:8px;
          }

          .preview-overlay {
            position:absolute;
            inset:auto 0 0;
            padding:28px 11px 10px;
            background:linear-gradient(transparent,rgba(0,0,0,.86));
          }

          .preview-overlay strong {
            display:block;
            max-width:90%;
            color:#fff;
            font-size:12px;
            font-weight:900;
          }

          .preview-overlay span {
            display:block;
            max-width:90%;
            margin-top:2px;
            color:rgba(255,255,255,.7);
            font-size:7px;
          }

          .preview-overlay b {
            display:inline-block;
            margin-top:5px;
            padding:4px 7px;
            border-radius:5px;
            background:#f97316;
            color:#fff;
            font-size:6px;
          }

          .save-button {
            width:100%;
            min-height:39px;
            margin-top:6px;
            border:0;
            border-radius:8px;
            background:#f97316;
            color:#fff;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .save-button:disabled {
            opacity:.5;
            cursor:not-allowed;
          }

          .empty-editor {
            min-height:240px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            text-align:center;
          }

          .empty-icon {
            width:40px;
            height:40px;
            display:grid;
            place-items:center;
            margin-bottom:8px;
            border-radius:11px;
            background:rgba(249,115,22,.08);
            color:#f97316;
            font-size:18px;
          }

          .empty-editor strong {
            font-size:10px;
          }

          .empty-editor > span {
            margin-top:3px;
            color:rgba(255,255,255,.25);
            font-size:7px;
          }

          .empty-editor button {
            margin-top:10px;
            padding:7px 10px;
            border:1px solid rgba(249,115,22,.18);
            border-radius:7px;
            background:rgba(249,115,22,.06);
            color:#f97316;
            font:800 7px system-ui,sans-serif;
            cursor:pointer;
          }

          .loading-page {
            display:grid;
            place-items:center;
          }

          .loading {
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          @media(max-width:390px) {
            .hero-page {
              padding-left:8px;
              padding-right:8px;
            }

            .two-fields {
              grid-template-columns:1fr;
            }

            .hero-upload,
            .hero-upload img,
            .upload-empty {
              min-height:145px;
              height:145px;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

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
    if (targetElement.nodeType === Node.TEXT_NODE) targetElement = targetElement.parentElement!;
    const isInternalSpan = targetElement !== editorRef.current && targetElement.tagName === "SPAN";
    let currentSize = 16;
    const computedSize = window.getComputedStyle(targetElement).fontSize;
    if (computedSize) currentSize = parseInt(computedSize, 10);
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
    if (editorRef.current) onChange(editorRef.current.innerHTML);
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
        style={{ width: "100%", minHeight: "85px", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px", fontSize: "16px", fontFamily: "inherit", boxSizing: "border-box", outline: "none", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
      />
    </div>
  );
}

const btnStyle = { background: "#1a1a1a", color: "#fff", border: "none", padding: "4px 14px", fontSize: "12px", borderRadius: "4px", cursor: "pointer", fontWeight: "700" as const, transition: "all 0.15s" };

function InputField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#777", fontSize: "12px" }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
    </div>
  );
}