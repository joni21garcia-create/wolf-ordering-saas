-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 09-restaurant-reservations.sql
--
-- Tabla:
--   public.restaurant_reservations
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena las reservaciones de cada restaurante.
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
--   • can_view_reservations()
--
-- INSERT
--   • can_manage_reservations()
--
-- UPDATE
--   • can_manage_reservations()
--
-- DELETE
--   • Sin política.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_reservations()
-- public.can_manage_reservations()
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

drop policy if exists restaurant_reservations_select
on public.restaurant_reservations;

drop policy if exists restaurant_reservations_insert
on public.restaurant_reservations;

drop policy if exists restaurant_reservations_update
on public.restaurant_reservations;

drop policy if exists restaurant_reservations_delete
on public.restaurant_reservations;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_reservations_select

on public.restaurant_reservations

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_reservations()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_reservations_insert

on public.restaurant_reservations

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_reservations_update

on public.restaurant_reservations

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

)

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
--
-- Las reservaciones forman parte del historial operativo del restaurante y no
-- deben eliminarse.
--
-- ============================================================================