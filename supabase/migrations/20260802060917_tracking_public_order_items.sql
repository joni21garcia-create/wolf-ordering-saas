-- ============================================================================
-- Wolf Ordering
-- Migration
-- File: tracking_public_order_items.sql
--
-- Permite que el Tracking público pueda consultar
-- los productos pertenecientes a un pedido.
--
-- No modifica las políticas del Dashboard.
-- ============================================================================

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================

DROP POLICY IF EXISTS order_items_tracking_public
ON public.order_items;

CREATE POLICY order_items_tracking_public

ON public.order_items

FOR SELECT

TO anon

USING (

    EXISTS (

        SELECT 1

        FROM public.orders o

        WHERE o.id = order_items.order_id

    )

);

-- ============================================================================
-- END
-- ============================================================================