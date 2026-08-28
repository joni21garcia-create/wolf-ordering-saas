-- Wolf Ordering: premium layout catalog v2
-- IMPORTANT: this migration changes only the allowed layout identifiers and adds
-- four new compositions. Existing Theme settings are untouched.

alter table public.design_theme_catalog
  drop constraint if exists design_theme_catalog_hero_style_chk,
  drop constraint if exists design_theme_catalog_menu_style_chk,
  drop constraint if exists design_theme_catalog_gallery_style_chk;

alter table public.design_theme_catalog
  add constraint design_theme_catalog_hero_style_chk check (
    hero_style in ('cinematic','minimal','luxury','neon','editorial','glass','nature','split','center','bold','classic')
  ),
  add constraint design_theme_catalog_menu_style_chk check (
    menu_style in ('cinematic','minimal','luxury','neon','editorial','glass','nature','cards','list','minimal')
  ),
  add constraint design_theme_catalog_gallery_style_chk check (
    gallery_style in ('masonry','minimal','luxury','neon','editorial','glass','nature','grid')
  );

insert into public.design_theme_catalog
  (name, slug, description, hero_style, menu_style, gallery_style, config, sort_order)
values
  ('Split / Clean', 'split', 'Dos columnas equilibradas, minimalistas y mobile-first.', 'split', 'cards', 'grid', '{"composition":"two-column","mobileFirst":true}'::jsonb, 80),
  ('Center / Focus', 'center', 'Escena centrada con mucho aire visual y foco en el restaurante.', 'center', 'minimal', 'grid', '{"composition":"centered","mobileFirst":true}'::jsonb, 90),
  ('Bold / Colorful', 'bold', 'Bloques visuales y tipografía a gran escala para marcas atrevidas.', 'bold', 'cards', 'grid', '{"composition":"blocks","mobileFirst":true}'::jsonb, 100),
  ('Classic / Elegant', 'classic', 'Simetría, marco y estética boutique atemporal.', 'classic', 'list', 'grid', '{"composition":"classic","mobileFirst":true}'::jsonb, 110)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  hero_style = excluded.hero_style,
  menu_style = excluded.menu_style,
  gallery_style = excluded.gallery_style,
  config = excluded.config,
  sort_order = excluded.sort_order,
  updated_at = now();
