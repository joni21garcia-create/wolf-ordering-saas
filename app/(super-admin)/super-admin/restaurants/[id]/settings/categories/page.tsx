"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CategoriesPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  // 1. CARGAR CATEGORÍAS
  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: true });
    setCategories(data || []);
  };

  // 2. CREAR CATEGORÍA
  const createCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    await supabase.from("categories").insert({
      restaurant_id: restaurantId,
      name: newCategory.trim(),
      active: true,
      sort_order: categories.length + 1,
    });
    setNewCategory("");
    await loadCategories();
    setLoading(false);
  };

  // 3. INICIAR EDICIÓN
  const startEditing = (category: any) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // 4. GUARDAR EDICIÓN
  const saveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from("categories")
      .update({ name: editingName.trim() })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      setEditingName("");
      await loadCategories();
    }
    setLoading(false);
  };

  // 5. ELIMINAR CATEGORÍA
  const deleteCategory = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    setLoading(true);
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (!error) {
      await loadCategories();
    } else {
      alert("No se pudo eliminar. Asegúrate de que la categoría no tenga productos asociados.");
    }
    setLoading(false);
  };

  // 6. ACTIVAR / DESACTIVAR (Switch Android)
  const toggleActive = async (id: string, currentStatus: boolean) => {
    // Actualización optimista local rápida
    setCategories(prev =>
      prev.map(c => c.id === id ? { ...c, active: !currentStatus } : c)
    );

    const { error } = await supabase
      .from("categories")
      .update({ active: !currentStatus })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar el estado");
      await loadCategories();
    }
  };

  return (
    <PermissionGuard permission="categories">
      <main className="categories-page">
        <div className="categories-wrap">
          <header className="categories-header">
            <BackToSettings restaurantId={restaurantId} />
            <div className="eyebrow">Configuración · Menú</div>

            <div className="title-line">
              <div>
                <h1>Categorías</h1>
                <p>Organiza tu menú de forma rápida y limpia.</p>
              </div>

              <span className="count-badge">
                {categories.length}
              </span>
            </div>
          </header>

          <section className="create-bar">
            <input
              placeholder="Nueva categoría..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createCategory();
              }}
              disabled={loading}
            />

            <button
              onClick={createCategory}
              disabled={loading || !newCategory.trim()}
              aria-label="Crear categoría"
            >
              {loading ? "..." : "+"}
            </button>
          </section>

          <div className="category-summary">
            <span>{categories.length} categorías</span>
            <span>
              {categories.filter((c) => c.active).length} activas
            </span>
          </div>

          {loading && (
            <div className="processing">Guardando...</div>
          )}

          <section className="category-list">
            {categories.map((cat, index) => (
              <article
                key={cat.id}
                className={`category-row ${cat.active ? "active" : "inactive"}`}
              >
                {editingId === cat.id ? (
                  <div className="editing-row">
                    <div className="category-number">{index + 1}</div>

                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(cat.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />

                    <button
                      className="confirm"
                      onClick={() => saveEdit(cat.id)}
                      disabled={loading || !editingName.trim()}
                    >
                      ✓
                    </button>

                    <button
                      className="cancel"
                      onClick={() => setEditingId(null)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="category-main">
                      <div className="category-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="category-copy">
                        <strong>{cat.name}</strong>
                        <small>
                          {cat.active ? "Visible en el menú" : "Oculta del menú"}
                        </small>
                      </div>
                    </div>

                    <div className="category-actions">
                      <label
                        className="switch"
                        title={cat.active ? "Ocultar" : "Mostrar"}
                      >
                        <input
                          type="checkbox"
                          checked={cat.active}
                          onChange={() => toggleActive(cat.id, cat.active)}
                        />
                        <span />
                      </label>

                      <button
                        className="icon-button"
                        onClick={() => startEditing(cat)}
                        aria-label={`Editar ${cat.name}`}
                      >
                        ✎
                      </button>

                      <button
                        className="icon-button delete"
                        onClick={() => deleteCategory(cat.id)}
                        disabled={loading}
                        aria-label={`Eliminar ${cat.name}`}
                      >
                        🗑
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}

            {categories.length === 0 && !loading && (
              <div className="empty-state">
                <span>＋</span>
                <strong>Aún no tienes categorías</strong>
                <small>
                  Crea la primera para empezar a organizar tus productos.
                </small>
              </div>
            )}
          </section>
        </div>

        <style jsx global>{`
          .categories-page {
            min-height:100vh;
            width:100%;
            box-sizing:border-box;
            padding:16px 12px 36px;
            background:#050505;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .categories-wrap {
            width:100%;
            max-width:650px;
            margin:0 auto;
          }

          .categories-header {
            margin-bottom:11px;
          }

          .eyebrow {
            margin-top:8px;
            color:#f97316;
            font-size:8px;
            font-weight:800;
            letter-spacing:1px;
            text-transform:uppercase;
          }

          .title-line {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:3px;
          }

          .title-line h1 {
            margin:0;
            font-size:23px;
            line-height:1.1;
            letter-spacing:-.5px;
            font-weight:850;
          }

          .title-line p {
            margin:4px 0 0;
            color:rgba(255,255,255,.35);
            font-size:9px;
          }

          .count-badge {
            display:grid;
            place-items:center;
            width:28px;
            height:28px;
            flex-shrink:0;
            border:1px solid rgba(249,115,22,.2);
            border-radius:8px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:10px;
            font-weight:850;
          }

          .create-bar {
            display:flex;
            align-items:center;
            gap:5px;
            margin-bottom:6px;
          }

          .create-bar input {
            flex:1;
            min-width:0;
            height:36px;
            box-sizing:border-box;
            padding:7px 9px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:8px;
            background:#0b0f16;
            color:#fff;
            outline:none;
            font:500 9px system-ui,sans-serif;
          }

          .create-bar input:focus {
            border-color:rgba(249,115,22,.4);
            box-shadow:0 0 0 3px rgba(249,115,22,.05);
          }

          .create-bar button {
            width:36px;
            height:36px;
            border:0;
            border-radius:8px;
            background:#f97316;
            color:#fff;
            font:800 17px system-ui,sans-serif;
            cursor:pointer;
          }

          .create-bar button:disabled {
            opacity:.4;
            cursor:not-allowed;
          }

          .category-summary {
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:2px 1px 6px;
            color:rgba(255,255,255,.25);
            font-size:7px;
            text-transform:uppercase;
            letter-spacing:.5px;
          }

          .processing {
            margin-bottom:5px;
            color:#f97316;
            font-size:8px;
            text-align:center;
          }

          .category-list {
            display:flex;
            flex-direction:column;
            gap:5px;
          }

          .category-row {
            min-width:0;
            padding:8px 9px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:9px;
            background:rgba(17,24,39,.58);
          }

          .category-row.inactive {
            background:rgba(17,17,17,.48);
          }

          .category-main,
          .editing-row {
            display:flex;
            align-items:center;
            gap:8px;
            min-width:0;
          }

          .category-number {
            width:28px;
            height:28px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.25);
            font-size:7px;
            font-weight:800;
          }

          .active .category-number {
            color:#f97316;
            background:rgba(249,115,22,.07);
          }

          .category-copy {
            min-width:0;
            flex:1;
          }

          .category-copy strong {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.82);
            font-size:9px;
            font-weight:800;
          }

          .inactive .category-copy strong {
            color:rgba(255,255,255,.4);
          }

          .category-copy small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.22);
            font-size:7px;
          }

          .category-actions {
            display:flex;
            align-items:center;
            gap:4px;
            flex-shrink:0;
          }

          .switch {
            position:relative;
            width:31px;
            height:18px;
            flex-shrink:0;
          }

          .switch input {
            opacity:0;
            width:0;
            height:0;
          }

          .switch span {
            position:absolute;
            inset:0;
            border-radius:999px;
            background:#30343a;
            cursor:pointer;
            transition:.18s;
          }

          .switch span:before {
            content:"";
            position:absolute;
            width:14px;
            height:14px;
            left:2px;
            top:2px;
            border-radius:50%;
            background:#fff;
            transition:.18s;
          }

          .switch input:checked + span {
            background:#22c55e;
          }

          .switch input:checked + span:before {
            transform:translateX(13px);
          }

          .icon-button {
            width:27px;
            height:27px;
            display:grid;
            place-items:center;
            padding:0;
            border:1px solid rgba(255,255,255,.06);
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.62);
            font-size:11px;
            cursor:pointer;
          }

          .icon-button.delete {
            color:#ef4444;
            background:rgba(239,68,68,.055);
            border-color:rgba(239,68,68,.11);
          }

          .icon-button:disabled {
            opacity:.45;
            cursor:not-allowed;
          }

          .editing-row input {
            flex:1;
            min-width:0;
            height:30px;
            box-sizing:border-box;
            padding:5px 8px;
            border:1px solid rgba(249,115,22,.35);
            border-radius:7px;
            background:#0b0f16;
            color:#fff;
            outline:none;
            font:700 9px system-ui,sans-serif;
          }

          .confirm,
          .cancel {
            width:27px;
            height:27px;
            flex-shrink:0;
            border:0;
            border-radius:7px;
            color:#fff;
            font-size:11px;
            cursor:pointer;
          }

          .confirm {
            background:#22c55e;
          }

          .cancel {
            background:rgba(255,255,255,.06);
            color:rgba(255,255,255,.5);
          }

          .empty-state {
            padding:30px 12px;
            border:1px dashed rgba(255,255,255,.07);
            border-radius:10px;
            text-align:center;
            color:rgba(255,255,255,.3);
          }

          .empty-state span {
            display:block;
            margin-bottom:5px;
            color:#f97316;
            font-size:22px;
          }

          .empty-state strong {
            display:block;
            color:rgba(255,255,255,.6);
            font-size:9px;
          }

          .empty-state small {
            display:block;
            margin-top:3px;
            font-size:7px;
          }

          @media(max-width:390px) {
            .categories-page {
              padding-left:9px;
              padding-right:9px;
            }

            .category-row {
              padding:8px;
            }

            .category-actions {
              gap:3px;
            }

            .icon-button {
              width:26px;
              height:26px;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}