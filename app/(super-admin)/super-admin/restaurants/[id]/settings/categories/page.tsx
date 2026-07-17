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
      <main style={mainContainer}>
        <div style={contentWrapper}>
          
          {/* ESTILOS CSS INYECTADOS PARA EL SWITCH ANDROID */}
          <style jsx global>{`
            /* Switch contenedor */
            .android-switch {
              position: relative;
              display: inline-block;
              width: 46px;
              height: 24px;
            }
            /* Esconder checkbox */
            .android-switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }
            /* El fondo del Switch (Track) */
            .switch-slider {
              position: absolute;
              cursor: pointer;
              top: 0; left: 0; right: 0; bottom: 0;
              background-color: #3f3f46;
              transition: 0.2s ease-in-out;
              border-radius: 999px;
            }
            /* La bolita del Switch (Thumb) */
            .switch-slider:before {
              position: absolute;
              content: "";
              height: 18px;
              width: 18px;
              left: 3px;
              bottom: 3px;
              background-color: #ffffff;
              transition: 0.2s ease-in-out;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.4);
            }
            /* Estado Activo (Verde Android) */
            input:checked + .switch-slider {
              background-color: #22c55e;
            }
            input:checked + .switch-slider:before {
              transform: translateX(22px);
            }
          `}</style>

          {/* HEADER */}
          <header style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", color: "#777", fontSize: "14px" }}>
              <BackToSettings restaurantId={restaurantId} />
              <span>Configuración / Categorías</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: "800", margin: 0 }}>Categorías</h1>
          </header>

          {/* ESTADÍSTICAS MÁS COMPACTAS */}
          <div style={gridContainer}>
            <StatCard title="Total" value={categories.length} color="#fff" />
            <StatCard title="Activas" value={categories.filter(c => c.active).length} color="#22c55e" />
            <StatCard title="Ocultas" value={categories.filter(c => !c.active).length} color="#ef4444" />
          </div>

          {/* CREAR NUEVA CATEGORÍA */}
          <div style={formCard}>
            <input 
              placeholder="Nueva categoría (ej: Hamburguesas)" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              style={inputStyle}
            />
            <button onClick={createCategory} disabled={loading} style={primaryBtn}>
              {loading ? "..." : "+ Crear"}
            </button>
          </div>

          {loading && <p style={{ color: "#aaa", textAlign: "center", marginBottom: "15px", fontSize: "14px" }}>Procesando...</p>}

          {/* LISTADO ESTILO ANDROID COMPACTO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {categories.map((cat) => (
              <div key={cat.id} style={categoryItem}>
                
                {/* SECCIÓN IZQUIERDA: Avatar carpeta + Nombre o Input de Edición */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    📂
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editingId === cat.id ? (
                      <input 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)} 
                        style={{ ...inputStyle, padding: "8px 12px", fontSize: "15px" }} 
                        autoFocus
                      />
                    ) : (
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: "15px", 
                        fontWeight: "700", 
                        color: cat.active ? "#fff" : "#666",
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap" 
                      }}>
                        {cat.name} {!cat.active && <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: "400" }}> (Oculta)</span>}
                      </h3>
                    )}
                  </div>
                </div>

                {/* SECCIÓN DERECHA: Controles */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
                  
                  {editingId === cat.id ? (
                    /* Botones al estar editando */
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => saveEdit(cat.id)} disabled={loading} style={saveBtn}>Guardar</button>
                      <button onClick={() => setEditingId(null)} style={cancelBtn}>X</button>
                    </div>
                  ) : (
                    /* Vista normal con Switch Android + Botones de Acción */
                    <>
                      {/* Switch Deslizante para Activar/Desactivar */}
                      <div style={{ display: "flex", alignItems: "center" }} title={cat.active ? "Activa" : "Oculta"}>
                        <label className="android-switch">
                          <input 
                            type="checkbox" 
                            checked={cat.active} 
                            onChange={() => toggleActive(cat.id, cat.active)}
                          />
                          <span className="switch-slider"></span>
                        </label>
                      </div>

                      {/* Botones de Editar y Eliminar */}
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button 
                          onClick={() => startEditing(cat)} 
                          title="Editar"
                          style={actionBtn}
                        >
                          ✏️
                        </button>
                        
                        <button 
                          onClick={() => deleteCategory(cat.id)} 
                          title="Eliminar"
                          style={deleteBtn}
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>
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

// NUEVOS ESTILOS OPTIMIZADOS
const mainContainer = { minHeight: "100vh", background: "radial-gradient(circle at top right, #160a02, #050505)", padding: "20px 16px", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" };
const contentWrapper = { maxWidth: "700px", margin: "0 auto" };
const gridContainer = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" };

const formCard = { 
  background: "rgba(17, 17, 17, 0.95)", 
  border: "1px solid rgba(255,255,255,0.06)", 
  borderRadius: "16px", 
  padding: "12px", 
  display: "flex", 
  gap: "10px", 
  marginBottom: "20px" 
};

const inputStyle = { 
  flex: 1, 
  background: "#121212", 
  border: "1px solid #2d2d2d", 
  borderRadius: "10px", 
  padding: "10px 14px", 
  color: "#fff",
  fontSize: "14px",
  outline: "none"
};

const primaryBtn = { 
  background: "#f97316", 
  color: "#fff", 
  border: "none", 
  padding: "10px 18px", 
  borderRadius: "10px", 
  fontWeight: "700", 
  cursor: "pointer",
  fontSize: "14px"
};

const categoryItem = { 
  background: "rgba(20, 20, 20, 0.7)", 
  border: "1px solid rgba(255,255,255,.05)", 
  borderRadius: "14px", 
  padding: "10px 14px", 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center",
  gap: "12px"
};

// Botones de acción simplificados y pequeños
const actionBtn = { 
  background: "rgba(255,255,255,0.03)", 
  border: "1px solid rgba(255,255,255,0.05)", 
  color: "#fff", 
  width: "36px", 
  height: "36px", 
  borderRadius: "8px", 
  cursor: "pointer", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center",
  fontSize: "14px" 
};

const deleteBtn = { 
  background: "rgba(239, 68, 68, 0.1)", 
  border: "1px solid rgba(239, 68, 68, 0.15)", 
  color: "#ef4444", 
  width: "36px", 
  height: "36px", 
  borderRadius: "8px", 
  cursor: "pointer", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center",
  fontSize: "14px" 
};

const saveBtn = { background: "#22c55e", border: "none", padding: "8px 12px", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "600", fontSize: "13px" };
const cancelBtn = { background: "#3f3f46", border: "none", padding: "8px 12px", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "13px" };

function StatCard({ title, value, color }: any) {
  return (
    <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "12px", textAlign: "center" }}>
      <h3 style={{ margin: 0, fontSize: "18px", color: color }}>{value}</h3>
      <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</p>
    </div>
  );
}