-- ============================================================================
-- Wolf Ordering
-- Migration
-- File: fix_super_admin_belongs_to_restaurant.sql
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Permite que el Super Admin tenga acceso a todos los restaurantes mediante
-- la función belongs_to_restaurant().
--
-- Esto hace que todas las políticas RLS que utilizan:
--
--     public.belongs_to_restaurant(...)
--
-- permitan automáticamente el acceso al Super Admin sin modificar cada
-- política individual.
-- ============================================================================

create or replace function public.belongs_to_restaurant(
    restaurant_uuid uuid
)

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        OR
        restaurant_uuid = public.current_restaurant_id();

$$;