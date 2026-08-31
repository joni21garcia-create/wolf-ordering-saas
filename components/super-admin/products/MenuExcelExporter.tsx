"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";

interface Props {
  restaurantId: string;
}

type Category = {
  id: string;
  name: string;
  sort_order?: number | null;
};

type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description?: string | null;
  price?: number | string | null;
  available?: boolean | null;
  featured?: boolean | null;
  image_url?: string | null;
  created_at?: string | null;
};

export default function MenuExcelExporter({ restaurantId }: Props) {
  const [busy, setBusy] = useState(false);

  const exportMenu = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        supabase
          .from("categories")
          .select("id,name,sort_order")
          .eq("restaurant_id", restaurantId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("products")
          .select("id,category_id,name,description,price,available,featured,image_url,created_at")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: true }),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (productsResponse.error) throw productsResponse.error;

      const categories = (categoriesResponse.data ?? []) as Category[];
      const products = (productsResponse.data ?? []) as Product[];
      const categoryById = new Map(categories.map((category) => [category.id, category]));

      const rows = products.map((product) => {
        const category = product.category_id ? categoryById.get(product.category_id) : undefined;
        return {
          Producto_ID: product.id,
          Categoria_ID: product.category_id ?? "",
          Categoria: category?.name ?? "Sin categoría",
          Producto: product.name ?? "",
          Descripcion: product.description ?? "",
          Precio: Number(product.price ?? 0),
          Disponible: product.available === false ? "No" : "Sí",
          Destacado: product.featured === true ? "Sí" : "No",
          Imagen: product.image_url ?? "",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = [
        { wch: 38 }, { wch: 38 }, { wch: 22 }, { wch: 30 },
        { wch: 50 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 60 },
      ];
      worksheet["!autofilter"] = { ref: `A1:I${Math.max(rows.length + 1, 1)}` };
      worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Menu");

      const categoryRows = categories.map((category) => ({
        Categoria_ID: category.id,
        Categoria: category.name,
        Orden: category.sort_order ?? "",
      }));
      const categorySheet = XLSX.utils.json_to_sheet(categoryRows);
      categorySheet["!cols"] = [{ wch: 38 }, { wch: 30 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(workbook, categorySheet, "Categorias");

      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `wolf-menu-${restaurantId}-${stamp}.xlsx`);
    } catch (error) {
      console.error("Error exportando menú:", error);
      alert(`No se pudo exportar el menú: ${error instanceof Error ? error.message : "error desconocido"}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void exportMenu()}
      disabled={busy}
      className="excel-export-button"
      title="Exportar todos los productos y categorías a Excel"
    >
      {busy ? <Loader2 size={16} className="excel-spin" /> : <Download size={16} />}
      <FileSpreadsheet size={14} />
      {busy ? "Exportando…" : "Exportar Excel"}
      <style jsx global>{`
        .excel-export-button{height:40px;padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.04);color:#fff;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap}.excel-export-button:hover{background:rgba(255,255,255,.07)}.excel-export-button:disabled{opacity:.5;cursor:not-allowed}.excel-spin{animation:excel-spin 1s linear infinite}@keyframes excel-spin{to{transform:rotate(360deg)}}
      `}</style>
    </button>
  );
}