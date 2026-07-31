-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 03-restaurants.sql
--
-- Tabla:
--   public.restaurants
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Esta tabla representa el tenant principal del sistema.
--
-- Los restaurantes son creados y administrados exclusivamente por Wolf.
--
-- Los usuarios autenticados únicamente pueden consultar y, dependiendo de su
-- rol, modificar el restaurante al que pertenecen.
--
-- Los visitantes (anon) únicamente pueden consultar restaurantes públicos
-- activos y no suspendidos.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT
--   • Super Admin: todos los restaurantes.
--   • Usuarios autenticados: su restaurante.
--   • Visitantes (anon): restaurantes activos y no suspendidos.
--
-- UPDATE
--   • super-user
--   • owner
--   • manager
--
-- INSERT
--   • Denegado (sin política).
--
-- DELETE
--   • Denegado (sin política).
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.is_super_admin()
-- public.is_owner()
-- public.is_manager()
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

drop policy if exists restaurants_select
on public.restaurants;

drop policy if exists restaurants_public_select
on public.restaurants;

drop policy if exists restaurants_update
on public.restaurants;

drop policy if exists restaurants_insert
on public.restaurants;

drop policy if exists restaurants_delete
on public.restaurants;


-- ============================================================================
-- SELECT (Usuarios autenticados)
-- ============================================================================

create policy restaurants_select

on public.restaurants

for select

to authenticated

using (

    public.is_super_admin()

    OR

    public.belongs_to_restaurant(id)

);


-- ============================================================================
-- SELECT (Sitio público)
-- ============================================================================

create policy restaurants_public_select

on public.restaurants

for select

to anon

using (

    active = true

    and suspended = false

);


-- ============================================================================
-- UPDATE
--
-- Solamente los siguientes roles pueden modificar la información del
-- restaurante al que pertenecen:
--
-- • super-user
-- • owner
-- • manager
-- ============================================================================

create policy restaurants_update

on public.restaurants

for update

to authenticated

using (

    public.belongs_to_restaurant(id)

    and (

        public.is_super_admin()

        or public.is_owner()

        or public.is_manager()

    )

)

with check (

    public.belongs_to_restaurant(id)

    and (

        public.is_super_admin()

        or public.is_owner()

        or public.is_manager()

    )

);


-- ============================================================================
-- Nota
-- ----------------------------------------------------------------------------
-- No existen políticas para INSERT ni DELETE.
--
-- PostgreSQL deniega automáticamente estas operaciones cuando RLS está
-- habilitado y no existe una política que las permita.
--
-- Esto mantiene el archivo más limpio y sigue el principio de mínimo privilegio.
-- ============================================================================