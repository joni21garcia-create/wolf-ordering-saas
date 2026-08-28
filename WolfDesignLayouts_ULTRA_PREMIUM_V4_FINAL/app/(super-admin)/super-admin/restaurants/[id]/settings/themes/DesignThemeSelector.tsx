"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { supabase } from "@/lib/supabase/client";
import { DESIGN_THEME_REGISTRY, type DesignTheme } from "@/lib/theme/designThemes";

type Catalog = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_style: string;
  menu_style: string;
  gallery_style: string;
  config: Record<string, unknown> | null;
  sort_order: number;
};

type PreviewData = {
  name: string;
  description: string;
  image: string;
  gallery: string[];
  primary: string;
  secondary: string;
};

type PreviewMode = "mobile" | "desktop";
type Filter = "all" | "minimal" | "premium" | "creative";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&auto=format&fit=crop";

const VISUALS: Record<string, { surface: string; ink: string; accent: string; mode: string }> = {
  cinematic: { surface: "#0a0b0e", ink: "#fff", accent: "#a78bfa", mode: "01 / CINEMATIC" },
  minimal: { surface: "#f5f3ee", ink: "#141414", accent: "#94a3b8", mode: "01 / MINIMAL" },
  luxury: { surface: "#0b0907", ink: "#f8efdf", accent: "#d4a72c", mode: "SIGNATURE" },
  neon: { surface: "#100817", ink: "#fff", accent: "#ec4899", mode: "URBAN" },
  editorial: { surface: "#eee9e1", ink: "#1e1b18", accent: "#b45309", mode: "EDITORIAL" },
  glass: { surface: "#0f1820", ink: "#fff", accent: "#22d3ee", mode: "GLASS" },
  nature: { surface: "#10170d", ink: "#fff", accent: "#84cc16", mode: "NATURAL" },
  split: { surface: "#111214", ink: "#fff", accent: "#e5e7eb", mode: "SPLIT" },
  center: { surface: "#f6f5f1", ink: "#171717", accent: "#cbd5e1", mode: "FOCUS" },
  bold: { surface: "#0c0c0d", ink: "#fff", accent: "#f59e0b", mode: "BOLD" },
  classic: { surface: "#0c0c0b", ink: "#f5f1e8", accent: "#d6c19b", mode: "CLASSIC" },
  air: { surface: "#f7f7f5", ink: "#111", accent: "#cbd5e1", mode: "SWISS" },
  monolith: { surface: "#0c0d10", ink: "#fff", accent: "#c4b5fd", mode: "MONOLITH" },
  atelier: { surface: "#14110f", ink: "#fff", accent: "#f4a261", mode: "ATELIER" },
  noir: { surface: "#050505", ink: "#fff", accent: "#f5f5f4", mode: "NOIR" },
};

