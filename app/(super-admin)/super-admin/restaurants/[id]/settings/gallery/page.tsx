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
      <main className="gallery-page">
        <div className="gallery-shell">
          <header className="gallery-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">EXPERIENCIA · GALERÍA</span>
                <h1>Galería</h1>
                <p>Administra las imágenes que aparecen en tu restaurante.</p>
              </div>

              <label className="add-button">
                <span>＋</span>
                {uploading ? "Subiendo..." : "Agregar"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={uploadImage}
                  disabled={uploading}
                />
              </label>
            </div>
          </header>

          <section className="summary">
            <div>
              <span>Total</span>
              <strong>{images.length}</strong>
            </div>
            <div>
              <span>Visibles</span>
              <strong>{images.filter((i) => i.active).length}</strong>
            </div>
            <div className="summary-hint">
              <span>Galería</span>
              <strong>Activa</strong>
            </div>
          </section>

          <section className="gallery-section">
            <div className="section-top">
              <div>
                <span className="eyebrow">IMÁGENES</span>
                <h2>Tus fotos</h2>
              </div>
              <span className="count">{images.length}</span>
            </div>

            {images.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">＋</div>
                <strong>Aún no tienes imágenes</strong>
                <small>
                  Agrega fotos para crear una galería más atractiva.
                </small>
                <label className="empty-button">
                  Agregar primera imagen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={uploadImage}
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <div className="image-grid">
                {images.map((img, index) => (
                  <article
                    key={img.id}
                    className={img.active ? "image-item" : "image-item hidden"}
                  >
                    <div className="image-wrap">
                      <img
                        src={img.image_url}
                        alt={`Galería ${index + 1}`}
                      />

                      <div className="image-top">
                        <span className={img.active ? "status active" : "status"}>
                          <i />
                          {img.active ? "Visible" : "Oculta"}
                        </span>
                        <span className="image-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="image-actions">
                      <button
                        type="button"
                        className={img.active ? "action muted" : "action green"}
                        onClick={async () => {
                          await supabase
                            .from("restaurant_gallery")
                            .update({ active: !img.active })
                            .eq("id", img.id);
                          loadGallery();
                        }}
                      >
                        {img.active ? "Ocultar" : "Mostrar"}
                      </button>

                      <button
                        type="button"
                        className="action delete"
                        onClick={async () => {
                          if (confirm("¿Eliminar esta imagen?")) {
                            await supabase
                              .from("restaurant_gallery")
                              .delete()
                              .eq("id", img.id);
                            loadGallery();
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <style jsx global>{`
          .gallery-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .gallery-shell {
            width:100%;
            max-width:760px;
            margin:0 auto;
          }

          .gallery-header {
            margin-bottom:8px;
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
            line-height:1.4;
          }

          .add-button,
          .empty-button {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:4px;
            min-height:31px;
            padding:0 10px;
            box-sizing:border-box;
            border:1px solid rgba(249,115,22,.18);
            border-radius:8px;
            background:rgba(249,115,22,.065);
            color:#f97316;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
            text-decoration:none;
          }

          .add-button {
            flex-shrink:0;
          }

          .add-button span {
            font-size:12px;
          }

          .add-button input,
          .empty-button input {
            display:none;
          }

          .summary {
            display:grid;
            grid-template-columns:1fr 1fr 1.2fr;
            gap:5px;
            margin-bottom:7px;
          }

          .summary > div {
            min-width:0;
            padding:8px;
            border:1px solid rgba(255,255,255,.05);
            border-radius:9px;
            background:#101010;
          }

          .summary span {
            display:block;
            color:rgba(255,255,255,.24);
            font-size:6px;
            font-weight:800;
            text-transform:uppercase;
            letter-spacing:.5px;
          }

          .summary strong {
            display:block;
            margin-top:3px;
            color:#f97316;
            font-size:13px;
            line-height:1;
          }

          .summary-hint strong {
            color:#22c55e;
            font-size:9px;
            margin-top:4px;
          }

          .gallery-section {
            padding:10px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:11px;
            background:#101010;
          }

          .section-top {
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:8px;
          }

          .section-top h2 {
            margin:2px 0 0;
            font-size:11px;
            line-height:1;
            font-weight:900;
          }

          .count {
            min-width:23px;
            height:23px;
            display:grid;
            place-items:center;
            border-radius:7px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:7px;
            font-weight:900;
          }

          .image-grid {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:5px;
          }

          .image-item {
            min-width:0;
            overflow:hidden;
            border:1px solid rgba(255,255,255,.055);
            border-radius:9px;
            background:#0b0b0b;
          }

          .image-item.hidden {
            opacity:.58;
          }

          .image-wrap {
            position:relative;
            aspect-ratio:1 / .78;
            overflow:hidden;
            background:#0b0b0b;
          }

          .image-wrap img {
            width:100%;
            height:100%;
            display:block;
            object-fit:cover;
          }

          .image-top {
            position:absolute;
            top:5px;
            left:5px;
            right:5px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:4px;
          }

          .status {
            display:inline-flex;
            align-items:center;
            gap:3px;
            padding:4px 5px;
            border-radius:999px;
            background:rgba(0,0,0,.68);
            color:#ef4444;
            font-size:5.5px;
            font-weight:850;
            text-transform:uppercase;
            backdrop-filter:blur(5px);
          }

          .status.active {
            color:#22c55e;
          }

          .status i {
            width:4px;
            height:4px;
            border-radius:50%;
            background:currentColor;
          }

          .image-number {
            padding:4px 5px;
            border-radius:999px;
            background:rgba(0,0,0,.68);
            color:rgba(255,255,255,.62);
            font-size:5.5px;
            font-weight:850;
            backdrop-filter:blur(5px);
          }

          .image-actions {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:4px;
            padding:5px;
          }

          .action {
            min-height:27px;
            padding:0 5px;
            border:1px solid transparent;
            border-radius:6px;
            background:transparent;
            font:800 6.5px system-ui,sans-serif;
            cursor:pointer;
          }

          .action.muted {
            border-color:rgba(255,255,255,.05);
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.45);
          }

          .action.green {
            border-color:rgba(34,197,94,.14);
            background:rgba(34,197,94,.05);
            color:#22c55e;
          }

          .action.delete {
            border-color:rgba(239,68,68,.12);
            background:rgba(239,68,68,.04);
            color:#ef4444;
          }

          .empty {
            min-height:220px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            padding:20px;
            text-align:center;
            border:1px dashed rgba(249,115,22,.15);
            border-radius:9px;
            background:rgba(249,115,22,.02);
          }

          .empty-icon {
            width:38px;
            height:38px;
            display:grid;
            place-items:center;
            margin-bottom:8px;
            border-radius:10px;
            background:rgba(249,115,22,.08);
            color:#f97316;
            font-size:20px;
          }

          .empty strong {
            font-size:9px;
          }

          .empty small {
            max-width:220px;
            margin-top:4px;
            color:rgba(255,255,255,.24);
            font-size:7px;
            line-height:1.45;
          }

          .empty-button {
            margin-top:10px;
          }

          @media(max-width:390px) {
            .gallery-page {
              padding-left:8px;
              padding-right:8px;
            }

            .gallery-section {
              padding:9px;
            }

            .summary-hint {
              display:none;
            }

            .summary {
              grid-template-columns:1fr 1fr;
            }
          }

          @media(min-width:700px) {
            .image-grid {
              grid-template-columns:repeat(3,minmax(0,1fr));
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}