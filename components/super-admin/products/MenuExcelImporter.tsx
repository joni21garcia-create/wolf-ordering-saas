"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import { saveExcelWorkbook } from "@/lib/excel/mobileDownload";

interface Props {
  restaurantId: string;
  onImported?: () => void;
}

type ImportRow = {
  rowNumber: number;
  productId: string;
  categoryId: string;
  category: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  featured: boolean;
  imageUrl: string | null;
};

type ExistingCategory = {
  id: string;
  name: string;
  sort_order?: number | null;
};

type ExistingProduct = {
  id: string;
  name: string;
  category_id: string | null;
  slug?: string | null;
};

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const parseBoolean = (value: unknown, fallback: boolean) => {
  const normalized = normalize(value);
  if (!normalized) return fallback;
  if (["si", "sí", "yes", "true", "1", "activo", "activa", "disponible"].includes(normalized)) return true;
  if (["no", "false", "0", "inactivo", "inactiva", "oculto", "agotado"].includes(normalized)) return false;
  return fallback;
};

const makeSlug = (value: string) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "producto";

const normalizeHeader = (value: string) => normalize(value).replace(/[\s_-]+/g, "");

export default function MenuExcelImporter({ restaurantId, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const reset = () => {
    setRows([]);
    setErrors([]);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const close = () => {
    if (busy) return;
    setOpen(false);
    reset();
  };

  const downloadTemplate = async () => {
    const data = [
      {
        Producto_ID: "",
        Categoria_ID: "",
        Categoria: "Hamburguesas",
        Producto: "Clásica",
        Descripcion: "Carne, queso y vegetales",
        Precio: 8.5,
        Disponible: "Sí",
        Destacado: "No",
        Imagen: "",
      },
      {
        Producto_ID: "",
        Categoria_ID: "",
        Categoria: "Bebidas",
        Producto: "Coca Cola",
        Descripcion: "500 ml",
        Precio: 1.5,
        Disponible: "Sí",
        Destacado: "No",
        Imagen: "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [
      { wch: 38 }, { wch: 38 }, { wch: 20 }, { wch: 28 },
      { wch: 46 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 55 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Menu");
    try {
      await saveExcelWorkbook(wb, "wolf-menu-template.xlsx");
    } catch (error) {
      console.error("Error descargando plantilla Excel:", error);
      alert(`No se pudo guardar la plantilla: ${error instanceof Error ? error.message : "error desconocido"}`);
    }
  };

  const parseFile = async (file: File) => {
    setBusy(true);
    setErrors([]);
    setRows([]);
    setResult(null);

    try {
      const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const firstSheet = book.SheetNames[0];
      if (!firstSheet) throw new Error("El archivo no contiene hojas.");

      const sheet = book.Sheets[firstSheet];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
        raw: false,
      });

      if (!raw.length) {
        throw new Error("El Excel está vacío.");
      }

      const parsed: ImportRow[] = [];
      const validationErrors: string[] = [];
      const seen = new Set<string>();

      raw.forEach((record, index) => {
        const rowNumber = index + 2;
        const get = (...names: string[]) => {
          const normalizedNames = names.map(normalizeHeader);
          const key = Object.keys(record).find((candidate) =>
            normalizedNames.includes(normalizeHeader(candidate))
          );
          return key ? record[key] : "";
        };

        const productId = String(get("producto_id", "product_id", "id_producto")).trim();
        const categoryId = String(get("categoria_id", "category_id", "id_categoria")).trim();
        const category = String(get("categoria", "category")).trim();
        const name = String(get("producto", "nombre", "name")).trim();
        const description = String(get("descripcion", "description")).trim();
        const rawPrice = String(get("precio", "price")).trim().replace(/\s/g, "").replace(",", ".");
        const price = Number(rawPrice);
        const available = parseBoolean(get("disponible", "available"), true);
        const featured = parseBoolean(get("destacado", "featured"), false);
        const imageUrlValue = String(get("imagen", "image", "image_url")).trim();

        if (!category && !categoryId) validationErrors.push(`Fila ${rowNumber}: falta la categoría.`);
        if (!name && !productId) validationErrors.push(`Fila ${rowNumber}: falta el producto.`);
        if (!Number.isFinite(price) || price < 0) validationErrors.push(`Fila ${rowNumber}: precio inválido.`);

        if (category && name) {
          const duplicateKey = `${normalize(category)}::${normalize(name)}`;
          if (seen.has(duplicateKey)) {
            validationErrors.push(`Fila ${rowNumber}: producto duplicado dentro del Excel (${name} / ${category}).`);
          }
          seen.add(duplicateKey);
        }

        if ((category || categoryId) && (name || productId) && Number.isFinite(price) && price >= 0) {
          parsed.push({
            rowNumber,
            productId,
            categoryId,
            category,
            name,
            description,
            price: Number(price.toFixed(2)),
            available,
            featured,
            imageUrl: imageUrlValue || null,
          });
        }
      });

      setRows(parsed);
      setErrors(validationErrors.slice(0, 50));
    } catch (error) {
      setRows([]);
      setErrors([error instanceof Error ? error.message : "No se pudo leer el Excel."]);
    } finally {
      setBusy(false);
    }
  };

  const summary = useMemo(() => {
    const categoryNames = new Set(rows.map((row) => row.categoryId || normalize(row.category)));
    return { products: rows.length, categories: categoryNames.size };
  }, [rows]);

  const importMenu = async () => {
    if (!rows.length || errors.length || busy) return;

    setBusy(true);
    setResult(null);

    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        supabase
          .from("categories")
          .select("id,name,sort_order")
          .eq("restaurant_id", restaurantId),
        supabase
          .from("products")
          .select("id,name,category_id,slug")
          .eq("restaurant_id", restaurantId),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (productsResponse.error) throw productsResponse.error;

      const categories: ExistingCategory[] = [...(categoriesResponse.data ?? [])];
      const products: ExistingProduct[] = [...(productsResponse.data ?? [])];

      let createdCategories = 0;
      let createdProducts = 0;
      let updatedProducts = 0;

      const categoryCache = new Map<string, ExistingCategory>();
      categories.forEach((category) => categoryCache.set(normalize(category.name), category));
      categories.forEach((category) => categoryCache.set(category.id, category));

      const productById = new Map(products.map((product) => [product.id, product]));
      const productByKey = new Map(
        products
          .filter((product) => product.category_id)
          .map((product) => [`${product.category_id}::${normalize(product.name)}`, product])
      );

      const usedSlugs = new Set(products.map((product) => normalize(product.slug || "")).filter(Boolean));

      const uniqueCategoryNames = new Map<string, string>();
      rows.forEach((row) => {
        if (row.category && !uniqueCategoryNames.has(normalize(row.category))) {
          uniqueCategoryNames.set(normalize(row.category), row.category);
        }
      });

      for (const [normalizedName, displayName] of uniqueCategoryNames) {
        if (categoryCache.has(normalizedName)) continue;
        const nextSortOrder = categories.reduce((max, category) => Math.max(max, Number(category.sort_order ?? 0)), 0) + 1;
        const { data, error } = await supabase
          .from("categories")
          .insert({
            restaurant_id: restaurantId,
            name: displayName,
            active: true,
            sort_order: nextSortOrder,
          })
          .select("id,name,sort_order")
          .single();
        if (error) throw error;
        if (!data) throw new Error(`No se pudo crear la categoría ${displayName}.`);
        categories.push(data);
        categoryCache.set(normalizedName, data);
        categoryCache.set(data.id, data);
        createdCategories += 1;
      }

      const makeUniqueSlug = (name: string) => {
        const base = makeSlug(name);
        let candidate = base;
        let suffix = 2;
        while (usedSlugs.has(normalize(candidate))) {
          candidate = `${base}-${suffix++}`.slice(0, 90);
        }
        usedSlugs.add(normalize(candidate));
        return candidate;
      };

      for (const row of rows) {
        const category = row.categoryId
          ? categoryCache.get(row.categoryId)
          : categoryCache.get(normalize(row.category));

        if (!category) {
          throw new Error(`Fila ${row.rowNumber}: no se encontró la categoría ${row.category || row.categoryId}.`);
        }

        let existing: ExistingProduct | undefined;
        if (row.productId) existing = productById.get(row.productId);
        if (!existing) existing = productByKey.get(`${category.id}::${normalize(row.name)}`);

        const payload = {
          category_id: category.id,
          name: row.name,
          description: row.description,
          price: row.price,
          available: row.available,
          featured: row.featured,
          image_url: row.imageUrl,
        };

        if (existing) {
          const { error } = await supabase
            .from("products")
            .update(payload)
            .eq("id", existing.id)
            .eq("restaurant_id", restaurantId);
          if (error) throw error;
          updatedProducts += 1;
          const updated = { ...existing, name: row.name, category_id: category.id };
          productById.set(existing.id, updated);
          productByKey.set(`${category.id}::${normalize(row.name)}`, updated);
        } else {
          const { data, error } = await supabase
            .from("products")
            .insert({
              restaurant_id: restaurantId,
              ...payload,
              slug: makeUniqueSlug(row.name),
            })
            .select("id,name,category_id,slug")
            .single();
          if (error) throw error;
          if (!data) throw new Error(`No se pudo crear el producto ${row.name}.`);
          createdProducts += 1;
          products.push(data);
          productById.set(data.id, data);
          productByKey.set(`${category.id}::${normalize(row.name)}`, data);
        }
      }

      setResult(
        `Listo: ${createdProducts} productos creados, ${updatedProducts} actualizados y ${createdCategories} categorías creadas.`
      );
      onImported?.();
    } catch (error) {
      setResult(
        `No se pudo completar la importación: ${error instanceof Error ? error.message : "error desconocido"}`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="excel-import-button">
        <FileSpreadsheet size={16} /> Importar Excel
      </button>

      {open && (
        <div className="excel-overlay" role="dialog" aria-modal="true" aria-labelledby="excel-import-title">
          <div className="excel-modal">
            <button className="excel-close" onClick={close} aria-label="Cerrar" disabled={busy}>
              <X size={18} />
            </button>

            <div className="excel-head">
              <span className="excel-icon"><FileSpreadsheet size={22} /></span>
              <div>
                <h2 id="excel-import-title">Importar menú desde Excel</h2>
                <p>Importa categorías y productos. Los productos existentes se actualizan; no se duplican.</p>
              </div>
            </div>

            <button type="button" className="excel-template" onClick={() => void downloadTemplate()} disabled={busy}>
              <Download size={16} /> Descargar plantilla
            </button>

            <div
              className="excel-drop"
              onClick={() => !busy && inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (!busy && (event.key === "Enter" || event.key === " ")) inputRef.current?.click();
              }}
            >
              <Upload size={22} />
              <strong>{busy ? "Procesando…" : "Selecciona tu archivo Excel"}</strong>
              <small>.xlsx · .xls</small>
            </div>

            <input
              ref={inputRef}
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void parseFile(file);
              }}
            />

            {!!rows.length && (
              <div className="excel-summary">
                <CheckCircle2 size={18} />
                <span>{summary.products} productos · {summary.categories} categorías detectadas</span>
              </div>
            )}

            {!!rows.length && !errors.length && (
              <div className="excel-preview">
                <strong>Vista previa</strong>
                <div className="excel-preview-table">
                  {rows.slice(0, 8).map((row) => (
                    <div className="excel-preview-row" key={`${row.rowNumber}-${row.productId}-${row.name}`}>
                      <span>{row.category}</span>
                      <strong>{row.name}</strong>
                      <b>${row.price.toFixed(2)}</b>
                    </div>
                  ))}
                  {rows.length > 8 && <small>… y {rows.length - 8} productos más.</small>}
                </div>
              </div>
            )}

            {!!errors.length && (
              <div className="excel-errors">
                <AlertTriangle size={18} />
                <div>
                  <strong>Corrige estas filas antes de importar</strong>
                  {errors.map((error, index) => <small key={index}>{error}</small>)}
                </div>
              </div>
            )}

            {result && <div className="excel-result">{result}</div>}

            <div className="excel-actions">
              <button type="button" onClick={close} disabled={busy}>Cancelar</button>
              <button type="button" disabled={!rows.length || !!errors.length || busy} onClick={() => void importMenu()}>
                {busy ? "Importando…" : "Importar menú"}
              </button>
            </div>
          </div>

          <style jsx global>{`
            .excel-overlay{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.7);backdrop-filter:blur(10px)}
            .excel-modal{position:relative;width:min(100%,620px);max-height:min(90dvh,800px);overflow:auto;padding:24px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:#0d0d0f;color:#fff;box-shadow:0 30px 100px rgba(0,0,0,.45)}
            .excel-close{position:absolute;right:14px;top:14px;width:40px;height:40px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.04);color:#fff;display:grid;place-items:center}
            .excel-head{display:flex;gap:12px;padding-right:42px}.excel-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;background:rgba(249,115,22,.1);color:#f97316;flex-shrink:0}
            .excel-head h2{margin:0;font-size:20px}.excel-head p{margin:4px 0 0;color:rgba(255,255,255,.48);font-size:12px;line-height:1.45}
            .excel-template,.excel-import-button{display:inline-flex;align-items:center;gap:7px}.excel-template{margin-top:18px;padding:10px 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.035);color:#fff;cursor:pointer}
            .excel-template:disabled,.excel-close:disabled{opacity:.45;cursor:not-allowed}.excel-drop{margin-top:14px;min-height:130px;display:grid;place-items:center;align-content:center;gap:7px;border:1px dashed rgba(255,255,255,.18);border-radius:16px;background:rgba(255,255,255,.02);cursor:pointer;text-align:center}.excel-drop svg{color:#f97316}.excel-drop small,.excel-errors small,.excel-preview small{color:rgba(255,255,255,.4)}
            .excel-summary,.excel-errors,.excel-result,.excel-preview{display:flex;gap:9px;margin-top:12px;padding:12px;border-radius:12px;font-size:12px}.excel-summary{background:rgba(34,197,94,.08);color:#86efac}.excel-errors{background:rgba(239,68,68,.08);color:#fca5a5}.excel-errors div{display:grid;gap:4px}.excel-result{background:rgba(255,255,255,.05)}
            .excel-preview{display:block;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06)}.excel-preview>strong{display:block;margin-bottom:8px}.excel-preview-table{display:grid;gap:5px}.excel-preview-row{display:grid;grid-template-columns:1fr 1.5fr auto;gap:8px;padding:7px 8px;border-radius:8px;background:rgba(255,255,255,.03);font-size:11px}.excel-preview-row span{color:rgba(255,255,255,.42);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.excel-preview-row strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.excel-preview-row b{color:#f97316}
            .excel-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.excel-actions button{min-height:44px;padding:0 15px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff}.excel-actions button:last-child{background:#f97316;border-color:#f97316;font-weight:800}.excel-actions button:disabled{opacity:.4;cursor:not-allowed}
            .excel-import-button{height:40px;padding:0 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.04);color:#fff;font-weight:700;cursor:pointer}.excel-import-button:hover,.excel-template:hover{background:rgba(255,255,255,.07)}
            @media(max-width:600px){.excel-overlay{padding:10px;align-items:end}.excel-modal{max-height:92dvh;border-radius:20px 20px 12px 12px;padding:18px}.excel-actions button{flex:1}.excel-preview-row{grid-template-columns:1fr 1.4fr auto}}
          `}</style>
        </div>
      )}
    </>
  );
}