function DesignComposition({ slug, data, mode }: { slug: string; data: PreviewData; mode: PreviewMode }) {
  const visual = VISUALS[slug] || VISUALS.cinematic;
  const image = data.image || FALLBACK_IMAGE;
  const title = data.name || "Restaurante Demo";
  const desc = data.description || "Las mejores hamburguesas artesanales de la ciudad.";
  const isLight = ["minimal", "editorial", "center", "air", "atelier"].includes(slug);
  const isSplit = ["minimal", "split", "air", "editorial", "atelier"].includes(slug);
  const isCentered = ["luxury", "center", "classic", "noir"].includes(slug);
  const style = {
    "--preview-image": `url("${image}")`,
    "--preview-accent": data.primary || visual.accent,
    "--preview-secondary": data.secondary || visual.accent,
    "--preview-surface": visual.surface,
    "--preview-ink": visual.ink,
  } as CSSProperties;

  return (
    <div className={`wlp-canvas wlp-canvas--${mode} wlp-canvas--${slug} ${isLight ? "is-light" : ""} ${isSplit ? "is-split" : ""} ${isCentered ? "is-centered" : ""}`} style={style}>
      <div className="wlp-grain" />
      <div className="wlp-nav"><span className="wlp-nav-menu">☰</span><strong>{title}</strong><span className="wlp-nav-links">MENU&nbsp;&nbsp;&nbsp;RESERVAS&nbsp;&nbsp;&nbsp;CONTACTO</span><span>◎</span></div>
      <div className="wlp-hero-image" />
      <div className="wlp-hero-content">
        <span className="wlp-overline">{visual.mode}</span>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="wlp-actions"><span>Ver menú</span><span>Ordenar ahora</span></div>
      </div>
      <div className="wlp-menu-block">
        <div className="wlp-section-head"><span>MENÚ</span><b>Selección de la casa</b></div>
        <div className="wlp-products">
          {[data.image, data.gallery[0] || data.image, data.gallery[1] || data.image].map((img, index) => (
            <div className="wlp-product" key={`${slug}-${index}`}><div style={{ backgroundImage: `url("${img}")` }} /><span>{["Plato insignia", "Bebida de autor", "Postre de la casa"][index]}</span><small>${["12.90", "6.50", "5.90"][index]}</small></div>
          ))}
        </div>
      </div>
      <div className="wlp-gallery-block"><div className="wlp-section-head"><span>GALERÍA</span><b>Ambiente · producto · detalle</b></div><div className="wlp-gallery"><div style={{ backgroundImage: `url("${image}")` }} /><div style={{ backgroundImage: `url("${data.gallery[0] || image}")` }} /><div style={{ backgroundImage: `url("${data.gallery[1] || image}")` }} /></div></div>
      <div className="wlp-page-footer">Wolf Ordering · experiencia diseñada para restaurantes</div>
    </div>
  );
}

function CatalogCard({ design, index, data, active, applied, onSelect }: { design: Catalog; index: number; data: PreviewData; active: boolean; applied: boolean; onSelect: () => void }) {
  const registry = DESIGN_THEME_REGISTRY.find((item) => item.slug === design.slug);
  const visual = VISUALS[design.slug] || VISUALS.cinematic;
  return (
    <button type="button" onClick={onSelect} className={`wlp-card ${active ? "is-selected" : ""}`} style={{ "--card-accent": data.primary || visual.accent } as CSSProperties}>
      <div className="wlp-card-art"><DesignComposition slug={design.slug} data={data} mode="mobile" /><span className="wlp-card-index">{String(index + 1).padStart(2, "0")}</span><span className="wlp-card-badge">{applied ? "ACTIVO" : active ? "SELECCIONADO" : registry?.mobileLabel || "RESPONSIVE"}</span></div>
      <div className="wlp-card-info"><div className="wlp-card-title">{design.name}</div><div className="wlp-card-description">{design.description || registry?.description}</div><div className="wlp-card-meta"><span>{design.hero_style}</span><span>{design.menu_style}</span><span>{design.gallery_style}</span></div></div>
    </button>
  );
}

