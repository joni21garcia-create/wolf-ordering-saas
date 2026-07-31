-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 11-restaurant-reservation-blocks.sql
--
-- Tabla:
--   public.restaurant_reservation_blocks
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena los bloqueos de disponibilidad para las reservaciones de cada
-- restaurante.
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

drop policy if exists restaurant_reservation_blocks_select
on public.restaurant_reservation_blocks;

drop policy if exists restaurant_reservation_blocks_insert
on public.restaurant_reservation_blocks;

drop policy if exists restaurant_reservation_blocks_update
on public.restaurant_reservation_blocks;

drop policy if exists restaurant_reservation_blocks_delete
on public.restaurant_reservation_blocks;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_reservation_blocks_select

on public.restaurant_reservation_blocks

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_reservations()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_reservation_blocks_insert

on public.restaurant_reservation_blocks

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_reservation_blocks_update

on public.restaurant_reservation_blocks

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
-- Los bloqueos forman parte de la planificación operativa del restaurante y
-- deben conservarse como historial.
--
-- ============================================================================