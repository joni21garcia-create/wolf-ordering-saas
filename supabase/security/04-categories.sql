-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 04-categories.sql
--
-- Tabla:
--   public.categories
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena las categorías del menú de cada restaurante.
--
-- Los visitantes pueden consultar únicamente las categorías activas de
-- restaurantes activos y no suspendidos.
--
-- Los usuarios autenticados solo pueden acceder a las categorías de su propio
-- restaurante.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
--   • Categorías activas de restaurantes activos.
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
--     Las categorías deben desactivarse mediante el campo "active".
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

ALTER TABLE public.categories
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS categories_public_select
ON public.categories;

DROP POLICY IF EXISTS categories_select
ON public.categories;

DROP POLICY IF EXISTS categories_insert
ON public.categories;

DROP POLICY IF EXISTS categories_update
ON public.categories;

DROP POLICY IF EXISTS categories_delete
ON public.categories;

-- ============================================================================
-- SELECT (PUBLIC)
--
-- Permite consultar únicamente las categorías activas pertenecientes a
-- restaurantes activos y no suspendidos.
-- ============================================================================

CREATE POLICY categories_public_select

ON public.categories

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
--
-- Permite consultar únicamente las categorías pertenecientes al restaurante
-- del usuario autenticado.
-- ============================================================================

CREATE POLICY categories_select

ON public.categories

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_view_catalog()

);

-- ============================================================================
-- INSERT
--
-- Permite crear categorías únicamente dentro del restaurante del usuario
-- autenticado y solo a quienes administran el catálogo.
-- ============================================================================

CREATE POLICY categories_insert

ON public.categories

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
--
-- Permite modificar categorías únicamente dentro del restaurante del usuario
-- autenticado y solo a quienes administran el catálogo.
-- ============================================================================

CREATE POLICY categories_update

ON public.categories

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
-- PostgreSQL deniega automáticamente esta operación al no existir una política
-- que la permita.
--
-- Las categorías deben desactivarse utilizando el campo:
--
--   active = false
--
-- ============================================================================