-- ============================================================================
-- Wolf Ordering
-- Archivo : 01-functions.sql
-- Proyecto: Wolf Ordering
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Funciones auxiliares reutilizables para autenticación,
-- autorización y políticas Row Level Security (RLS).
--
-- Este archivo constituye la base de seguridad del proyecto
-- Wolf Ordering y centraliza toda la lógica de identificación
-- del usuario autenticado, restaurante y rol.
--
-- Todas las políticas RLS del proyecto deberán utilizar estas
-- funciones como punto único de acceso a la información del
-- usuario autenticado.
--
-- No definir políticas RLS en este archivo.
--
-- Convenciones
-- ----------------------------------------------------------------------------
-- • SECURITY DEFINER
-- • STABLE
-- • SET search_path = public
-- • Reutilizar funciones para evitar duplicación de lógica.
-- • No acceder directamente a restaurant_users desde las políticas
--   cuando exista una función equivalente.
--
-- Índice
-- ----------------------------------------------------------------------------
1. current_restaurant_id()
2. current_restaurant_user_id()
3. current_restaurant_role()

4. is_restaurant_user()
5. has_role(text)

6. is_super_admin()
7. is_owner()
8. is_manager()
9. is_cashier()
10. is_kitchen()
11. is_marketing()

12. belongs_to_restaurant(uuid)
13. belongs_to_order(uuid)
14. belongs_to_reservation(uuid)

15. can_view_catalog()
16. can_manage_catalog()

17. can_view_orders()
18. can_manage_orders()

19. can_view_reservations()
20. can_manage_reservations()

-- ============================================================================
-- Devuelve el restaurante asociado al usuario autenticado.
-- ============================================================================

create or replace function public.current_restaurant_id()

returns uuid

language sql

stable

security definer

set search_path = public

as $$

    select restaurant_id

    from restaurant_users

    where auth_user_id = auth.uid()
      and active = true

    limit 1;

$$;

-- ============================================================================
-- Devuelve el registro restaurant_users del usuario autenticado.
-- ============================================================================

create or replace function public.current_restaurant_user_id()

returns uuid

language sql

stable

security definer

set search_path = public

as $$

    select id

    from restaurant_users

    where auth_user_id = auth.uid()
      and active = true

    limit 1;

$$;

-- ============================================================================
-- Devuelve el role_id del usuario autenticado.
-- ============================================================================

create or replace function public.current_restaurant_role()

returns uuid

language sql

stable

security definer

set search_path = public

as $$

    select role_id

    from restaurant_users

    where auth_user_id = auth.uid()
      and active = true

    limit 1;

$$;

-- ============================================================================
-- Indica si el usuario autenticado pertenece a algún restaurante.
-- ============================================================================

create or replace function public.is_restaurant_user()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select exists (

        select 1

        from restaurant_users

        where auth_user_id = auth.uid()
          and active = true

    );

$$;
-- ============================================================================
-- Verifica si el usuario autenticado posee un rol específico.
-- ============================================================================
create or replace function public.has_role(role_code text)

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select exists (

        select 1
        from restaurant_users ru
        join restaurant_roles rr
          on rr.id = ru.role_id
        where ru.auth_user_id = auth.uid()
          and ru.active = true
          and lower(rr.code) = lower(role_code)

    );

$$;
-- ============================================================================
-- Indica si el usuario autenticado es Super Admin.
-- ============================================================================
create or replace function public.is_super_admin()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select public.has_role('super-user');

$$;
-- ============================================================================
-- Indica si el usuario autenticado es Owner.
-- ============================================================================
create or replace function public.is_owner()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select public.has_role('owner');

$$;
-- ============================================================================
-- Indica si el usuario autenticado es Manager.
-- ============================================================================
create or replace function public.is_manager()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select public.has_role('manager');

$$;
-- ============================================================================
-- Indica si el usuario autenticado es Cashier.
-- ============================================================================
create or replace function public.is_cashier()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select public.has_role('cashier');

$$;
-- ============================================================================
-- Indica si el usuario autenticado es Kitchen.
-- ============================================================================
create or replace function public.is_kitchen()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select public.has_role('kitchen');

$$;
-- ============================================================================
-- Indica si el usuario autenticado es Marketing.
-- ============================================================================
create or replace function public.is_marketing()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select public.has_role('marketing');

$$;
-- ============================================================================
-- Verifica si el usuario autenticado pertenece al restaurante indicado.
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
-- ============================================================================
-- CATALOGO
-- ============================================================================

create or replace function public.can_view_catalog()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        or public.is_owner()
        or public.is_manager()
        or public.is_marketing()
        or public.is_kitchen()
        or public.is_cashier();

$$;

-- ============================================================================

create or replace function public.can_manage_catalog()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        or public.is_owner()
        or public.is_manager()
        or public.is_marketing();

$$;
-- ============================================================================
-- PEDIDOS
-- ============================================================================

create or replace function public.can_view_orders()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        or public.is_owner()
        or public.is_manager()
        or public.is_cashier()
        or public.is_kitchen();

$$;

-- ============================================================================

create or replace function public.can_manage_orders()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        or public.is_owner()
        or public.is_manager()
        or public.is_cashier()
        or public.is_kitchen();

$$;
-- ============================================================================
-- ORDER ITEMS
-- ============================================================================

create or replace function public.belongs_to_order(
    p_order_id uuid
)

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select exists (

        select 1

        from public.orders o

        where o.id = p_order_id

          and public.belongs_to_restaurant(o.restaurant_id)

    );

$$;
-- ============================================================================
-- RESERVATIONS
-- ============================================================================

create or replace function public.can_view_reservations()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        or public.is_owner()
        or public.is_manager()
        or public.is_cashier();

$$;

-- ============================================================================

create or replace function public.can_manage_reservations()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select
        public.is_super_admin()
        or public.is_owner()
        or public.is_manager()
        or public.is_cashier();

$$;
-- ============================================================================
-- RESERVATION ITEMS
-- ============================================================================

create or replace function public.belongs_to_reservation(
    p_reservation_id uuid
)

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select exists (

        select 1

        from public.restaurant_reservations r

        where r.id = p_reservation_id
          and public.belongs_to_restaurant(r.restaurant_id)

    );

$$;
create or replace function public.can_view_order_tracking()

returns boolean

language sql

stable

security definer

set search_path = public

as $$

    select true;

$$;