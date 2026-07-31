-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 13-restaurant-reservation-reminders.sql
--
-- Tabla:
--   public.restaurant_reservation_reminders
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena la configuración y el historial de recordatorios asociados a las
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

drop policy if exists restaurant_reservation_reminders_select
on public.restaurant_reservation_reminders;

drop policy if exists restaurant_reservation_reminders_insert
on public.restaurant_reservation_reminders;

drop policy if exists restaurant_reservation_reminders_update
on public.restaurant_reservation_reminders;

drop policy if exists restaurant_reservation_reminders_delete
on public.restaurant_reservation_reminders;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_reservation_reminders_select

on public.restaurant_reservation_reminders

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_reservations()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_reservation_reminders_insert

on public.restaurant_reservation_reminders

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_reservation_reminders_update

on public.restaurant_reservation_reminders

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
-- Los recordatorios forman parte del historial operativo y deben conservarse.
--
-- ============================================================================