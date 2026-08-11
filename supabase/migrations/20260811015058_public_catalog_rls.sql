-- ============================================================================
-- Wolf Ordering
-- MIGRATION: PUBLIC CATALOG / CONFIGURATION ACCESS
-- Date: 2026-08-10
--
-- OBJETIVO
-- ----------------------------------------------------------------------------
-- Una sola migración para separar:
--
--   1) VISIBILIDAD PÚBLICA
--      El cliente puede leer el contenido público aunque tenga una sesión
--      autenticada en la PWA/navegador.
--
--   2) PERMISOS INTERNOS
--      Los roles siguen controlando INSERT/UPDATE/DELETE y los módulos
--      administrativos.
--
-- IMPORTANTE
-- ----------------------------------------------------------------------------
-- NO modifica:
--   - can_view_catalog()
--   - can_manage_catalog()
--   - belongs_to_restaurant()
--   - permisos INSERT
--   - permisos UPDATE
--   - permisos DELETE
--   - pedidos
--   - usuarios
--   - roles
--
-- Solo cambia las políticas SELECT que ya eran públicas para "anon" para que
-- también apliquen a "authenticated".
--
-- En PostgreSQL:
--
--   TO public
--
-- significa tanto anon como authenticated.
--
-- Los filtros públicos originales SE CONSERVAN.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. RESTAURANTS
-- ============================================================================
-- Público únicamente para restaurantes activos y no suspendidos.
-- ============================================================================

DROP POLICY IF EXISTS restaurants_public_select
ON public.restaurants;

CREATE POLICY restaurants_public_select
ON public.restaurants
FOR SELECT
TO public
USING (
    active = true
    AND suspended = false
);


-- ============================================================================
-- 2. CATEGORIES
-- ============================================================================
-- Público únicamente para categorías activas de restaurantes activos.
-- ============================================================================

DROP POLICY IF EXISTS categories_public_select
ON public.categories;

CREATE POLICY categories_public_select
ON public.categories
FOR SELECT
TO public
USING (
    active = true
    AND EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )
);


-- ============================================================================
-- 3. PRODUCTS
-- ============================================================================
-- Público únicamente para productos disponibles de restaurantes activos.
--
-- IMPORTANTE:
-- available = false SIGUE ocultando el producto del cliente.
-- Esto NO elimina el control interno de disponibilidad.
-- ============================================================================

DROP POLICY IF EXISTS products_public_select
ON public.products;

CREATE POLICY products_public_select
ON public.products
FOR SELECT
TO public
USING (
    available = true
    AND EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )
);


-- ============================================================================
-- 4. RESTAURANT GALLERY
-- ============================================================================
-- Público únicamente para imágenes activas de restaurantes activos.
-- ============================================================================

DROP POLICY IF EXISTS gallery_public_select
ON public.restaurant_gallery;

CREATE POLICY gallery_public_select
ON public.restaurant_gallery
FOR SELECT
TO public
USING (
    active = true
    AND EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )
);


-- ============================================================================
-- 5. RESTAURANT SETTINGS
-- ============================================================================
-- Mantiene exactamente el mismo filtro que ya tenía la política pública.
-- Solo deja de depender de que el navegador sea "anon".
-- ============================================================================

DROP POLICY IF EXISTS restaurant_settings_public_select
ON public.restaurant_settings;

CREATE POLICY restaurant_settings_public_select
ON public.restaurant_settings
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )
);

COMMIT;


-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- Ejecuta este SELECT después del db push si quieres comprobar las políticas.
--
-- SELECT
--     tablename,
--     policyname,
--     roles,
--     cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND policyname IN (
--       'restaurants_public_select',
--       'categories_public_select',
--       'products_public_select',
--       'gallery_public_select',
--       'restaurant_settings_public_select'
--   )
-- ORDER BY tablename, policyname;
--
-- En las cinco políticas debe aparecer:
--
--     {public}
--
-- ============================================================================