-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 06-gallery.sql
--
-- Tabla:
--   public.restaurant_gallery
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena las imágenes de la galería pertenecientes a cada restaurante.
--
-- Los visitantes pueden consultar únicamente las imágenes activas de
-- restaurantes activos y no suspendidos.
--
-- Los usuarios autenticados solo pueden acceder a las imágenes de su propio
-- restaurante.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
--   • Imágenes activas de restaurantes activos.
--
-- SELECT
--   • can_view_catalog()
--
-- INSERT
--   • can_manage_catalog()
--
-- UPDATE
--   • can_manage_catalog()
--
-- DELETE
--   • Sin política.
--     Las imágenes deben desactivarse utilizando el campo "active".
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_catalog()
-- public.can_manage_catalog()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

ALTER TABLE public.restaurant_gallery
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS gallery_public_select
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_select
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_insert
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_update
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_delete
ON public.restaurant_gallery;

-- ============================================================================
-- SELECT (PUBLIC)
-- ============================================================================

CREATE POLICY gallery_public_select

ON public.restaurant_gallery

FOR SELECT

TO anon

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
-- SELECT
-- ============================================================================

CREATE POLICY gallery_select

ON public.restaurant_gallery

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY gallery_insert

ON public.restaurant_gallery

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY gallery_update

ON public.restaurant_gallery

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

)

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
--
-- Para ocultar una imagen utilizar:
--
--     active = false
--
-- ============================================================================