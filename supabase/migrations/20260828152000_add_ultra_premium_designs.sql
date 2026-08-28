-- Wolf Ordering — Diseño de experiencia v3
-- Solo añade composiciones. NO modifica restaurant_theme_settings.

alter table public.design_theme_catalog
  drop constraint if exists design_theme_catalog_hero_style_chk,
  drop constraint if exists design_theme_catalog_menu_style_chk,
  drop constraint if exists design_theme_catalog_gallery_style_chk;

alter table public.design_theme_catalog
  add constraint design_theme_catalog_hero_style_chk check (
    hero_style in (
      'cinematic','minimal','luxury','neon','editorial','glass','nature',
      'split','center','bold','classic','air','monolith','atelier','noir'
    )
  ),
  add constraint design_theme_catalog_menu_style_chk check (
    menu_style in (
      'cinematic','minimal','luxury','neon','editorial','glass','nature',
      'cards','list','air','monolith','atelier','signature'
    )
  ),
  add constraint design_theme_catalog_gallery_style_chk check (
    gallery_style in (
      'masonry','minimal','luxury','neon','editorial','glass','nature',
      'grid','air','monolith','atelier','signature'
    )
  );

insert into public.design_theme_catalog
  (name, slug, description, hero_style, menu_style, gallery_style, config, sort_order)
values
  ('Air / Swiss', 'air', 'Minimalismo de lujo con espacio, tipografía precisa y fotografía escultórica.', 'air', 'air', 'air', '{"composition":"swiss","mobileFirst":true,"density":"airy"}'::jsonb, 120),
  ('Monolith / Luxe', 'monolith', 'Panel arquitectónico, escala monumental y fotografía como pieza de arte.', 'monolith', 'monolith', 'monolith', '{"composition":"monolith","mobileFirst":true,"density":"focused"}'::jsonb, 130),
  ('Atelier / Art', 'atelier', 'Dirección creativa asimétrica con máscaras editoriales y ritmo visual.', 'atelier', 'atelier', 'atelier', '{"composition":"atelier","mobileFirst":true,"density":"art-directed"}'::jsonb, 140),
  ('Noir / Signature', 'noir', 'Lujo silencioso con marco fino, contraste profundo y firma visual.', 'noir', 'signature', 'signature', '{"composition":"signature","mobileFirst":true,"density":"quiet-luxury"}'::jsonb, 150)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  hero_style = excluded.hero_style,
  menu_style = excluded.menu_style,
  gallery_style = excluded.gallery_style,
  config = excluded.config,
  sort_order = excluded.sort_order,
  updated_at = now();
