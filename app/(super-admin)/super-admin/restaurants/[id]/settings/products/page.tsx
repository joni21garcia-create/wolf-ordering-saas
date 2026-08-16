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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

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

  return (
    <PermissionGuard permission="products">
      <main className="products-page">
        <header className="products-header">
          <div className="products-heading">
            <BackToSettings restaurantId={restaurantId} />
            <div className="eyebrow">Configuración / Productos</div>
            <div className="title-row">
              <div>
                <h1>Productos</h1>
                <p>Gestiona tu menú rápido, desde cualquier dispositivo.</p>
              </div>
              <Link
                href={`/super-admin/restaurants/${restaurantId}/settings/products/new`}
                className="new-product"
              >
                <span>+</span> Nuevo
              </Link>
            </div>
          </div>
        </header>

        <section className="stats">
          <div><strong>{products.length}</strong><span>Total</span></div>
          <div><strong className="green">{products.filter(p => p.available).length}</strong><span>Visibles</span></div>
          <div><strong className="red">{products.filter(p => !p.available).length}</strong><span>Ocultos</span></div>
        </section>

        <section className="category-shell">
          <div className="category-top">
            <div>
              <strong>Categorías</strong>
              <span>{filteredProducts.length} productos</span>
            </div>

            <button
              className={`all-category ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Todas <b>{products.length}</b>
            </button>
          </div>

          <div className="category-list">
            {categories.map((cat) => {
              const categoryProducts = products.filter(
                (p) => p.category_id === cat.id
              );
              const isOpen = openCategories[cat.id] ?? false;
              const visibleProducts =
                selectedCategory === "all" || selectedCategory === cat.id
                  ? categoryProducts
                  : [];

              return (
                <section
                  key={cat.id}
                  className={`category-accordion ${isOpen ? "open" : ""} ${
                    selectedCategory === cat.id ? "selected" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="category-trigger"
                    onClick={() => {
                      setOpenCategories((prev) => ({
                        ...prev,
                        [cat.id]: !isOpen,
                      }));
                      setSelectedCategory(cat.id);
                    }}
                  >
                    <span className="category-icon">▦</span>

                    <span className="category-title">
                      <strong>{cat.name}</strong>
                      <small>
                        {categoryProducts.length}{" "}
                        {categoryProducts.length === 1 ? "producto" : "productos"}
                      </small>
                    </span>

                    <span className="category-chevron">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="accordion-products">
                      {visibleProducts.length === 0 ? (
                        <div className="accordion-empty">
                          Esta categoría todavía no tiene productos.
                        </div>
                      ) : (
                        visibleProducts.map((product) => (
                          <article key={product.id} className="product-row">
                            <div className="product-main">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="product-image"
                                />
                              ) : (
                                <div className="product-image placeholder">🍔</div>
                              )}

                              <div className="product-info">
                                <strong>{product.name}</strong>
                                <div>
                                  <b>${Number(product.price).toFixed(2)}</b>
                                  <span>
                                    {product.available ? "Disponible" : "Oculto"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="product-actions">
                              <label
                                className="switch"
                                title={product.available ? "Visible" : "Oculto"}
                              >
                                <input
                                  type="checkbox"
                                  checked={product.available}
                                  onChange={() =>
                                    toggleProductVisibility(
                                      product.id,
                                      product.available
                                    )
                                  }
                                />
                                <span />
                              </label>

                              <Link
                                href={`/super-admin/restaurants/${restaurantId}/settings/products/${product.id}/edit`}
                                className="icon-btn"
                                aria-label={`Editar ${product.name}`}
                              >
                                ✎
                              </Link>

                              <button
                                className="icon-btn danger"
                                onClick={() => deleteProduct(product.id)}
                                aria-label={`Eliminar ${product.name}`}
                              >
                                🗑
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  )}
                </section>
              );
            })}

            {categories.length === 0 && (
              <div className="empty-state">
                <span>📁</span>
                <strong>No hay categorías</strong>
                <small>Crea una categoría para empezar a organizar tu menú.</small>
              </div>
            )}

            {selectedCategory !== "all" &&
              !categories.some((cat) => cat.id === selectedCategory) && (
                <div className="empty-state">
                  <span>🍽️</span>
                  <strong>No hay productos aquí</strong>
                  <small>Cambia de categoría para continuar.</small>
                </div>
              )}
          </div>
        </section>

        <style jsx global>{`
          .products-page {
            width:100%; max-width:760px; margin:0 auto; padding:16px 12px 42px;
            color:#fff; box-sizing:border-box; font-family:system-ui,-apple-system,sans-serif;
          }
          .products-header { margin-bottom:12px; }
          .products-heading { min-width:0; }
          .eyebrow { color:#f97316; font-size:8px; font-weight:800; letter-spacing:1.1px; text-transform:uppercase; margin:7px 0 3px; }
          .title-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
          .title-row h1 { margin:0; font-size:23px; line-height:1.1; letter-spacing:-.5px; }
          .title-row p { margin:4px 0 0; color:rgba(255,255,255,.38); font-size:10px; }
          .new-product { flex-shrink:0; display:inline-flex; align-items:center; gap:5px; background:#f97316; color:#fff; text-decoration:none; padding:8px 10px; border-radius:8px; font-size:10px; font-weight:800; }
          .new-product span { font-size:14px; line-height:1; }
          .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:9px; }
          .stats div { padding:9px 7px; border:1px solid rgba(255,255,255,.055); background:rgba(17,17,17,.72); border-radius:9px; text-align:center; }
          .stats strong { display:block; font-size:15px; line-height:1; }
          .stats span { display:block; margin-top:3px; color:rgba(255,255,255,.32); font-size:8px; }
          .stats .green { color:#22c55e; } .stats .red { color:#ef4444; }
          .category-shell {
            margin-bottom: 9px;
            padding: 7px 0;
          }

          .category-top {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-bottom:6px;
            padding:0 1px;
          }

          .category-top strong {
            display:block;
            font-size:10px;
          }

          .category-top span {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.28);
            font-size:8px;
          }

          .all-category {
            flex-shrink:0;
            border:1px solid rgba(255,255,255,.07);
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.52);
            border-radius:999px;
            padding:5px 8px;
            font-size:8px;
            font-weight:800;
            cursor:pointer;
          }

          .all-category b {
            margin-left:3px;
            color:rgba(255,255,255,.28);
          }

          .all-category.active {
            color:#fff;
            background:rgba(249,115,22,.11);
            border-color:rgba(249,115,22,.28);
          }

          .all-category.active b {
            color:#f97316;
          }

          .category-list {
            display:flex;
            flex-direction:column;
            gap:5px;
          }

          .category-accordion {
            overflow:hidden;
            border:1px solid rgba(255,255,255,.055);
            border-radius:10px;
            background:rgba(17,24,39,.56);
            transition:border-color .16s, background .16s;
          }

          .category-accordion.open,
          .category-accordion.selected {
            border-color:rgba(249,115,22,.18);
            background:rgba(17,24,39,.7);
          }

          .category-trigger {
            width:100%;
            min-height:48px;
            display:flex;
            align-items:center;
            gap:8px;
            padding:7px 9px;
            border:0;
            background:transparent;
            color:#fff;
            text-align:left;
            cursor:pointer;
          }

          .category-icon {
            width:30px;
            height:30px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:8px;
            background:rgba(249,115,22,.08);
            color:#f97316;
            font-size:13px;
          }

          .category-title {
            min-width:0;
            flex:1;
          }

          .category-title strong {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:10px;
            font-weight:800;
          }

          .category-title small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.28);
            font-size:8px;
          }

          .category-chevron {
            width:25px;
            height:25px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.4);
            font-size:13px;
          }

          .category-accordion.open .category-chevron {
            color:#f97316;
            background:rgba(249,115,22,.08);
          }

          .accordion-products {
            display:flex;
            flex-direction:column;
            gap:4px;
            padding:0 5px 5px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .accordion-empty {
            padding:15px 9px;
            color:rgba(255,255,255,.25);
            font-size:8px;
            text-align:center;
          }

          .product-list {
            display:flex;
            flex-direction:column;
            gap:6px;
          }

          .product-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            min-width:0;
            padding:7px;
            border:1px solid rgba(255,255,255,.045);
            border-radius:8px;
            background:rgba(5,8,13,.45);
          }

          .product-main {
            display:flex;
            align-items:center;
            gap:8px;
            min-width:0;
            flex:1;
          }

          .product-image {
            width:38px;
            height:38px;
            border-radius:7px;
            object-fit:cover;
            flex-shrink:0;
          }

          .product-image.placeholder {
            display:grid;
            place-items:center;
            background:rgba(255,255,255,.04);
            font-size:15px;
          }

          .product-info {
            min-width:0;
          }

          .product-info > strong {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:9px;
          }

          .product-info > div {
            display:flex;
            align-items:center;
            gap:5px;
            margin-top:3px;
            min-width:0;
          }

          .product-info b {
            color:#f97316;
            font-size:8px;
          }

          .product-info span {
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.28);
            font-size:7px;
          }

          .product-actions {
            display:flex;
            align-items:center;
            gap:4px;
            flex-shrink:0;
          }

          .switch {
            position:relative;
            width:32px;
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
            background:#333;
            transition:.18s;
            cursor:pointer;
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
            transform:translateX(14px);
          }

          .icon-btn {
            width:27px;
            height:27px;
            display:grid;
            place-items:center;
            border-radius:7px;
            border:1px solid rgba(255,255,255,.06);
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.65);
            text-decoration:none;
            cursor:pointer;
            font-size:11px;
            padding:0;
          }

          .icon-btn.danger {
            color:#ef4444;
            background:rgba(239,68,68,.06);
            border-color:rgba(239,68,68,.12);
          }

          .empty-state { padding:35px 15px; text-align:center; color:rgba(255,255,255,.35); border:1px dashed rgba(255,255,255,.07); border-radius:11px; }
          .empty-state span { display:block; font-size:25px; margin-bottom:7px; } .empty-state strong { display:block; color:rgba(255,255,255,.62); font-size:10px; } .empty-state small { display:block; margin-top:3px; font-size:8px; }
          @media (max-width:390px) { .title-row { align-items:flex-start; } .new-product { padding:7px 8px; } .product-actions { gap:3px; } .icon-btn { width:27px; height:27px; } }
        `}</style>
      </main>
    </PermissionGuard>
  );
}