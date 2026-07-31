-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 07-orders.sql
--
-- Tabla:
--   public.orders
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena los pedidos realizados en cada restaurante.
--
-- Todas las operaciones quedan restringidas al restaurante del usuario
-- autenticado.
--
-- Los permisos se controlan mediante funciones reutilizables definidas en
-- 01-functions.sql.
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
-- public.belongs_to_restaurant(uuid)
-- public.can_view_orders()
-- public.can_manage_orders()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

drop policy if exists orders_select
on public.orders;

drop policy if exists orders_insert
on public.orders;

drop policy if exists orders_update
on public.orders;

drop policy if exists orders_delete
on public.orders;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy orders_select

on public.orders

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_orders()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy orders_insert

on public.orders

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_orders()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy orders_update

on public.orders

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_orders()

)

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_orders()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
--
-- Los pedidos forman parte del historial operativo del restaurante y no deben
-- eliminarse.
--
-- ============================================================================