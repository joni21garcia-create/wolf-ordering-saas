"use client";

import { useMemo, useRef, useState } from "react";
import { Download, FileSpreadsheet, Upload, X, CheckCircle2, AlertTriangle } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";

interface Props { restaurantId: string; onImported?: () => void; }
interface Row { category: string; name: string; description: string; price: number; available: boolean; featured: boolean; image_url: string | null; }

const norm = (v: unknown) => String(v ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const bool = (v: unknown, fallback = true) => { const n = norm(v); if (!n) return fallback; return ["si","sí","yes","true","1","activo","activa","disponible"].includes(n); };
const slug = (v: string) => norm(v).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);

export default function MenuExcelImporter({ restaurantId, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const downloadTemplate = () => {
    const data = [
      { Categoria: "Hamburguesas", Producto: "Clásica", Descripcion: "Carne, queso y vegetales", Precio: 8.5, Disponible: "Sí", Destacado: "No", Imagen: "" },
      { Categoria: "Bebidas", Producto: "Coca Cola", Descripcion: "500 ml", Precio: 1.5, Disponible: "Sí", Destacado: "No", Imagen: "" },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 20 }, { wch: 28 }, { wch: 42 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 55 }];
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Menu");
    XLSX.writeFile(wb, "wolf-menu-template.xlsx");
  };

  const parse = async (file: File) => {
    setBusy(true); setErrors([]); setRows([]); setResult(null);
    try {
      const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = book.Sheets[book.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const out: Row[] = []; const errs: string[] = [];
      raw.forEach((r, i) => {
        const get = (...keys: string[]) => { const key = Object.keys(r).find(k => keys.includes(norm(k))); return key ? r[key] : ""; };
        const category = String(get("categoria", "category")).trim();
        const name = String(get("producto", "nombre", "name")).trim();
        const description = String(get("descripcion", "description")).trim();
        const price = Number(String(get("precio", "price")).replace(",", "."));
        if (!category) errs.push(`Fila ${i + 2}: falta la categoría.`);
        if (!name) errs.push(`Fila ${i + 2}: falta el producto.`);
        if (!Number.isFinite(price) || price < 0) errs.push(`Fila ${i + 2}: precio inválido.`);
        if (category && name && Number.isFinite(price) && price >= 0) out.push({ category, name, description, price: Number(price.toFixed(2)), available: bool(get("disponible", "available")), featured: bool(get("destacado", "featured"), false), image_url: String(get("imagen", "image", "image_url")).trim() || null });
      });
      setRows(out); setErrors(errs.slice(0, 30));
    } catch { setErrors(["No se pudo leer el Excel. Usa la plantilla de Wolf y vuelve a intentarlo."]); }
    finally { setBusy(false); }
  };

  const summary = useMemo(() => ({ categories: new Set(rows.map(r => norm(r.category))).size, products: rows.length }), [rows]);

  const importMenu = async () => {
    if (!rows.length || errors.length) return;
    setBusy(true); setResult(null);
    try {
      const { data: existingCats, error: catError } = await supabase.from("categories").select("id,name,sort_order").eq("restaurant_id", restaurantId);
      if (catError) throw catError;
      const cats = [...(existingCats || [])]; let createdCategories = 0;
      for (const name of Array.from(new Map(rows.map(r => [norm(r.category), r.category])).values())) {
        if (!cats.some(c => norm(c.name) === norm(name))) {
          const { data, error } = await supabase.from("categories").insert({ restaurant_id: restaurantId, name, active: true, sort_order: cats.length + 1 }).select("id,name,sort_order").single();
          if (error) throw error; if (data) { cats.push(data); createdCategories++; }
        }
      }
      const { data: existingProducts, error: prodError } = await supabase.from("products").select("name,category_id").eq("restaurant_id", restaurantId);
      if (prodError) throw prodError;
      let createdProducts = 0, skipped = 0;
      for (const row of rows) {
        const cat = cats.find(c => norm(c.name) === norm(row.category)); if (!cat) continue;
        const duplicate = (existingProducts || []).some(p => norm(p.name) === norm(row.name) && p.category_id === cat.id);
        if (duplicate) { skipped++; continue; }
        const { error } = await supabase.from("products").insert({ restaurant_id: restaurantId, category_id: cat.id, name: row.name, slug: slug(row.name), description: row.description, image_url: row.image_url, price: row.price, available: row.available, featured: row.featured });
        if (error) throw error; createdProducts++;
      }
      setResult(`Listo: ${createdProducts} productos y ${createdCategories} categorías creadas. ${skipped} productos existentes fueron omitidos.`);
      onImported?.();
    } catch (e: any) { setResult(`No se pudo completar la importación: ${e?.message || "error desconocido"}`); }
    finally { setBusy(false); }
  };

  return <>
    <button type="button" onClick={() => setOpen(true)} className="excel-import-button"><FileSpreadsheet size={16}/> Importar Excel</button>
    {open && <div className="excel-overlay" role="dialog" aria-modal="true">
      <div className="excel-modal">
        <button className="excel-close" onClick={() => { setOpen(false); setRows([]); setErrors([]); }} aria-label="Cerrar"><X size={18}/></button>
        <div className="excel-head"><span className="excel-icon"><FileSpreadsheet size={22}/></span><div><h2>Importar menú</h2><p>Categorías y productos desde Excel, sin subir fotos obligatoriamente.</p></div></div>
        <button type="button" className="excel-template" onClick={downloadTemplate}><Download size={16}/> Descargar plantilla Excel</button>
        <div className="excel-drop" onClick={() => inputRef.current?.click()}><Upload size={22}/><strong>{busy ? "Procesando…" : "Selecciona tu archivo Excel"}</strong><small>.xlsx · .xls</small></div>
        <input ref={inputRef} hidden type="file" accept=".xlsx,.xls" onChange={e => e.target.files?.[0] && parse(e.target.files[0])}/>
        {!!rows.length && <div className="excel-summary"><CheckCircle2 size={18}/><span>{summary.products} productos · {summary.categories} categorías detectadas</span></div>}
        {!!errors.length && <div className="excel-errors"><AlertTriangle size={18}/><div><strong>Corrige estas filas antes de importar</strong>{errors.map((e,i)=><small key={i}>{e}</small>)}</div></div>}
        {result && <div className="excel-result">{result}</div>}
        <div className="excel-actions"><button onClick={() => setOpen(false)}>Cancelar</button><button disabled={!rows.length || !!errors.length || busy} onClick={importMenu}>Importar menú</button></div>
      </div>
      <style jsx global>{`.excel-overlay{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.7);backdrop-filter:blur(10px)}.excel-modal{position:relative;width:min(100%,560px);max-height:min(88dvh,760px);overflow:auto;padding:24px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:#0d0d0f;color:#fff;box-shadow:0 30px 100px rgba(0,0,0,.45)}.excel-close{position:absolute;right:14px;top:14px;width:40px;height:40px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.04);color:#fff;display:grid;place-items:center}.excel-head{display:flex;gap:12px;padding-right:42px}.excel-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;background:rgba(249,115,22,.1);color:#f97316}.excel-head h2{margin:0;font-size:20px}.excel-head p{margin:4px 0 0;color:rgba(255,255,255,.48);font-size:12px;line-height:1.45}.excel-template,.excel-import-button{display:inline-flex;align-items:center;gap:7px}.excel-template{margin-top:18px;padding:10px 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.035);color:#fff}.excel-drop{margin-top:14px;min-height:130px;display:grid;place-items:center;align-content:center;gap:7px;border:1px dashed rgba(255,255,255,.18);border-radius:16px;background:rgba(255,255,255,.02);cursor:pointer;text-align:center}.excel-drop svg{color:#f97316}.excel-drop small,.excel-errors small{color:rgba(255,255,255,.4)}.excel-summary,.excel-errors,.excel-result{display:flex;gap:9px;margin-top:12px;padding:12px;border-radius:12px;font-size:12px}.excel-summary{background:rgba(34,197,94,.08);color:#86efac}.excel-errors{background:rgba(239,68,68,.08);color:#fca5a5}.excel-errors div{display:grid;gap:4px}.excel-result{background:rgba(255,255,255,.05)}.excel-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.excel-actions button{min-height:44px;padding:0 15px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff}.excel-actions button:last-child{background:#f97316;border-color:#f97316;font-weight:800}.excel-actions button:disabled{opacity:.4}.excel-import-button{height:40px;padding:0 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.04);color:#fff;font-weight:700;cursor:pointer}@media(max-width:600px){.excel-overlay{padding:10px;align-items:end}.excel-modal{max-height:92dvh;border-radius:20px 20px 12px 12px;padding:18px}.excel-actions button{flex:1}}`}</style>
    </div>}
  </>;
}
