-- ============================================================================
-- Wolf Ordering: sistema de diseños completos (Hero + Menú + Galería)
-- ============================================================================

create table if not exists public.design_theme_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  hero_style text not null default 'cinematic',
  menu_style text not null default 'cinematic',
  gallery_style text not null default 'masonry',
  config jsonb not null default '{}'::jsonb,
  preview_image text,
  is_active boolean not null default true,
  is_system boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint design_theme_catalog_hero_style_chk check (
    hero_style in ('cinematic','minimal','luxury','neon','editorial','glass','nature')
  ),
  constraint design_theme_catalog_menu_style_chk check (
    menu_style in ('cinematic','minimal','luxury','neon','editorial','glass','nature')
  ),
  constraint design_theme_catalog_gallery_style_chk check (
    gallery_style in ('masonry','minimal','luxury','neon','editorial','glass','nature')
  )
);

create table if not exists public.restaurant_design_themes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants(id) on delete cascade,
  theme_id uuid not null references public.design_theme_catalog(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists design_theme_catalog_active_sort_idx
  on public.design_theme_catalog(is_active, sort_order);

create index if not exists restaurant_design_themes_theme_idx
  on public.restaurant_design_themes(theme_id);

alter table public.design_theme_catalog enable row level security;
alter table public.restaurant_design_themes enable row level security;

drop policy if exists design_theme_catalog_public_select on public.design_theme_catalog;
create policy design_theme_catalog_public_select
on public.design_theme_catalog
for select
to anon
using (is_active = true);

drop policy if exists design_theme_catalog_authenticated_select on public.design_theme_catalog;
create policy design_theme_catalog_authenticated_select
on public.design_theme_catalog
for select
to authenticated
using (is_active = true or public.is_super_admin());

drop policy if exists design_theme_catalog_super_admin_insert on public.design_theme_catalog;
create policy design_theme_catalog_super_admin_insert
on public.design_theme_catalog
for insert
to authenticated
with check (public.is_super_admin());

drop policy if exists design_theme_catalog_super_admin_update on public.design_theme_catalog;
create policy design_theme_catalog_super_admin_update
on public.design_theme_catalog
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists design_theme_catalog_super_admin_delete on public.design_theme_catalog;
create policy design_theme_catalog_super_admin_delete
on public.design_theme_catalog
for delete
to authenticated
using (public.is_super_admin());

drop policy if exists restaurant_design_themes_public_select on public.restaurant_design_themes;
create policy restaurant_design_themes_public_select
on public.restaurant_design_themes
for select
to anon
using (
  exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id
      and r.active = true
      and coalesce(r.suspended, false) = false
  )
);

drop policy if exists restaurant_design_themes_authenticated_select on public.restaurant_design_themes;
create policy restaurant_design_themes_authenticated_select
on public.restaurant_design_themes
for select
to authenticated
using (
  public.is_super_admin()
  or public.belongs_to_restaurant(restaurant_id)
);

drop policy if exists restaurant_design_themes_insert on public.restaurant_design_themes;
create policy restaurant_design_themes_insert
on public.restaurant_design_themes
for insert
to authenticated
with check (
  (public.is_super_admin() or public.belongs_to_restaurant(restaurant_id))
  and exists (
    select 1 from public.design_theme_catalog d
    where d.id = theme_id and d.is_active = true
  )
);

drop policy if exists restaurant_design_themes_update on public.restaurant_design_themes;
create policy restaurant_design_themes_update
on public.restaurant_design_themes
for update
to authenticated
using (public.is_super_admin() or public.belongs_to_restaurant(restaurant_id))
with check (
  (public.is_super_admin() or public.belongs_to_restaurant(restaurant_id))
  and exists (
    select 1 from public.design_theme_catalog d
    where d.id = theme_id and d.is_active = true
  )
);

drop policy if exists restaurant_design_themes_delete on public.restaurant_design_themes;
create policy restaurant_design_themes_delete
on public.restaurant_design_themes
for delete
to authenticated
using (public.is_super_admin() or public.belongs_to_restaurant(restaurant_id));

