"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { DESIGN_THEME_REGISTRY } from "@/lib/theme/designThemes";

type Catalog = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_style: string;
  menu_style: string;
  gallery_style: string;
  sort_order: number;
};

type Filter = "all" | "minimal" | "premium" | "creative";

const FALLBACK_CATALOG: Catalog[] = DESIGN_THEME_REGISTRY.map((theme, index) => ({
  id: theme.id,
  name: theme.name,
  slug: theme.slug,
  description: theme.description,
  hero_style: theme.heroStyle,
  menu_style: theme.menuStyle,
  gallery_style: theme.galleryStyle,
  sort_order: index + 1,
}));

const COMPOSITION_LABELS: Record<string, string> = {
  fullscreen: "Fullscreen",
  split: "Split",
  framed: "Framed",
  asymmetric: "Asymmetric",
  magazine: "Magazine",
  floating: "Floating",
  organic: "Organic",
  "two-column": "Two column",
  centered: "Centered",
  blocks: "Blocks",
  classic: "Classic",
  swiss: "Swiss",
  monolith: "Monolith",
  atelier: "Atelier",
  signature: "Signature",
};

const STYLE_SHORT: Record<string, string> = {
  cinematic: "Cinematic",
  minimal: "Minimal",
  luxury: "Luxury",
  neon: "Neon",
  editorial: "Editorial",
  glass: "Glass",
  nature: "Nature",
  split: "Split",
  center: "Center",
  bold: "Bold",
  classic: "Classic",
  air: "Air",
  monolith: "Monolith",
  atelier: "Atelier",
  noir: "Noir",
};

function getRegistry(slug: string) {
  return DESIGN_THEME_REGISTRY.find((item) => item.slug === slug) ?? DESIGN_THEME_REGISTRY[0];
}

