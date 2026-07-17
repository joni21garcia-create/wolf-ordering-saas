"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ProductsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Referencia para controlar el contenedor del scroll de categorías
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (restaurantId) {
      loadData();
    }
  }, [restaurantId]);

  const loadData = async () => {
    setLoading(true);

    // 1. Cargamos las categorías del restaurante
    const { data: catData } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: true });
    setCategories(catData || []);

    // 2. Cargamos los productos
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    setProducts(data || []);
    setLoading(false);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) alert("Error eliminando producto");
    else loadData();
  };

  // Botón para Encender / Apagar la visibilidad del producto en el landing
  const toggleProductVisibility = async (productId: string, currentValue: boolean) => {
    // Actualización optimista local para que el switch se mueva instantáneamente en pantalla
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, available: !currentValue } : p)
    );

    const { error } = await supabase
      .from("products")
      .update({ available: !currentValue })
      .eq("id", productId);
    
    if (error) {
      alert("Error actualizando la visibilidad del producto");
      loadData(); // Revertimos si hay error
    }
  };

  // Filtrar productos según la categoría seleccionada en la barra horizontal
  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.category_id === selectedCategory);

  const statCard = {
    background: "rgba(17,17,17,.95)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "16px",
    padding: "12px",
    textAlign: "center" as const,
  };

  return (
    <PermissionGuard permission="products">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "16px", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        
        {/* ESTILOS CSS INYECTADOS PARA EL SWITCH ESTILO ANDROID Y EL SCROLLBAR */}
        <style jsx global>{`
          /* Switch contenedor */
          .android-switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
          }
          /* Esconder checkbox por defecto */
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
            background-color: #3f3f46; /* Gris oscuro cuando está apagado */
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
          /* Estado Encendido (Verde Android) */
          input:checked + .switch-slider {
            background-color: #22c55e;
          }
          input:checked + .switch-slider:before {
            transform: translateX(22px);
          }
          /* Ocultar scrollbar horizontal de categorías */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* HEADER RESPONSIVO */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
          <div>
            <p style={{ color: "#777", marginBottom: "6px", fontSize: "14px" }}>
              <BackToSettings restaurantId={restaurantId} /> Configuración / Productos
            </p>
            <h1 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 34px)", fontWeight: "800" }}>Productos</h1>
          </div>
          <Link href={`/super-admin/restaurants/${restaurantId}/settings/products/new`}>
            <button style={{ background: "#f97316", border: "none", color: "#fff", padding: "12px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 8px 16px rgba(249,115,22,.2)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>+</span> Nuevo Producto
            </button>
          </Link>
        </div>

        {/* ESTADÍSTICAS MÁS PEQUEÑAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
          <div style={statCard}>
            <h3 style={{ margin: 0, fontSize: "18px" }}>{products.length}</h3>
            <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0 0" }}>Total</p>
          </div>
          <div style={statCard}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#22c55e" }}>{products.filter(p => p.available).length}</h3>
            <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0 0" }}>Visibles</p>
          </div>
          <div style={statCard}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#ef4444" }}>{products.filter(p => !p.available).length}</h3>
            <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0 0" }}>Ocultos</p>
          </div>
        </div>

        {/* BARRA DE CATEGORÍAS CON FLECHAS Y SCROLL HORIZONTAL */}
        <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(5, 5, 5, 0.95)", backdropFilter: "blur(10px)", padding: "10px 0", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "8px" }}>
          
          {/* Botón Izquierda */}
          <button 
            onClick={() => scrollCategories("left")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "14px"
            }}
            title="Desplazar izquierda"
          >
            ◀
          </button>

          {/* Contenedor con Scroll */}
          <div 
            ref={scrollContainerRef}
            className="hide-scrollbar" 
            style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "5px", flex: 1, scrollBehavior: "smooth" }}
          >
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: "99px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: selectedCategory === "all" ? "#f97316" : "#111",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              🔥 Todas ({products.length})
            </button>

            {categories.map((cat) => {
              const count = products.filter(p => p.category_id === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 16px",
                    borderRadius: "99px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: isSelected ? "#f97316" : "#111",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Botón Derecha */}
          <button 
            onClick={() => scrollCategories("right")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "14px"
            }}
            title="Desplazar derecha"
          >
            ▶
          </button>
        </div>

        {loading && <p style={{ color: "#aaa", textAlign: "center", padding: "20px" }}>Cargando productos...</p>}

        {/* LISTADO TIPO LISTA COMPACTA ESTILO ANDROID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                background: "rgba(20, 20, 20, 0.7)", 
                border: "1px solid rgba(255,255,255,.05)", 
                borderRadius: "16px", 
                padding: "10px 14px", 
                gap: "12px"
              }}
            >
              {/* SECCIÓN IZQUIERDA: Miniatura Redonda + Info del producto */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    style={{ width: "50px", height: "50px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} 
                  />
                ) : (
                  <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                    🍔
                  </div>
                )}
                
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: "0 0 2px 0", fontSize: "15px", fontWeight: "700", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {product.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#f97316" }}>
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span style={{ color: "#444", fontSize: "10px" }}>•</span>
                    <span style={{ fontSize: "11px", color: "#777", background: "rgba(255,255,255,0.03)", padding: "2px 8px", borderRadius: "4px" }}>
                      {product.categories?.name || "Sin Categoría"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DERECHA: Switch Deslizante Android + Botones Minimalistas */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                
                {/* SWITCH ANDROID (ENCENDER / APAGAR) */}
                <div style={{ display: "flex", alignItems: "center" }} title={product.available ? "Visible" : "Oculto"}>
                  <label className="android-switch">
                    <input 
                      type="checkbox" 
                      checked={product.available} 
                      onChange={() => toggleProductVisibility(product.id, product.available)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                {/* BOTONES DE EDICIÓN Y ELIMINAR MINIMALISTAS */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {/* Editar */}
                  <Link href={`/super-admin/restaurants/${restaurantId}/settings/products/${product.id}/edit`}>
                    <button 
                      title="Editar"
                      style={{ 
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
                      }}
                    >
                      ✏️
                    </button>
                  </Link>

                  {/* Eliminar */}
                  <button 
                    onClick={() => deleteProduct(product.id)} 
                    title="Eliminar"
                    style={{ 
                      background: "rgba(239,68,68,0.1)", 
                      border: "1px solid rgba(239,68,68,0.15)", 
                      color: "#ef4444", 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "8px", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "14px"
                    }}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </PermissionGuard>
  );
}