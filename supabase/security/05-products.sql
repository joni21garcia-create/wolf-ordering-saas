-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 05-products.sql
--
-- Tabla:
--   public.products
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena los productos pertenecientes al catálogo de cada restaurante.
--
-- Los visitantes pueden consultar únicamente los productos disponibles de
-- restaurantes activos y no suspendidos.
--
-- Los usuarios autenticados solo pueden acceder a los productos de su propio
-- restaurante.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
--   • Productos disponibles de restaurantes activos.
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
--     Los productos deben deshabilitarse mediante el campo "available".
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

ALTER TABLE public.products
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS products_public_select
ON public.products;

DROP POLICY IF EXISTS products_select
ON public.products;

DROP POLICY IF EXISTS products_insert
ON public.products;

DROP POLICY IF EXISTS products_update
ON public.products;

DROP POLICY IF EXISTS products_delete
ON public.products;

-- ============================================================================
-- SELECT (PUBLIC)
-- ============================================================================

CREATE POLICY products_public_select

ON public.products

FOR SELECT

TO anon

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
-- SELECT
-- ============================================================================

CREATE POLICY products_select

ON public.products

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY products_insert

ON public.products

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY products_update

ON public.products

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
-- Para retirar un producto del menú utilizar:
--
--     available = false
--
-- ============================================================================