export default function DesignThemeSelector({ restaurantId }: { restaurantId: string }) {
  const [designs, setDesigns] = useState<Catalog[]>([]);
  const [activeId, setActiveId] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      const [catalogResult, assignmentResult] = await Promise.all([
        (supabase as any)
          .from("design_theme_catalog")
          .select("id,name,slug,description,hero_style,menu_style,gallery_style,sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        (supabase as any)
          .from("restaurant_design_themes")
          .select("theme_id")
          .eq("restaurant_id", restaurantId)
          .maybeSingle(),
      ]);

      if (!active) return;

      const catalog = ((catalogResult.data || []) as Catalog[]).length
        ? ((catalogResult.data || []) as Catalog[])
        : FALLBACK_CATALOG;

      const assigned = assignmentResult.data?.theme_id || catalog[0]?.id || "";

      setDesigns(catalog);
      setActiveId(assigned);
      setPendingId(assigned);
      setLoaded(true);
    }

    load();
    return () => {
      active = false;
    };
  }, [restaurantId]);

  const current = useMemo(
    () => designs.find((design) => design.id === pendingId) ?? designs.find((design) => design.slug === pendingId) ?? designs[0],
    [designs, pendingId]
  );

  const active = useMemo(
    () => designs.find((design) => design.id === activeId) ?? designs.find((design) => design.slug === activeId) ?? designs[0],
    [designs, activeId]
  );

  const visibleDesigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return designs.filter((design) => {
      const registry = getRegistry(design.slug);
      const categoryMatches = filter === "all" || registry.category === filter;
      const queryMatches =
        !normalizedQuery ||
        design.name.toLowerCase().includes(normalizedQuery) ||
        (design.description || "").toLowerCase().includes(normalizedQuery) ||
        design.slug.toLowerCase().includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [designs, filter, query]);

  const selectedRegistry = current ? getRegistry(current.slug) : DESIGN_THEME_REGISTRY[0];
  const activeRegistry = active ? getRegistry(active.slug) : DESIGN_THEME_REGISTRY[0];

  async function apply() {
    if (!current?.id || saving) return;

    setSaving(true);
    setMessage("");

    const { error } = await (supabase as any)
      .from("restaurant_design_themes")
      .upsert(
        {
          restaurant_id: restaurantId,
          theme_id: current.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "restaurant_id" }
      );

    if (error) {
      setMessage(`No se pudo aplicar: ${error.message}`);
    } else {
      setActiveId(current.id);
      setPendingId(current.id);
      setMessage("Diseño aplicado correctamente.");
      setOpen(false);
    }

    setSaving(false);
  }

  return (
    <section className="wolf-design-shell">
      <style jsx>{`
        .wolf-design-shell{margin-bottom:28px;border:1px solid rgba(255,255,255,.08);border-radius:22px;background:linear-gradient(145deg,rgba(14,16,22,.98),rgba(8,10,14,.98));box-shadow:0 20px 70px rgba(0,0,0,.18);overflow:hidden;color:#fff}
        .wolf-design-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;background:transparent;border:0;color:inherit;text-align:left;cursor:pointer}
        .wolf-design-trigger:hover{background:rgba(255,255,255,.018)}
        .wolf-design-trigger-left{display:flex;align-items:center;gap:14px;min-width:0}
        .wolf-design-trigger-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(124,58,237,.22),rgba(236,72,153,.16));border:1px solid rgba(167,139,250,.22);font-size:16px;flex:none}
        .wolf-design-kicker{text-transform:uppercase;letter-spacing:.18em;font-size:9px;font-weight:900;color:#a78bfa;margin-bottom:4px}
        .wolf-design-title{font-size:16px;font-weight:850;letter-spacing:-.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .wolf-design-subtitle{font-size:11px;color:#7f8794;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .wolf-design-trigger-right{display:flex;align-items:center;gap:10px;flex:none}
        .wolf-design-current{max-width:220px;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);font-size:10px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .wolf-design-chevron{width:28px;height:28px;border-radius:10px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.08);color:#9ca3af;font-size:12px;transition:transform .18s ease}
        .wolf-design-chevron.open{transform:rotate(180deg)}
        .wolf-design-content{border-top:1px solid rgba(255,255,255,.07);padding:16px 18px 18px;background:rgba(0,0,0,.12)}
        .wolf-design-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}
        .wolf-design-search{min-width:220px;flex:1;max-width:340px;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.028);color:#fff;padding:0 12px;outline:none;font-size:11px}
        .wolf-design-search::placeholder{color:#656d79}.wolf-design-search:focus{border-color:rgba(167,139,250,.55);box-shadow:0 0 0 3px rgba(124,58,237,.10)}
        .wolf-design-filters{display:flex;gap:6px;flex-wrap:wrap}.wolf-design-filter{height:34px;padding:0 11px;border-radius:999px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);color:#858d99;font-size:10px;font-weight:800;cursor:pointer}.wolf-design-filter.active{background:rgba(124,58,237,.15);border-color:rgba(167,139,250,.45);color:#fff}
        .wolf-design-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
        .wolf-design-option{position:relative;display:flex;align-items:flex-start;gap:11px;width:100%;min-height:66px;padding:11px 12px;border-radius:15px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.018);color:#fff;text-align:left;cursor:pointer;transition:border-color .16s ease,background .16s ease,transform .16s ease;min-width:0}
        .wolf-design-option:hover{transform:translateY(-1px);background:rgba(255,255,255,.035);border-color:rgba(255,255,255,.14)}
        .wolf-design-option.selected{border-color:rgba(167,139,250,.7);background:linear-gradient(145deg,rgba(124,58,237,.13),rgba(236,72,153,.06))}
        .wolf-design-option.active{box-shadow:inset 0 0 0 1px rgba(52,211,153,.16)}
        .wolf-design-option-mark{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.07);font-size:9px;font-weight:900;color:#aeb6c3;flex:none}
        .wolf-design-option-main{display:block;min-width:0;flex:1;overflow:hidden}.wolf-design-option-name{display:block;min-width:0;max-width:100%;font-size:11px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wolf-design-option-desc{display:block;min-width:0;max-width:100%;margin-top:3px;font-size:9px;line-height:1.35;color:#777f8b;white-space:normal;overflow-wrap:anywhere;word-break:break-word;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
        .wolf-design-option-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.wolf-design-meta{font-size:8px;color:#8f97a4;padding:3px 6px;border-radius:999px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.05)}
        .wolf-design-state{font-size:8px;font-weight:900;color:#86efac;padding:4px 6px;border-radius:999px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.16);white-space:nowrap;flex:none;margin-top:1px}
        .wolf-design-footer{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .wolf-design-selected{min-width:0}.wolf-design-selected-label{text-transform:uppercase;letter-spacing:.14em;font-size:8px;font-weight:900;color:#717986}.wolf-design-selected-name{font-size:13px;font-weight:850;margin-top:3px}.wolf-design-selected-copy{font-size:9px;color:#7f8793;margin-top:3px;max-width:650px}
        .wolf-design-apply{height:38px;padding:0 15px;border-radius:11px;border:0;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;font-size:10px;font-weight:900;cursor:pointer;box-shadow:0 10px 28px rgba(124,58,237,.18)}.wolf-design-apply:disabled{opacity:.55;cursor:wait}
        .wolf-design-message{width:100%;font-size:10px;color:#a7f3d0}.wolf-design-message.error{color:#fca5a5}
        @media(max-width:1000px){.wolf-design-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:680px){.wolf-design-trigger{padding:15px}.wolf-design-trigger-right{margin-left:auto}.wolf-design-current{display:none}.wolf-design-content{padding:13px}.wolf-design-toolbar{align-items:stretch;flex-direction:column}.wolf-design-search{max-width:none;width:100%}.wolf-design-list{grid-template-columns:1fr}.wolf-design-footer{align-items:stretch;flex-direction:column}.wolf-design-apply{width:100%}}
      `}</style>

      <button type="button" className="wolf-design-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="wolf-design-trigger-left">
          <span className="wolf-design-trigger-icon">✦</span>
          <span style={{ minWidth: 0 }}>
            <span className="wolf-design-kicker">Diseño de experiencia</span>
            <span className="wolf-design-title">Hero + Menú + Galería</span>
            <span className="wolf-design-subtitle"></span>
          </span>
        </span>
        <span className="wolf-design-trigger-right">
          <span className="wolf-design-current">{active?.name || "Seleccionar diseño"}</span>
          <span className={`wolf-design-chevron ${open ? "open" : ""}`}>⌄</span>
        </span>
      </button>

      {open && (
        <div className="wolf-design-content">
          <div className="wolf-design-toolbar">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="wolf-design-search"
              placeholder="Buscar diseño..."
              aria-label="Buscar diseño"
            />
            <div className="wolf-design-filters">
              {(["all", "minimal", "premium", "creative"] as Filter[]).map((item) => {
                const label = item === "all" ? "Todos" : item === "minimal" ? "Minimal" : item === "premium" ? "Premium" : "Creativos";
                return (
                  <button key={item} type="button" className={`wolf-design-filter ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="wolf-design-list">
            {!loaded && <div style={{ gridColumn: "1 / -1", padding: 20, color: "#79818e", fontSize: 11 }}>Cargando diseños...</div>}
            {loaded && visibleDesigns.length === 0 && <div style={{ gridColumn: "1 / -1", padding: 20, color: "#79818e", fontSize: 11 }}>No hay diseños que coincidan.</div>}
            {visibleDesigns.map((design) => {
              const registry = getRegistry(design.slug);
              const isSelected = pendingId === design.id || pendingId === design.slug;
              const isActive = activeId === design.id || activeId === design.slug;
              return (
                <button
                  key={design.id}
                  type="button"
                  className={`wolf-design-option ${isSelected ? "selected" : ""} ${isActive ? "active" : ""}`}
                  onClick={() => setPendingId(design.id)}
                >
                  <span className="wolf-design-option-mark">{design.sort_order}</span>
                  <span className="wolf-design-option-main">
                    <span className="wolf-design-option-name">{design.name}</span>
                    <span className="wolf-design-option-desc">{design.description || registry.description}</span>
                    <span className="wolf-design-option-meta">
                      <span className="wolf-design-meta">Hero · {COMPOSITION_LABELS[registry.composition] || STYLE_SHORT[registry.heroStyle] || registry.heroStyle}</span>
                      <span className="wolf-design-meta">Menú · {STYLE_SHORT[registry.menuStyle] || registry.menuStyle}</span>
                      <span className="wolf-design-meta">Galería · {STYLE_SHORT[registry.galleryStyle] || registry.galleryStyle}</span>
                    </span>
                  </span>
                  {isActive && <span className="wolf-design-state">ACTUAL</span>}
                </button>
              );
            })}
          </div>

          <div className="wolf-design-footer">
            <div className="wolf-design-selected">
              <div className="wolf-design-selected-label">Diseño seleccionado</div>
              <div className="wolf-design-selected-name">{current?.name || "Seleccionar diseño"}</div>
              <div className="wolf-design-selected-copy">{selectedRegistry.description}</div>
            </div>
            <button type="button" className="wolf-design-apply" onClick={apply} disabled={!loaded || !current?.id || saving}>
              {saving ? "Aplicando..." : "Aplicar diseño"}
            </button>
            {message && <div className={`wolf-design-message ${message.startsWith("No se") ? "error" : ""}`}>{message}</div>}
          </div>
        </div>
      )}
    </section>
  );
}