export default function DesignThemeSelector({ restaurantId }: { restaurantId: string }) {
  const [designs, setDesigns] = useState<Catalog[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [savedId, setSavedId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");
  const [previewData, setPreviewData] = useState<PreviewData>({ name: "Restaurante Demo", description: "Las mejores hamburguesas artesanales de la ciudad.", image: FALLBACK_IMAGE, gallery: [], primary: "#f97316", secondary: "#fb923c" });

  useEffect(() => {
    let live = true;
    async function load() {
      const [catalog, assignment, restaurant, slide, gallery, theme] = await Promise.all([
        (supabase as any).from("design_theme_catalog").select("id,name,slug,description,hero_style,menu_style,gallery_style,config,sort_order").eq("is_active", true).order("sort_order", { ascending: true }),
        (supabase as any).from("restaurant_design_themes").select("theme_id").eq("restaurant_id", restaurantId).maybeSingle(),
        (supabase as any).from("restaurants").select("name,description,banner_url").eq("id", restaurantId).maybeSingle(),
        (supabase as any).from("restaurant_hero_slides").select("image_url").eq("restaurant_id", restaurantId).eq("active", true).order("sort_order", { ascending: true }).limit(1).maybeSingle(),
        (supabase as any).from("restaurant_gallery").select("image_url").eq("restaurant_id", restaurantId).order("sort_order", { ascending: true }).limit(6),
        (supabase as any).from("restaurant_theme_settings").select("primary_color,secondary_color").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (!live) return;
      const rows = (catalog.data || []) as Catalog[];
      setDesigns(rows);
      setSavedId(assignment.data?.theme_id || "");
      setSelectedId(assignment.data?.theme_id || rows[0]?.id || "");
      setPreviewData({
        name: restaurant.data?.name || "Restaurante Demo",
        description: restaurant.data?.description || "Las mejores hamburguesas artesanales de la ciudad.",
        image: slide.data?.image_url || restaurant.data?.banner_url || FALLBACK_IMAGE,
        gallery: (gallery.data || []).map((item: { image_url?: string }) => item.image_url).filter(Boolean) as string[],
        primary: theme.data?.primary_color || "#f97316",
        secondary: theme.data?.secondary_color || "#fb923c",
      });
      setLoaded(true);
    }
    load();
    return () => { live = false; };
  }, [restaurantId]);

  const current = designs.find((item) => item.id === selectedId);
  const selectedRegistry = useMemo(() => DESIGN_THEME_REGISTRY.find((item) => item.slug === current?.slug) || DESIGN_THEME_REGISTRY[0], [current?.slug]);
  const counts = useMemo(() => ({
    all: designs.length,
    minimal: designs.filter((d) => DESIGN_THEME_REGISTRY.find((r) => r.slug === d.slug)?.category === "minimal").length,
    premium: designs.filter((d) => DESIGN_THEME_REGISTRY.find((r) => r.slug === d.slug)?.category === "premium").length,
    creative: designs.filter((d) => DESIGN_THEME_REGISTRY.find((r) => r.slug === d.slug)?.category === "creative").length,
  }), [designs]);
  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return designs.filter((d) => {
      const registry = DESIGN_THEME_REGISTRY.find((r) => r.slug === d.slug);
      if (filter !== "all" && registry?.category !== filter) return false;
      return !text || `${d.name} ${d.description || ""}`.toLowerCase().includes(text);
    });
  }, [designs, filter, query]);

  async function apply() {
    if (!selectedId || selectedId === savedId) return;
    setSaving(true); setMessage("");
    const { error } = await (supabase as any).from("restaurant_design_themes").upsert({ restaurant_id: restaurantId, theme_id: selectedId, updated_at: new Date().toISOString() }, { onConflict: "restaurant_id" });
    if (error) setMessage(`No se pudo aplicar: ${error.message}`);
    else { setSavedId(selectedId); setMessage("Diseño aplicado correctamente. El Tema actual y tu contenido no han sido modificados."); }
    setSaving(false);
  }

  return (
    <section className="wlp-shell">
      <style jsx>{`
        .wlp-shell{margin:0 0 32px;border:1px solid rgba(167,139,250,.16);border-radius:28px;overflow:hidden;background:radial-gradient(circle at 82% -10%,rgba(124,58,237,.14),transparent 32%),linear-gradient(145deg,#0b0c11,#07080b);color:#fff;box-shadow:0 30px 110px rgba(0,0,0,.28)}
        .wlp-header{padding:24px 26px 20px;border-bottom:1px solid rgba(255,255,255,.07)}.wlp-header-row{display:flex;justify-content:space-between;gap:24px;align-items:flex-start}.wlp-eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:.19em;color:#b49bff;font-weight:900}.wlp-heading{font-size:clamp(26px,3vw,40px);letter-spacing:-.06em;line-height:.98;font-weight:760;margin:7px 0}.wlp-copy{max-width:760px;margin:0;color:#8f98a7;font-size:13px;line-height:1.6}.wlp-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}.wlp-apply{border:0;padding:12px 16px;border-radius:14px;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 15px 45px rgba(124,58,237,.22)}.wlp-apply:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.wlp-mode{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#aeb5c0;padding:12px 13px;border-radius:14px;font-size:10px;font-weight:900;cursor:pointer}.wlp-mode.active{color:#fff;border-color:rgba(167,139,250,.45);background:rgba(124,58,237,.14)}
        .wlp-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:13px 26px;border-bottom:1px solid rgba(255,255,255,.06)}.wlp-filter{padding:8px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);color:#9da5b1;font-size:10px;font-weight:900;cursor:pointer}.wlp-filter.active{color:#fff;background:rgba(124,58,237,.14);border-color:rgba(167,139,250,.45)}.wlp-search{margin-left:auto;width:220px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#fff;outline:none;padding:9px 12px;font-size:10px}
        .wlp-body{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:18px;padding:20px 26px 26px}.wlp-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.wlp-card{padding:0;border-radius:20px;overflow:hidden;background:#0a0c10;border:1px solid rgba(255,255,255,.07);color:#fff;text-align:left;cursor:pointer;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}.wlp-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.15)}.wlp-card.is-selected{border-color:color-mix(in srgb,var(--card-accent) 70%,white 30%);box-shadow:0 0 0 2px color-mix(in srgb,var(--card-accent) 20%,transparent),0 22px 60px rgba(0,0,0,.24)}.wlp-card-art{height:180px;position:relative}.wlp-card-index,.wlp-card-badge{position:absolute;z-index:5;top:10px}.wlp-card-index{left:10px;width:24px;height:24px;display:grid;place-items:center;border-radius:7px;background:rgba(0,0,0,.35);font-size:9px;font-weight:900;backdrop-filter:blur(8px)}.wlp-card-badge{right:10px;border-radius:999px;padding:5px 7px;font-size:8px;font-weight:900;background:rgba(0,0,0,.34);backdrop-filter:blur(8px)}.wlp-card-info{padding:12px 13px 14px}.wlp-card-title{font-size:14px;font-weight:840;letter-spacing:-.03em}.wlp-card-description{margin-top:5px;color:#8e97a5;font-size:10px;line-height:1.5;min-height:30px}.wlp-card-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:9px}.wlp-card-meta span{padding:5px 7px;border-radius:7px;background:rgba(255,255,255,.04);color:#abb3be;font-size:8px;font-weight:800}
        .wlp-side{position:sticky;top:14px;border-radius:24px;padding:12px;background:linear-gradient(180deg,#0f1117,#080a0e);border:1px solid rgba(255,255,255,.08);box-shadow:0 25px 80px rgba(0,0,0,.26);align-self:start}.wlp-side-head{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 10px}.wlp-side-label{text-transform:uppercase;letter-spacing:.15em;font-size:9px;font-weight:900;color:#929aa6}.wlp-live-dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 15px #34d399}.wlp-side-name{font-size:21px;line-height:1.05;font-weight:850;letter-spacing:-.045em}.wlp-side-copy{font-size:10px;color:#9098a5;line-height:1.55;margin:5px 0 11px}.wlp-side-specs{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.wlp-spec{padding:9px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)}.wlp-spec span{display:block;font-size:7px;text-transform:uppercase;letter-spacing:.12em;color:#707885}.wlp-spec b{display:block;margin-top:4px;font-size:10px;color:#dde2e8}.wlp-message{margin-top:10px;color:#a7f3d0;font-size:10px;line-height:1.5}.wlp-message.error{color:#fca5a5}
        .wlp-canvas{position:relative;isolation:isolate;overflow:hidden;background:var(--preview-surface);color:var(--preview-ink);font-family:Inter,system-ui,sans-serif}.wlp-canvas--mobile{height:610px;border-radius:28px}.wlp-canvas--desktop{height:440px;border-radius:20px}.wlp-card-art .wlp-canvas{min-height:180px;height:180px;border-radius:0}.wlp-grain{position:absolute;inset:0;z-index:7;pointer-events:none;opacity:.055;background-image:radial-gradient(rgba(255,255,255,.5) .5px,transparent .8px);background-size:5px 5px;mix-blend-mode:overlay}.wlp-nav{position:absolute;z-index:10;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:21px 18px 10px;font-size:9px}.wlp-nav-menu{display:none}.wlp-nav-links{font-size:7px;opacity:.52;letter-spacing:.08em}.wlp-hero-image{position:absolute;inset:0;z-index:-4;background-image:linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(0,0,0,.72) 100%),var(--preview-image);background-size:cover;background-position:center}.wlp-hero-content{position:absolute;z-index:3;left:0;right:0;bottom:0;padding:30px 20px 22px}.wlp-overline{display:block;font-size:7px;font-weight:900;letter-spacing:.18em;opacity:.62;margin-bottom:8px}.wlp-hero-content h3{margin:0;max-width:78%;font-size:29px;line-height:.9;letter-spacing:-.065em;font-weight:900}.wlp-hero-content p{margin:9px 0 0;max-width:70%;font-size:9px;line-height:1.45;opacity:.75}.wlp-actions{display:flex;gap:6px;margin-top:12px}.wlp-actions span{border:1px solid rgba(255,255,255,.22);background:rgba(0,0,0,.15);backdrop-filter:blur(10px);border-radius:999px;padding:7px 9px;font-size:7px;font-weight:900}.wlp-menu-block,.wlp-gallery-block{position:relative;z-index:6;padding:12px 13px}.wlp-menu-block{margin-top:580px;background:var(--preview-surface)}.wlp-section-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:8px}.wlp-section-head span{font-weight:900;letter-spacing:.18em;opacity:.48}.wlp-section-head b{font-size:8px}.wlp-products{display:flex;gap:6px;margin-top:8px}.wlp-product{flex:1;min-width:0}.wlp-product>div{height:65px;border-radius:10px;background-size:cover;background-position:center}.wlp-product span{display:block;font-size:7px;font-weight:850;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wlp-product small{font-size:7px;opacity:.52}.wlp-gallery-block{background:var(--preview-surface)}.wlp-gallery{display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;margin-top:8px}.wlp-gallery div{height:70px;border-radius:9px;background-size:cover;background-position:center}.wlp-page-footer{text-align:center;padding:10px 12px 18px;font-size:7px;opacity:.35}
        .wlp-canvas--desktop .wlp-nav{padding:24px 28px 12px;font-size:11px}.wlp-canvas--desktop .wlp-nav-links{font-size:8px}.wlp-canvas--desktop .wlp-hero-content{padding:90px 48px 42px}.wlp-canvas--desktop .wlp-hero-content h3{font-size:57px;max-width:60%}.wlp-canvas--desktop .wlp-hero-content p{font-size:12px;max-width:48%}.wlp-canvas--desktop .wlp-actions span{font-size:9px;padding:9px 12px}.wlp-canvas--desktop .wlp-menu-block{margin-top:410px;padding:18px 30px}.wlp-canvas--desktop .wlp-product>div{height:90px}.wlp-canvas--desktop .wlp-gallery-block{padding:18px 30px}.wlp-canvas--desktop .wlp-gallery div{height:100px}
        .wlp-canvas--minimal .wlp-hero-image,.wlp-canvas--split .wlp-hero-image,.wlp-canvas--air .wlp-hero-image,.wlp-canvas--editorial .wlp-hero-image,.wlp-canvas--atelier .wlp-hero-image{left:44%;bottom:auto;height:47%;border-radius:0 0 0 18px;background-image:var(--preview-image)}.wlp-canvas--minimal .wlp-hero-content,.wlp-canvas--split .wlp-hero-content,.wlp-canvas--air .wlp-hero-content,.wlp-canvas--editorial .wlp-hero-content,.wlp-canvas--atelier .wlp-hero-content{right:46%;bottom:auto;top:28%;padding:18px;color:var(--preview-ink)}.wlp-canvas--minimal .wlp-hero-content h3,.wlp-canvas--split .wlp-hero-content h3,.wlp-canvas--air .wlp-hero-content h3,.wlp-canvas--editorial .wlp-hero-content h3,.wlp-canvas--atelier .wlp-hero-content h3{font-size:24px}.wlp-canvas--minimal .wlp-hero-content p,.wlp-canvas--split .wlp-hero-content p,.wlp-canvas--air .wlp-hero-content p,.wlp-canvas--editorial .wlp-hero-content p,.wlp-canvas--atelier .wlp-hero-content p{color:var(--preview-ink)}.wlp-canvas--minimal .wlp-hero-image:after,.wlp-canvas--split .wlp-hero-image:after,.wlp-canvas--air .wlp-hero-image:after,.wlp-canvas--editorial .wlp-hero-image:after,.wlp-canvas--atelier .wlp-hero-image:after{content:"";position:absolute;inset:10px;border:1px solid rgba(0,0,0,.10);border-radius:inherit}.wlp-canvas--minimal .wlp-menu-block,.wlp-canvas--split .wlp-menu-block,.wlp-canvas--air .wlp-menu-block,.wlp-canvas--editorial .wlp-menu-block,.wlp-canvas--atelier .wlp-menu-block{margin-top:580px}
        .wlp-canvas--luxury .wlp-hero-image,.wlp-canvas--noir .wlp-hero-image{inset:8%;border-radius:2px;background-image:var(--preview-image)}.wlp-canvas--luxury .wlp-hero-content,.wlp-canvas--noir .wlp-hero-content{inset:15%;bottom:auto;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:24px}.wlp-canvas--luxury .wlp-hero-content h3,.wlp-canvas--noir .wlp-hero-content h3{font-family:Georgia,serif;font-weight:500}.wlp-canvas--neon .wlp-hero-image,.wlp-canvas--bold .wlp-hero-image{left:36%;clip-path:polygon(10% 0,100% 0,100% 100%,0 100%)}.wlp-canvas--neon .wlp-hero-content,.wlp-canvas--bold .wlp-hero-content{right:34%;top:28%;bottom:auto}.wlp-canvas--neon .wlp-hero-content:before{content:"";position:absolute;width:130px;height:130px;background:var(--preview-accent);filter:blur(55px);opacity:.2;left:0;top:0}.wlp-canvas--center .wlp-hero-image{inset:18%;border-radius:24px;background-image:var(--preview-image);opacity:.72}.wlp-canvas--center .wlp-hero-content{inset:22%;bottom:auto;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:15px;background:rgba(255,255,255,.10);border:1px solid rgba(0,0,0,.10);backdrop-filter:blur(10px);border-radius:24px}.wlp-canvas--classic .wlp-hero-image{inset:8%;border:1px solid rgba(214,193,155,.34);background-image:var(--preview-image)}.wlp-canvas--classic .wlp-hero-content{text-align:center;inset:14%;bottom:auto;display:flex;flex-direction:column;justify-content:center;align-items:center}.wlp-canvas--classic .wlp-hero-content h3{font-family:Georgia,serif;font-weight:500}.wlp-canvas--monolith .wlp-hero-image{inset:7% 10%;border-radius:2px;background-image:var(--preview-image)}.wlp-canvas--monolith .wlp-hero-content{left:9%;right:9%;bottom:21%;padding:24px;background:rgba(6,7,9,.78);border-left:2px solid var(--preview-accent);backdrop-filter:blur(8px)}.wlp-canvas--atelier .wlp-hero-image{clip-path:polygon(7% 0,100% 8%,92% 100%,0 92%)}
        .wlp-card-art .wlp-canvas .wlp-nav{padding:10px 12px 5px}.wlp-card-art .wlp-canvas .wlp-nav-links{display:none}.wlp-card-art .wlp-canvas .wlp-hero-content{padding:13px}.wlp-card-art .wlp-canvas .wlp-hero-content h3{font-size:18px}.wlp-card-art .wlp-canvas .wlp-hero-content p{font-size:6px}.wlp-card-art .wlp-canvas .wlp-actions{margin-top:6px}.wlp-card-art .wlp-canvas .wlp-actions span{font-size:5px;padding:4px 6px}.wlp-card-art .wlp-canvas .wlp-menu-block,.wlp-card-art .wlp-canvas .wlp-gallery-block,.wlp-card-art .wlp-canvas .wlp-page-footer{display:none}
        @media(max-width:1230px){.wlp-body{grid-template-columns:minmax(0,1fr) 330px}.wlp-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:980px){.wlp-header-row{flex-direction:column}.wlp-actions{justify-content:flex-start}.wlp-body{grid-template-columns:1fr}.wlp-side{position:relative;top:auto;max-width:520px;margin:0 auto;width:100%}.wlp-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:760px){.wlp-header,.wlp-toolbar,.wlp-body{padding-left:14px;padding-right:14px}.wlp-toolbar{gap:6px}.wlp-search{width:100%;margin-left:0;order:3}.wlp-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.wlp-card-art{height:160px}.wlp-card-art .wlp-canvas{height:160px;min-height:160px}}
        @media(max-width:520px){.wlp-grid{grid-template-columns:1fr}.wlp-apply,.wlp-mode{width:100%}.wlp-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.wlp-header-row{gap:14px}.wlp-heading{font-size:28px}.wlp-card-art{height:190px}.wlp-card-art .wlp-canvas{height:190px;min-height:190px}.wlp-canvas--mobile{height:560px}}
      `}</style>

      <header className="wlp-header">
        <div className="wlp-header-row">
          <div>
            <div className="wlp-eyebrow">Diseño de experiencia · composición</div>
            <h2 className="wlp-heading">Hero + Menú + Galería</h2>
            <p className="wlp-copy">Selecciona cómo se estructura visualmente tu restaurante. El Tema actual sigue controlando colores, tipografía, botones y efectos; aquí solo cambiamos la composición.</p>
          </div>
          <div className="wlp-actions">
            <button className={`wlp-mode ${previewMode === "mobile" ? "active" : ""}`} onClick={() => setPreviewMode("mobile")} type="button">Vista móvil</button>
            <button className={`wlp-mode ${previewMode === "desktop" ? "active" : ""}`} onClick={() => setPreviewMode("desktop")} type="button">Vista escritorio</button>
            <button className="wlp-apply" onClick={apply} disabled={!loaded || !selectedId || saving || selectedId === savedId} type="button">{saving ? "Aplicando…" : selectedId === savedId ? "Diseño aplicado" : "Aplicar diseño seleccionado"}</button>
          </div>
        </div>
      </header>

      <div className="wlp-toolbar">
        {(["all", "minimal", "premium", "creative"] as Filter[]).map((id) => {
          const labels: Record<Filter, string> = { all: "Todos", minimal: "Minimalistas", premium: "Premium", creative: "Creativos" };
          return <button key={id} type="button" className={`wlp-filter ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>{labels[id]} {counts[id]}</button>;
        })}
        <input className="wlp-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar diseño…" aria-label="Buscar diseño" />
      </div>

      <div className="wlp-body">
        <div className="wlp-grid">
          {!loaded ? <div style={{ gridColumn: "1/-1", padding: 36, color: "#8f98a6" }}>Cargando diseños…</div> : visible.map((design, index) => (
            <CatalogCard key={design.id} design={design} index={index} data={previewData} active={selectedId === design.id} applied={savedId === design.id} onSelect={() => { setSelectedId(design.id); setMessage(""); }} />
          ))}
        </div>

        <aside className="wlp-side">
          <div className="wlp-side-head"><span className="wlp-side-label">Vista previa real · {previewMode === "mobile" ? "móvil" : "escritorio"}</span><span className="wlp-live-dot" /></div>
          <DesignComposition slug={current?.slug || selectedRegistry.slug} data={previewData} mode={previewMode} />
          <div className="wlp-side-name" style={{ marginTop: 14 }}>{current?.name || selectedRegistry.name}</div>
          <p className="wlp-side-copy">{current?.description || selectedRegistry.description}</p>
          <div className="wlp-side-specs">
            <div className="wlp-spec"><span>Hero</span><b>{current?.hero_style || selectedRegistry.heroStyle}</b></div>
            <div className="wlp-spec"><span>Menú</span><b>{current?.menu_style || selectedRegistry.menuStyle}</b></div>
            <div className="wlp-spec"><span>Galería</span><b>{current?.gallery_style || selectedRegistry.galleryStyle}</b></div>
            <div className="wlp-spec"><span>Estado</span><b>{selectedId === savedId ? "Aplicado" : "Sin guardar"}</b></div>
          </div>
          {message && <div className={`wlp-message ${message.startsWith("No se") ? "error" : ""}`}>{message}</div>}
        </aside>
      </div>
    </section>
  );
}
