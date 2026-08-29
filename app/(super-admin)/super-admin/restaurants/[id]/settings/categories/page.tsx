 "use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface Category {
  id: string;
  name: string;
  sort_order: number | null;
  active: boolean | null;
}

export default function CategoriesPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    void loadCategories();
  }, [restaurantId]);

  async function loadCategories() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, sort_order, active")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      setCategories((data ?? []) as Category[]);
      setOrderDirty(false);
      setOrderMessage("");
    } catch (error) {
      console.error("Error cargando categorías:", error);
      setOrderMessage("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }

  function renumber(items: Category[]) {
    return items.map((category, index) => ({
      ...category,
      sort_order: index + 1,
    }));
  }

  function moveCategory(categoryId: string, direction: "up" | "down") {
    setCategories((current) => {
      const index = current.findIndex((category) => category.id === categoryId);
      if (index < 0) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return renumber(next);
    });

    setOrderDirty(true);
    setOrderMessage("Cambios pendientes");
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    setCategories((current) => {
      const from = current.findIndex((category) => category.id === draggedId);
      const to = current.findIndex((category) => category.id === targetId);

      if (from < 0 || to < 0) return current;

      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);

      return renumber(next);
    });

    setDraggedId(null);
    setOrderDirty(true);
    setOrderMessage("Cambios pendientes");
  }

  async function saveOrder() {
    if (!orderDirty || savingOrder) return;

    setSavingOrder(true);
    setOrderMessage("Guardando orden...");

    try {
      const results = await Promise.all(
        categories.map((category, index) =>
          supabase
            .from("categories")
            .update({ sort_order: index + 1 })
            .eq("id", category.id)
            .eq("restaurant_id", restaurantId)
        )
      );

      const failed = results.find((result) => result.error);
      if (failed?.error) throw failed.error;

      setCategories((current) => renumber(current));
      setOrderDirty(false);
      setOrderMessage("Orden guardado");
    } catch (error) {
      console.error("Error guardando orden:", error);
      setOrderMessage("No se pudo guardar el orden.");
      await loadCategories();
    } finally {
      setSavingOrder(false);
    }
  }

  async function createCategory() {
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      const nextOrder =
        categories.reduce(
          (max, category) => Math.max(max, category.sort_order ?? 0),
          0
        ) + 1;

      const { error } = await supabase.from("categories").insert({
        restaurant_id: restaurantId,
        name: newCategory.trim(),
        active: true,
        sort_order: nextOrder,
      });

      if (error) throw error;

      setNewCategory("");
      await loadCategories();
    } catch (error) {
      console.error("Error creando categoría:", error);
      setOrderMessage("No se pudo crear la categoría.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function saveEdit(id: string) {
    if (!editingName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: editingName.trim() })
        .eq("id", id)
        .eq("restaurant_id", restaurantId);

      if (error) throw error;

      setEditingId(null);
      setEditingName("");
      await loadCategories();
    } catch (error) {
      console.error("Error editando categoría:", error);
      setOrderMessage("No se pudo actualizar la categoría.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("restaurant_id", restaurantId);

      if (error) throw error;
      await loadCategories();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      alert(
        "No se pudo eliminar. Asegúrate de que la categoría no tenga productos asociados."
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(category: Category) {
    const nextActive = !Boolean(category.active);

    setCategories((current) =>
      current.map((item) =>
        item.id === category.id ? { ...item, active: nextActive } : item
      )
    );

    const { error } = await supabase
      .from("categories")
      .update({ active: nextActive })
      .eq("id", category.id)
      .eq("restaurant_id", restaurantId);

    if (error) {
      console.error("Error actualizando estado:", error);
      await loadCategories();
      return;
    }
  }

  const activeCount = useMemo(
    () => categories.filter((category) => category.active).length,
    [categories]
  );

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
                <p>
                  Organiza el orden del menú público y de la gestión de
                  productos.
                </p>
              </div>

              <span className="count-badge">{categories.length}</span>
            </div>
          </header>

          <section className="create-bar">
            <input
              placeholder="Nueva categoría..."
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void createCategory();
              }}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => void createCategory()}
              disabled={loading || !newCategory.trim()}
              aria-label="Crear categoría"
              title="Crear categoría"
            >
              <Plus size={17} strokeWidth={2} />
            </button>
          </section>

          <section className="order-toolbar">
            <div>
              <strong>Orden del menú</strong>
              <span>
                Arrastra una categoría o usa las flechas para cambiar su
                posición.
              </span>
            </div>

            <button
              type="button"
              className="save-order"
              onClick={() => void saveOrder()}
              disabled={!orderDirty || savingOrder}
            >
              <Save size={15} strokeWidth={2} />
              {savingOrder ? "Guardando..." : "Guardar orden"}
            </button>
          </section>

          <div className="category-summary">
            <span>{categories.length} categorías</span>
            <span>{activeCount} activas</span>
            <span className={orderDirty ? "pending" : "saved"}>
              {orderMessage || "Orden sincronizado"}
            </span>
          </div>

          <section className="category-list">
            {categories.map((category, index) => {
              const active = Boolean(category.active);
              const isFirst = index === 0;
              const isLast = index === categories.length - 1;

              return (
                <article
                  key={category.id}
                  className={`category-row ${active ? "active" : "inactive"} ${
                    draggedId === category.id ? "dragging" : ""
                  }`}
                  draggable={editingId !== category.id && !savingOrder}
                  onDragStart={() => setDraggedId(category.id)}
                  onDragEnd={() => setDraggedId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(category.id)}
                >
                  {editingId === category.id ? (
                    <div className="editing-row">
                      <div className="category-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        autoFocus
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void saveEdit(category.id);
                          if (event.key === "Escape") {
                            setEditingId(null);
                            setEditingName("");
                          }
                        }}
                      />

                      <button
                        type="button"
                        className="confirm"
                        onClick={() => void saveEdit(category.id)}
                        disabled={loading || !editingName.trim()}
                        aria-label="Guardar nombre"
                        title="Guardar"
                      >
                        <Check size={15} />
                      </button>

                      <button
                        type="button"
                        className="cancel"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        aria-label="Cancelar edición"
                        title="Cancelar"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="drag-handle"
                        aria-label={`Mover ${category.name}`}
                        title="Arrastra para mover"
                        tabIndex={-1}
                      >
                        <GripVertical size={17} />
                      </button>

                      <div className="category-main">
                        <div className="category-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="category-copy">
                          <strong>{category.name}</strong>
                          <small>
                            {active ? "Visible en el menú" : "Oculta del menú"}
                          </small>
                        </div>
                      </div>

                      <div className="category-actions">
                        <label
                          className="switch"
                          title={active ? "Ocultar categoría" : "Mostrar categoría"}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => void toggleActive(category)}
                          />
                          <span />
                        </label>

                        <div className="move-actions" aria-label="Mover categoría">
                          <button
                            type="button"
                            onClick={() => moveCategory(category.id, "up")}
                            disabled={isFirst || savingOrder}
                            aria-label={`Subir ${category.name}`}
                            title="Subir"
                          >
                            <ChevronUp size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => moveCategory(category.id, "down")}
                            disabled={isLast || savingOrder}
                            aria-label={`Bajar ${category.name}`}
                            title="Bajar"
                          >
                            <ChevronDown size={15} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => startEditing(category)}
                          aria-label={`Editar ${category.name}`}
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          className="icon-button delete"
                          onClick={() => void deleteCategory(category.id)}
                          disabled={loading}
                          aria-label={`Eliminar ${category.name}`}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}

            {categories.length === 0 && !loading && (
              <div className="empty-state">
                <Plus size={22} />
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
            min-height: 100vh;
            width: 100%;
            box-sizing: border-box;
            padding: 16px 12px 42px;
            background:
              radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.06), transparent 32%),
              #050505;
            color: #fff;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .categories-wrap {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
          }

          .categories-header {
            margin-bottom: 14px;
          }

          .eyebrow {
            margin-top: 8px;
            color: #f97316;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .title-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 4px;
          }

          .title-line h1 {
            margin: 0;
            font-size: 24px;
            line-height: 1.1;
            letter-spacing: -0.6px;
            font-weight: 850;
          }

          .title-line p {
            margin: 5px 0 0;
            max-width: 560px;
            color: rgba(255, 255, 255, 0.4);
            font-size: 9px;
            line-height: 1.5;
          }

          .count-badge {
            display: grid;
            place-items: center;
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            border: 1px solid rgba(249, 115, 22, 0.2);
            border-radius: 9px;
            background: rgba(249, 115, 22, 0.07);
            color: #f97316;
            font-size: 10px;
            font-weight: 850;
          }

          .create-bar {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 10px;
          }

          .create-bar input {
            flex: 1;
            min-width: 0;
            height: 38px;
            box-sizing: border-box;
            padding: 7px 10px;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 9px;
            background: #0b0f16;
            color: #fff;
            outline: none;
            font: 500 9px system-ui, sans-serif;
          }

          .create-bar input:focus {
            border-color: rgba(249, 115, 22, 0.45);
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.05);
          }

          .create-bar button,
          .save-order,
          .icon-button,
          .move-actions button,
          .confirm,
          .cancel {
            display: inline-grid;
            place-items: center;
            border: 0;
            cursor: pointer;
          }

          .create-bar button {
            width: 38px;
            height: 38px;
            border-radius: 9px;
            background: #f97316;
            color: #fff;
          }

          .create-bar button:disabled,
          .save-order:disabled,
          .move-actions button:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }

          .order-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 10px 11px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 11px;
            background: rgba(255, 255, 255, 0.025);
          }

          .order-toolbar > div {
            min-width: 0;
          }

          .order-toolbar strong {
            display: block;
            font-size: 9px;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.82);
          }

          .order-toolbar span {
            display: block;
            margin-top: 2px;
            color: rgba(255, 255, 255, 0.28);
            font-size: 7px;
          }

          .save-order {
            flex-shrink: 0;
            gap: 6px;
            min-height: 32px;
            padding: 0 11px;
            border: 1px solid rgba(249, 115, 22, 0.14);
            border-radius: 8px;
            background: rgba(249, 115, 22, 0.1);
            color: #f97316;
            font: 800 8px system-ui, sans-serif;
          }

          .category-summary {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            padding: 7px 1px 6px;
            color: rgba(255, 255, 255, 0.24);
            font-size: 7px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .category-summary .saved {
            color: rgba(34, 197, 94, 0.75);
          }

          .category-summary .pending {
            color: rgba(249, 115, 22, 0.9);
          }

          .category-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .category-row {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 7px 8px;
            border: 1px solid rgba(255, 255, 255, 0.055);
            border-radius: 10px;
            background: rgba(17, 24, 39, 0.58);
            transition:
              border-color 160ms ease,
              background 160ms ease,
              transform 160ms ease,
              opacity 160ms ease;
          }

          .category-row:hover {
            border-color: rgba(249, 115, 22, 0.12);
            background: rgba(18, 25, 38, 0.72);
          }

          .category-row.dragging {
            opacity: 0.45;
            transform: scale(0.99);
          }

          .category-row.inactive {
            background: rgba(17, 17, 17, 0.48);
          }

          .drag-handle {
            display: grid;
            place-items: center;
            flex-shrink: 0;
            width: 24px;
            height: 30px;
            padding: 0;
            border: 0;
            background: transparent;
            color: rgba(255, 255, 255, 0.2);
            cursor: grab;
          }

          .drag-handle:active {
            cursor: grabbing;
          }

          .category-main,
          .editing-row {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
            flex: 1;
          }

          .category-number {
            width: 28px;
            height: 28px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            border-radius: 7px;
            background: rgba(255, 255, 255, 0.035);
            color: rgba(255, 255, 255, 0.25);
            font-size: 7px;
            font-weight: 800;
          }

          .active .category-number {
            color: #f97316;
            background: rgba(249, 115, 22, 0.07);
          }

          .category-copy {
            min-width: 0;
            flex: 1;
          }

          .category-copy strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: rgba(255, 255, 255, 0.82);
            font-size: 9px;
            font-weight: 800;
          }

          .inactive .category-copy strong {
            color: rgba(255, 255, 255, 0.4);
          }

          .category-copy small {
            display: block;
            margin-top: 2px;
            color: rgba(255, 255, 255, 0.22);
            font-size: 7px;
          }

          .category-actions {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
          }

          .switch {
            position: relative;
            width: 31px;
            height: 18px;
            flex-shrink: 0;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .switch span {
            position: absolute;
            inset: 0;
            border-radius: 999px;
            background: #30343a;
            cursor: pointer;
            transition: 0.18s;
          }

          .switch span:before {
            content: "";
            position: absolute;
            width: 14px;
            height: 14px;
            left: 2px;
            top: 2px;
            border-radius: 50%;
            background: #fff;
            transition: 0.18s;
          }

          .switch input:checked + span {
            background: #22c55e;
          }

          .switch input:checked + span:before {
            transform: translateX(13px);
          }

          .move-actions {
            display: flex;
            align-items: center;
            gap: 2px;
          }

          .move-actions button,
          .icon-button {
            width: 27px;
            height: 27px;
            flex-shrink: 0;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 7px;
            background: rgba(255, 255, 255, 0.035);
            color: rgba(255, 255, 255, 0.62);
          }

          .icon-button.delete {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.055);
            border-color: rgba(239, 68, 68, 0.11);
          }

          .editing-row input {
            flex: 1;
            min-width: 0;
            height: 30px;
            box-sizing: border-box;
            padding: 5px 8px;
            border: 1px solid rgba(249, 115, 22, 0.35);
            border-radius: 7px;
            background: #0b0f16;
            color: #fff;
            outline: none;
            font: 700 9px system-ui, sans-serif;
          }

          .confirm,
          .cancel {
            width: 27px;
            height: 27px;
            flex-shrink: 0;
            border-radius: 7px;
            color: #fff;
          }

          .confirm {
            background: #22c55e;
          }

          .cancel {
            background: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.5);
          }

          .empty-state {
            display: grid;
            place-items: center;
            gap: 4px;
            padding: 30px 12px;
            border: 1px dashed rgba(255, 255, 255, 0.07);
            border-radius: 10px;
            text-align: center;
            color: rgba(255, 255, 255, 0.3);
          }

          .empty-state svg {
            color: #f97316;
          }

          .empty-state strong {
            color: rgba(255, 255, 255, 0.6);
            font-size: 9px;
          }

          .empty-state small {
            font-size: 7px;
          }

          @media (max-width: 560px) {
            .order-toolbar {
              align-items: flex-start;
              flex-direction: column;
            }

            .save-order {
              width: 100%;
              justify-content: center;
            }

            .category-row {
              padding: 8px 7px;
            }

            .drag-handle {
              width: 22px;
            }

            .move-actions button,
            .icon-button {
              width: 28px;
              height: 28px;
            }
          }

          @media (max-width: 390px) {
            .categories-page {
              padding-left: 9px;
              padding-right: 9px;
            }

            .category-copy small {
              display: none;
            }

            .switch {
              transform: scale(0.94);
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}
