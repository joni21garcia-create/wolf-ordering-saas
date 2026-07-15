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
    if (!newCategory) return;
    setLoading(true);
    await supabase.from("categories").insert({
      restaurant_id: restaurantId,
      name: newCategory,
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
      .update({ name: editingName })
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
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;

    setLoading(true);
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (!error) {
      await loadCategories();
    } else {
      alert("No se pudo eliminar. Asegúrate de que la categoría no tenga productos asociados.");
    }
    setLoading(false);
  };

  // 6. ACTIVAR / DESACTIVAR (Ocultar o Mostrar)
  const toggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    await supabase
      .from("categories")
      .update({ active: !currentStatus })
      .eq("id", id);
    
    await loadCategories();
    setLoading(false);
  };

  return (
    <PermissionGuard permission="categories">
      <main style={mainContainer}>
        <div style={contentWrapper}>
          
          {/* HEADER */}
          <header style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#6b7280" }}>
              <BackToSettings restaurantId={restaurantId} />
              <span>Configuración / Categorías</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "900", margin: 0 }}>📂 Categorías</h1>
          </header>

          {/* STATS */}
          <div style={gridContainer}>
            <StatCard title="Total" value={categories.length} />
            <StatCard title="Activas" value={categories.filter(c => c.active).length} />
            <StatCard title="Ocultas" value={categories.filter(c => !c.active).length} />
          </div>

          {/* CREAR */}
          <div style={formCard}>
            <input 
              placeholder="Nueva categoría (ej: Hamburguesas)" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              style={inputStyle}
            />
            <button onClick={createCategory} disabled={loading} style={primaryBtn}>
              {loading ? "Procesando..." : "+ Crear Categoría"}
            </button>
          </div>

          {/* LISTADO */}
          <div style={{ display: "grid", gap: "12px" }}>
            {categories.map((cat) => (
              <div key={cat.id} style={categoryItem}>
                {editingId === cat.id ? (
                  <input 
                    value={editingName} 
                    onChange={(e) => setEditingName(e.target.value)} 
                    style={{...inputStyle, maxWidth: "300px"}} 
                    autoFocus
                  />
                ) : (
                  <span style={{ fontWeight: "600", fontSize: "18px", opacity: cat.active ? 1 : 0.5 }}>
                    {cat.name} {!cat.active && " (Oculta)"}
                  </span>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  {editingId === cat.id ? (
                    <>
                      <button onClick={() => saveEdit(cat.id)} disabled={loading} style={saveBtn}>Guardar</button>
                      <button onClick={() => setEditingId(null)} style={cancelBtn}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(cat)} style={editBtn}>Editar</button>
                      <button onClick={() => toggleActive(cat.id, cat.active)} style={hideBtn}>
                        {cat.active ? "Ocultar" : "Mostrar"}
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} style={deleteBtn} disabled={loading}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}

// ESTILOS UNIFICADOS
const mainContainer = { minHeight: "100vh", background: "radial-gradient(circle at top right, #1a0a00, #050505)", padding: "40px 20px", color: "#fff" };
const contentWrapper = { maxWidth: "1000px", margin: "0 auto" };
const gridContainer = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" };
const formCard = { background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "24px", padding: "24px", display: "flex", gap: "10px", marginBottom: "30px" };
const inputStyle = { flex: 1, background: "#171717", border: "1px solid #333", borderRadius: "12px", padding: "12px 16px", color: "#fff" };
const primaryBtn = { background: "#f97316", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };
const categoryItem = { background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" };

// Botones de acción estresados
const editBtn = { background: "rgba(255,255,255,0.05)", border: "1px solid #333", padding: "8px 16px", borderRadius: "8px", color: "#fff", cursor: "pointer" };
const hideBtn = { background: "rgba(255,255,255,0.05)", border: "1px solid #333", padding: "8px 16px", borderRadius: "8px", color: "#fff", cursor: "pointer" };
const deleteBtn = { background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "8px 16px", borderRadius: "8px", color: "#ef4444", cursor: "pointer" };
const saveBtn = { background: "#22c55e", border: "none", padding: "8px 16px", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "600" };
const cancelBtn = { background: "#3b82f6", border: "none", padding: "8px 16px", borderRadius: "8px", color: "#fff", cursor: "pointer" };

function StatCard({ title, value }: any) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "20px", padding: "20px" }}>
      <p style={{ color: "#777", fontSize: "12px", textTransform: "uppercase" }}>{title}</p>
      <h2 style={{ margin: "5px 0 0 0", fontSize: "28px" }}>{value}</h2>
    </div>
  );
}