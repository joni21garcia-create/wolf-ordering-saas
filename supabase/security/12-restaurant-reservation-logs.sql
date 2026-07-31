-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 12-restaurant-reservation-logs.sql
--
-- Tabla:
--   public.restaurant_reservation_logs
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena el historial de eventos y cambios realizados sobre las
-- reservaciones de cada restaurante.
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

drop policy if exists restaurant_reservation_logs_select
on public.restaurant_reservation_logs;

drop policy if exists restaurant_reservation_logs_insert
on public.restaurant_reservation_logs;

drop policy if exists restaurant_reservation_logs_update
on public.restaurant_reservation_logs;

drop policy if exists restaurant_reservation_logs_delete
on public.restaurant_reservation_logs;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_reservation_logs_select

on public.restaurant_reservation_logs

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_reservations()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_reservation_logs_insert

on public.restaurant_reservation_logs

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_reservation_logs_update

on public.restaurant_reservation_logs

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
-- Los registros representan una bitácora (audit log) y forman parte del
-- historial permanente del sistema.
--
-- ============================================================================