-- Seed de diseños oficiales. Los estilos se aplican a Hero, Menú y Galería.
insert into public.design_theme_catalog
  (name, slug, description, hero_style, menu_style, gallery_style, config, sort_order)
values
  ('Cinematic / Dark', 'cinematic', 'Oscuro, fotográfico, elegante y profesional.', 'cinematic', 'cinematic', 'masonry',
   '{"primary":"#f59e0b","secondary":"#f97316","background":"#050505","text":"#ffffff","font":"Inter","buttonStyle":"rounded","cardStyle":"glass","heroOverlay":"dark","glow":true}'::jsonb, 10),
  ('Minimal / Light', 'minimal', 'Claro, limpio, editorial y minimalista.', 'minimal', 'minimal', 'minimal',
   '{"primary":"#111111","secondary":"#6b7280","background":"#f7f5f0","text":"#111111","font":"Plus Jakarta Sans","buttonStyle":"square","cardStyle":"solid","heroOverlay":"light","glow":false}'::jsonb, 20),
  ('Luxury / Gold', 'luxury', 'Premium, sofisticado y orientado a restaurantes de alta gama.', 'luxury', 'luxury', 'luxury',
   '{"primary":"#d4af37","secondary":"#f59e0b","background":"#090806","text":"#fff7df","font":"Playfair Display","buttonStyle":"rounded","cardStyle":"solid","heroOverlay":"premium","glow":true}'::jsonb, 30),
  ('Neon / Urban', 'neon', 'Urbano, vibrante y con personalidad visual fuerte.', 'neon', 'neon', 'neon',
   '{"primary":"#ec4899","secondary":"#8b5cf6","background":"#07020d","text":"#ffffff","font":"Space Grotesk","buttonStyle":"pill","cardStyle":"neon","heroOverlay":"dark","glow":true}'::jsonb, 40),
  ('Editorial / Magazine', 'editorial', 'Composición de revista con foco en tipografía y fotografía.', 'editorial', 'editorial', 'editorial',
   '{"primary":"#111111","secondary":"#7c2d12","background":"#f3eee6","text":"#111111","font":"Cormorant Garamond","buttonStyle":"square","cardStyle":"solid","heroOverlay":"light","glow":false}'::jsonb, 50),
  ('Glass / Blur', 'glass', 'Transparencias, profundidad y efecto de vidrio moderno.', 'glass', 'glass', 'glass',
   '{"primary":"#60a5fa","secondary":"#c084fc","background":"#07111f","text":"#ffffff","font":"Outfit","buttonStyle":"rounded","cardStyle":"glass","heroOverlay":"dark","glow":true}'::jsonb, 60),
  ('Nature / Warm', 'nature', 'Cálido, orgánico y pensado para cocina artesanal.', 'nature', 'nature', 'nature',
   '{"primary":"#84cc16","secondary":"#d97706","background":"#18150d","text":"#fffdf5","font":"Lora","buttonStyle":"rounded","cardStyle":"glass","heroOverlay":"dark","glow":false}'::jsonb, 70)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  hero_style = excluded.hero_style,
  menu_style = excluded.menu_style,
  gallery_style = excluded.gallery_style,
  config = excluded.config,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Todo restaurante existente recibe Cinematic como valor inicial, sin modificar
-- su configuración de contenido ni las variables de restaurant_theme_settings.
insert into public.restaurant_design_themes (restaurant_id, theme_id)
select r.id, d.id
from public.restaurants r
join public.design_theme_catalog d on d.slug = 'cinematic'
where not exists (
  select 1
  from public.restaurant_design_themes x
  where x.restaurant_id = r.id
)
on conflict (restaurant_id) do nothing;

create or replace function public.set_design_theme_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists design_theme_catalog_updated_at on public.design_theme_catalog;
create trigger design_theme_catalog_updated_at
before update on public.design_theme_catalog
for each row execute function public.set_design_theme_updated_at();

drop trigger if exists restaurant_design_themes_updated_at on public.restaurant_design_themes;
create trigger restaurant_design_themes_updated_at
before update on public.restaurant_design_themes
for each row execute function public.set_design_theme_updated_at();
