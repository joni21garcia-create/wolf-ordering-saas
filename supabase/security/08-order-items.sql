-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 08-order-items.sql
--
-- Tabla:
--   public.order_items
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena los productos pertenecientes a cada pedido.
--
-- Los permisos se determinan a través del pedido asociado.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT
--   • can_view_orders()
--
-- INSERT
--   • can_manage_orders()
--
-- UPDATE
--   • can_manage_orders()
--
-- DELETE
--   • Sin política.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_order(uuid)
-- public.can_view_orders()
-- public.can_manage_orders()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

ALTER TABLE public.order_items
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS order_items_select
ON public.order_items;

DROP POLICY IF EXISTS order_items_insert
ON public.order_items;

DROP POLICY IF EXISTS order_items_update
ON public.order_items;

DROP POLICY IF EXISTS order_items_delete
ON public.order_items;

-- ============================================================================
-- SELECT
-- ============================================================================

CREATE POLICY order_items_select

ON public.order_items

FOR SELECT

TO authenticated

USING (

    public.belongs_to_order(order_id)

    AND public.can_view_orders()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY order_items_insert

ON public.order_items

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_order(order_id)

    AND public.can_manage_orders()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY order_items_update

ON public.order_items

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_order(order_id)

    AND public.can_manage_orders()

)

WITH CHECK (

    public.belongs_to_order(order_id)

    AND public.can_manage_orders()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
--
-- Los detalles del pedido forman parte del historial operativo y no deben
-- eliminarse.
--
-- ============================================================================