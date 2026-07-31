-- ============================================================================
-- Wolf Ordering
-- Permite acceso público al seguimiento de pedidos
-- ============================================================================

create or replace function public.can_view_order_tracking()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select true;

$$;