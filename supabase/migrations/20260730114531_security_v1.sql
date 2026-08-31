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
-- 1. current_restaurant_id()
-- 2. current_restaurant_user_id()
-- 3. current_restaurant_role()

-- 4. is_restaurant_user()
-- 5. has_role(text)

-- 6. is_super_admin()
-- 7. is_owner()
-- 8. is_manager()
-- 9. is_cashier()
-- 10. is_kitchen()
-- 11. is_marketing()

-- 12. belongs_to_restaurant(uuid)
-- 13. belongs_to_order(uuid)
-- 14. belongs_to_reservation(uuid)

-- 15. can_view_catalog()
-- 16. can_manage_catalog()

-- 17. can_view_orders()
-- 18. can_manage_orders()

-- 19. can_view_reservations()
-- 20. can_manage_reservations()

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
-- Indica si el usuario autenticado pertenece a algÃºn restaurante.
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
-- Verifica si el usuario autenticado posee un rol especÃ­fico.
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

    select restaurant_uuid = public.current_restaurant_id();

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

-- ============================================================================
-- Wolf Ordering
-- Archivo : 02-enable-rls.sql
-- Proyecto: Wolf Ordering
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Habilita Row Level Security (RLS) para todas las tablas multi-tenant
-- del sistema.
--
-- Este archivo Ãºnicamente activa RLS.
--
-- No contiene polÃ­ticas.
-- Las polÃ­ticas se implementan en los archivos posteriores.
--
-- ============================================================================

-- ============================================================================
-- Restaurants
-- ============================================================================

ALTER TABLE restaurants
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CatÃ¡logo
-- ============================================================================

ALTER TABLE categories
ENABLE ROW LEVEL SECURITY;

ALTER TABLE products
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_gallery
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_hero_slides
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_services
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Usuarios
-- ============================================================================

ALTER TABLE restaurant_users
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_roles
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Pedidos
-- ============================================================================

ALTER TABLE orders
ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_items
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Mesas
-- ============================================================================

ALTER TABLE restaurant_tables
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_table_assignments
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Reservaciones
-- ============================================================================

ALTER TABLE restaurant_reservations
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_blocks
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_logs
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_reminders
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_waitlist
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ConfiguraciÃ³n
-- ============================================================================

ALTER TABLE restaurant_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_theme_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_pwa_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_admin_pwa_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_delivery_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE schedule_settings
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Notificaciones
-- ============================================================================

ALTER TABLE device_tokens
ENABLE ROW LEVEL SECURITY;

ALTER TABLE push_subscriptions
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_notification_queue
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Favoritos
-- ============================================================================

ALTER TABLE restaurant_favorites
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Pagos
-- ============================================================================

ALTER TABLE restaurant_payment_qrs
ENABLE ROW LEVEL SECURITY;

ALTER TABLE liquidations
ENABLE ROW LEVEL SECURITY;

ALTER TABLE wolf_invoices
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Legal
-- ============================================================================

ALTER TABLE restaurant_legal_acceptance
ENABLE ROW LEVEL SECURITY;

ALTER TABLE legal_events
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Tablas excluidas
-- ----------------------------------------------------------------------------
-- Estas tablas utilizan un modelo de seguridad diferente o son
-- administradas exclusivamente por Wolf.
--
-- role_modules
-- legal_documents
-- manager_pwa_settings
-- system_modules
-- tables
-- ============================================================================

-- ============================================================================
-- Fin del archivo
-- ----------------------------------------------------------------------------
-- Total de tablas con RLS habilitado: 32
--
-- Las polÃ­ticas Row Level Security se implementarÃ¡n en:
--
-- 03-restaurants.sql
-- 04-restaurant_users.sql
-- 05-catalog.sql
-- 06-orders.sql
-- 07-reservations.sql
-- 08-settings.sql
-- 09-notifications.sql
-- 10-payments.sql
-- 11-legal.sql
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 03-restaurants.sql
--
-- Tabla:
--   public.restaurants
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Esta tabla representa el tenant principal del sistema.
--
-- Los restaurantes son creados y administrados exclusivamente por Wolf.
--
-- Los usuarios autenticados Ãºnicamente pueden consultar y, dependiendo de su
-- rol, modificar el restaurante al que pertenecen.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT
--   â€¢ Todos los usuarios pertenecientes al restaurante.
--
-- UPDATE
--   â€¢ super-user
--   â€¢ owner
--   â€¢ manager
--
-- INSERT
--   â€¢ Denegado (sin polÃ­tica).
--
-- DELETE
--   â€¢ Denegado (sin polÃ­tica).
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
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists restaurants_select
on public.restaurants;

drop policy if exists restaurants_update
on public.restaurants;

drop policy if exists restaurants_insert
on public.restaurants;

drop policy if exists restaurants_delete
on public.restaurants;

-- ============================================================================
-- SELECT
--
-- Todo usuario autenticado perteneciente al restaurante puede consultar
-- Ãºnicamente la informaciÃ³n de su restaurante.
-- ============================================================================

create policy restaurants_select

on public.restaurants

for select

to authenticated

using (

    public.belongs_to_restaurant(id)

);

-- ============================================================================
-- UPDATE
--
-- Solamente los siguientes roles pueden modificar la informaciÃ³n del
-- restaurante al que pertenecen:
--
-- â€¢ super-user
-- â€¢ owner
-- â€¢ manager
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
-- No existen polÃ­ticas para INSERT ni DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente estas operaciones cuando RLS estÃ¡
-- habilitado y no existe una polÃ­tica que las permita.
--
-- Esto mantiene el archivo mÃ¡s limpio y sigue el principio de mÃ­nimo privilegio.
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 04-categories.sql
--
-- Tabla:
--   public.categories
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Almacena las categorÃ­as del menú de cada restaurante.
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
--   â€¢ can_view_catalog()
--
-- INSERT
--   â€¢ can_manage_catalog()
--
-- UPDATE
--   â€¢ can_manage_catalog()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--     Las categorÃ­as deben desactivarse mediante el campo "active".
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_catalog()
-- public.can_manage_catalog()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists categories_select
on public.categories;

drop policy if exists categories_insert
on public.categories;

drop policy if exists categories_update
on public.categories;

drop policy if exists categories_delete
on public.categories;

-- ============================================================================
-- SELECT
--
-- Permite consultar Ãºnicamente las categorÃ­as pertenecientes al restaurante
-- del usuario autenticado.
-- ============================================================================

create policy categories_select

on public.categories

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_catalog()

);

-- ============================================================================
-- INSERT
--
-- Permite crear categorÃ­as Ãºnicamente dentro del restaurante del usuario
-- autenticado y solo a quienes administran el catÃ¡logo.
-- ============================================================================

create policy categories_insert

on public.categories

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
--
-- Permite modificar categorÃ­as Ãºnicamente dentro del restaurante del usuario
-- autenticado y solo a quienes administran el catÃ¡logo.
-- ============================================================================

create policy categories_update

on public.categories

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

)

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n al no existir una polÃ­tica
-- que la permita.
--
-- Las categorÃ­as deben desactivarse utilizando el campo:
--
--   active = false
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 05-products.sql
--
-- Tabla:
--   public.products
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Almacena los productos pertenecientes al catÃ¡logo de cada restaurante.
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
--   â€¢ can_view_catalog()
--
-- INSERT
--   â€¢ can_manage_catalog()
--
-- UPDATE
--   â€¢ can_manage_catalog()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--     Los productos deben deshabilitarse mediante el campo "available".
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_catalog()
-- public.can_manage_catalog()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists products_select
on public.products;

drop policy if exists products_insert
on public.products;

drop policy if exists products_update
on public.products;

drop policy if exists products_delete
on public.products;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy products_select

on public.products

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy products_insert

on public.products

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy products_update

on public.products

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

)

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Para retirar un producto del menú utilizar:
--
--     available = false
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 06-gallery.sql
--
-- Tabla:
--   public.restaurant_gallery
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Almacena las imÃ¡genes de la galerÃ­a pertenecientes a cada restaurante.
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
--   â€¢ can_view_catalog()
--
-- INSERT
--   â€¢ can_manage_catalog()
--
-- UPDATE
--   â€¢ can_manage_catalog()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--     Las imÃ¡genes deben desactivarse utilizando el campo "active".
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_catalog()
-- public.can_manage_catalog()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists gallery_select
on public.restaurant_gallery;

drop policy if exists gallery_insert
on public.restaurant_gallery;

drop policy if exists gallery_update
on public.restaurant_gallery;

drop policy if exists gallery_delete
on public.restaurant_gallery;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy gallery_select

on public.restaurant_gallery

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy gallery_insert

on public.restaurant_gallery

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy gallery_update

on public.restaurant_gallery

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

)

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Para ocultar una imagen utilizar:
--
--     active = false
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 07-orders.sql
--
-- Tabla:
--   public.orders
--
-- DescripciÃ³n
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
--   â€¢ can_view_orders()
--
-- INSERT
--   â€¢ can_manage_orders()
--
-- UPDATE
--   â€¢ can_manage_orders()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_orders()
-- public.can_manage_orders()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
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
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Los pedidos forman parte del historial operativo del restaurante y no deben
-- eliminarse.
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 08-order-items.sql
--
-- Tabla:
--   public.order_items
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Almacena los productos pertenecientes a cada pedido.
--
-- Los permisos se determinan a travÃ©s del pedido asociado.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT
--   â€¢ can_view_orders()
--
-- INSERT
--   â€¢ can_manage_orders()
--
-- UPDATE
--   â€¢ can_manage_orders()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_order(uuid)
-- public.can_view_orders()
-- public.can_manage_orders()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists order_items_select
on public.order_items;

drop policy if exists order_items_insert
on public.order_items;

drop policy if exists order_items_update
on public.order_items;

drop policy if exists order_items_delete
on public.order_items;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy order_items_select

on public.order_items

for select

to authenticated

using (

    public.belongs_to_order(order_id)

    and public.can_view_orders()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy order_items_insert

on public.order_items

for insert

to authenticated

with check (

    public.belongs_to_order(order_id)

    and public.can_manage_orders()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy order_items_update

on public.order_items

for update

to authenticated

using (

    public.belongs_to_order(order_id)

    and public.can_manage_orders()

)

with check (

    public.belongs_to_order(order_id)

    and public.can_manage_orders()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Los detalles del pedido forman parte del historial operativo y no deben
-- eliminarse.
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 09-restaurant-reservations.sql
--
-- Tabla:
--   public.restaurant_reservations
--
-- DescripciÃ³n
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
--   â€¢ can_view_reservations()
--
-- INSERT
--   â€¢ can_manage_reservations()
--
-- UPDATE
--   â€¢ can_manage_reservations()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_reservations()
-- public.can_manage_reservations()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
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
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Las reservaciones forman parte del historial operativo del restaurante y no
-- deben eliminarse.
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 10-restaurant-reservation-settings.sql
--
-- Tabla:
--   public.restaurant_reservation_settings
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- ConfiguraciÃ³n del sistema de reservaciones de cada restaurante.
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
--   â€¢ can_view_reservations()
--
-- INSERT
--   â€¢ can_manage_reservations()
--
-- UPDATE
--   â€¢ can_manage_reservations()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_reservations()
-- public.can_manage_reservations()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists restaurant_reservation_settings_select
on public.restaurant_reservation_settings;

drop policy if exists restaurant_reservation_settings_insert
on public.restaurant_reservation_settings;

drop policy if exists restaurant_reservation_settings_update
on public.restaurant_reservation_settings;

drop policy if exists restaurant_reservation_settings_delete
on public.restaurant_reservation_settings;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_reservation_settings_select

on public.restaurant_reservation_settings

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_view_reservations()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_reservation_settings_insert

on public.restaurant_reservation_settings

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)

    and public.can_manage_reservations()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_reservation_settings_update

on public.restaurant_reservation_settings

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
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Cada restaurante debe conservar su configuraciÃ³n de reservaciones.
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 11-restaurant-reservation-blocks.sql
--
-- Tabla:
--   public.restaurant_reservation_blocks
--
-- DescripciÃ³n
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
--   â€¢ can_view_reservations()
--
-- INSERT
--   â€¢ can_manage_reservations()
--
-- UPDATE
--   â€¢ can_manage_reservations()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_reservations()
-- public.can_manage_reservations()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
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
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Los bloqueos forman parte de la planificaciÃ³n operativa del restaurante y
-- deben conservarse como historial.
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 12-restaurant-reservation-logs.sql
--
-- Tabla:
--   public.restaurant_reservation_logs
--
-- DescripciÃ³n
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
--   â€¢ can_view_reservations()
--
-- INSERT
--   â€¢ can_manage_reservations()
--
-- UPDATE
--   â€¢ can_manage_reservations()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_reservations()
-- public.can_manage_reservations()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
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
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Los registros representan una bitÃ¡cora (audit log) y forman parte del
-- historial permanente del sistema.
--
-- ============================================================================

-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 13-restaurant-reservation-reminders.sql
--
-- Tabla:
--   public.restaurant_reservation_reminders
--
-- DescripciÃ³n
-- ----------------------------------------------------------------------------
-- Almacena la configuraciÃ³n y el historial de recordatorios asociados a las
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
--   â€¢ can_view_reservations()
--
-- INSERT
--   â€¢ can_manage_reservations()
--
-- UPDATE
--   â€¢ can_manage_reservations()
--
-- DELETE
--   â€¢ Sin polÃ­tica.
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_reservations()
-- public.can_manage_reservations()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- â€¢ 01-functions.sql
-- â€¢ 02-enable-rls.sql
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
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
-- No existe polÃ­tica DELETE.
--
-- PostgreSQL deniega automÃ¡ticamente esta operaciÃ³n.
--
-- Los recordatorios forman parte del historial operativo y deben conservarse.
--
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists restaurant_roles_select
on public.restaurant_roles;

drop policy if exists restaurant_roles_insert
on public.restaurant_roles;

drop policy if exists restaurant_roles_update
on public.restaurant_roles;

drop policy if exists restaurant_roles_delete
on public.restaurant_roles;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_roles_select

on public.restaurant_roles

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_roles_insert

on public.restaurant_roles

for insert

to authenticated

with check (

    public.is_super_admin()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_roles_update

on public.restaurant_roles

for update

to authenticated

using (

    public.is_super_admin()

)

with check (

    public.is_super_admin()

);

-- ============================================================================
-- DELETE
-- ============================================================================

create policy restaurant_roles_delete

on public.restaurant_roles

for delete

to authenticated

using (

    public.is_super_admin()

);
-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists restaurant_users_select
on public.restaurant_users;

drop policy if exists restaurant_users_insert
on public.restaurant_users;

drop policy if exists restaurant_users_update
on public.restaurant_users;

drop policy if exists restaurant_users_delete
on public.restaurant_users;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_users_select

on public.restaurant_users

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_users_insert

on public.restaurant_users

for insert

to authenticated

with check (

    public.is_super_admin()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_users_update

on public.restaurant_users

for update

to authenticated

using (

    public.is_super_admin()

)

with check (

    public.is_super_admin()

);

-- ============================================================================
-- DELETE
-- ============================================================================

create policy restaurant_users_delete

on public.restaurant_users

for delete

to authenticated

using (

    public.is_super_admin()

);

-- ============================================================================
-- TABLE: restaurant_settings
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists restaurant_settings_select
on public.restaurant_settings;

drop policy if exists restaurant_settings_insert
on public.restaurant_settings;

drop policy if exists restaurant_settings_update
on public.restaurant_settings;

drop policy if exists restaurant_settings_delete
on public.restaurant_settings;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_settings_select

on public.restaurant_settings

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_settings_insert

on public.restaurant_settings

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_settings_update

on public.restaurant_settings

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_catalog()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_catalog()

);

-- ============================================================================
-- DELETE
-- ============================================================================

-- No DELETE policy.
-- La configuraciÃ³n del restaurante no debe eliminarse.

-- ============================================================================
-- MODULE: PWA
-- ============================================================================

-- ============================================================================
-- TABLE: restaurant_pwa_settings
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar polÃ­ticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists restaurant_pwa_settings_select
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_insert
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_update
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_delete
on public.restaurant_pwa_settings;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

create policy restaurant_pwa_settings_select

on public.restaurant_pwa_settings

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_view_catalog()

);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

create policy restaurant_pwa_settings_insert

on public.restaurant_pwa_settings

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_catalog()

);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

create policy restaurant_pwa_settings_update

on public.restaurant_pwa_settings

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_catalog()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_catalog()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

-- No DELETE policy.
-- La configuraciÃ³n PWA del restaurante no debe eliminarse.



-- ============================================================================
-- TABLE: manager_pwa_settings
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar polÃ­ticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists manager_pwa_settings_select
on public.manager_pwa_settings;

drop policy if exists manager_pwa_settings_insert
on public.manager_pwa_settings;

drop policy if exists manager_pwa_settings_update
on public.manager_pwa_settings;

drop policy if exists manager_pwa_settings_delete
on public.manager_pwa_settings;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

create policy manager_pwa_settings_select

on public.manager_pwa_settings

for select

to authenticated

using (

    public.is_super_admin()

);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

create policy manager_pwa_settings_insert

on public.manager_pwa_settings

for insert

to authenticated

with check (

    public.is_super_admin()

);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

create policy manager_pwa_settings_update

on public.manager_pwa_settings

for update

to authenticated

using (

    public.is_super_admin()

)

with check (

    public.is_super_admin()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

create policy manager_pwa_settings_delete

on public.manager_pwa_settings

for delete

to authenticated

using (

    public.is_super_admin()

);

-- ============================================================================
-- MODULE: NOTIFICATIONS
-- ============================================================================

-- ============================================================================
-- TABLE: push_subscriptions
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar polÃ­ticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists push_subscriptions_select
on public.push_subscriptions;

drop policy if exists push_subscriptions_insert
on public.push_subscriptions;

drop policy if exists push_subscriptions_update
on public.push_subscriptions;

drop policy if exists push_subscriptions_delete
on public.push_subscriptions;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

create policy push_subscriptions_select

on public.push_subscriptions

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_view_orders()

);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

create policy push_subscriptions_insert

on public.push_subscriptions

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

create policy push_subscriptions_update

on public.push_subscriptions

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

-- No DELETE policy.



-- ============================================================================
-- TABLE: device_tokens
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar polÃ­ticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists device_tokens_select
on public.device_tokens;

drop policy if exists device_tokens_insert
on public.device_tokens;

drop policy if exists device_tokens_update
on public.device_tokens;

drop policy if exists device_tokens_delete
on public.device_tokens;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

create policy device_tokens_select

on public.device_tokens

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_view_orders()

);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

create policy device_tokens_insert

on public.device_tokens

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

create policy device_tokens_update

on public.device_tokens

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

-- No DELETE policy.

-- ============================================================================
-- TABLE: restaurant_favorites
-- ============================================================================

-- ============================================================================
-- Eliminar polÃ­ticas existentes
-- ============================================================================

drop policy if exists restaurant_favorites_select
on public.restaurant_favorites;

drop policy if exists restaurant_favorites_insert
on public.restaurant_favorites;

drop policy if exists restaurant_favorites_update
on public.restaurant_favorites;

drop policy if exists restaurant_favorites_delete
on public.restaurant_favorites;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_favorites_select

on public.restaurant_favorites

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    auth.uid() = auth_user_id

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_favorites_insert

on public.restaurant_favorites

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    auth.uid() = auth_user_id

);

-- ============================================================================
-- DELETE
-- ============================================================================

create policy restaurant_favorites_delete

on public.restaurant_favorites

for delete

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    auth.uid() = auth_user_id

);

-- ============================================================================
-- UPDATE
-- ============================================================================

-- No UPDATE policy.
-- Los favoritos se crean o se eliminan.

-- ============================================================================
-- restaurant_admin_pwa_settings
-- ============================================================================

ALTER TABLE public.restaurant_admin_pwa_settings
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_admin_pwa_settings_select
ON public.restaurant_admin_pwa_settings;

CREATE POLICY restaurant_admin_pwa_settings_select
ON public.restaurant_admin_pwa_settings
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_admin_pwa_settings_insert
ON public.restaurant_admin_pwa_settings;

CREATE POLICY restaurant_admin_pwa_settings_insert
ON public.restaurant_admin_pwa_settings
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_admin_pwa_settings_update
ON public.restaurant_admin_pwa_settings;

CREATE POLICY restaurant_admin_pwa_settings_update
ON public.restaurant_admin_pwa_settings
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);
-- ============================================================================
-- restaurant_delivery_settings
-- ============================================================================

ALTER TABLE public.restaurant_delivery_settings
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_delivery_settings_select
ON public.restaurant_delivery_settings;

CREATE POLICY restaurant_delivery_settings_select
ON public.restaurant_delivery_settings
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_delivery_settings_insert
ON public.restaurant_delivery_settings;

CREATE POLICY restaurant_delivery_settings_insert
ON public.restaurant_delivery_settings
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_delivery_settings_update
ON public.restaurant_delivery_settings;

CREATE POLICY restaurant_delivery_settings_update
ON public.restaurant_delivery_settings
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);
-- ============================================================================
-- restaurant_hero_slides
-- ============================================================================

ALTER TABLE public.restaurant_hero_slides
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_hero_slides_select
ON public.restaurant_hero_slides;

CREATE POLICY restaurant_hero_slides_select
ON public.restaurant_hero_slides
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_hero_slides_insert
ON public.restaurant_hero_slides;

CREATE POLICY restaurant_hero_slides_insert
ON public.restaurant_hero_slides
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_hero_slides_update
ON public.restaurant_hero_slides;

CREATE POLICY restaurant_hero_slides_update
ON public.restaurant_hero_slides
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);
-- ============================================================================
-- restaurant_payment_qrs
-- ============================================================================

ALTER TABLE public.restaurant_payment_qrs
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_payment_qrs_select
ON public.restaurant_payment_qrs;

CREATE POLICY restaurant_payment_qrs_select
ON public.restaurant_payment_qrs
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_payment_qrs_insert
ON public.restaurant_payment_qrs;

CREATE POLICY restaurant_payment_qrs_insert
ON public.restaurant_payment_qrs
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_payment_qrs_update
ON public.restaurant_payment_qrs;

CREATE POLICY restaurant_payment_qrs_update
ON public.restaurant_payment_qrs
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);
-- ============================================================================
-- restaurant_services
-- ============================================================================

ALTER TABLE public.restaurant_services
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_services_select
ON public.restaurant_services;

CREATE POLICY restaurant_services_select
ON public.restaurant_services
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_services_insert
ON public.restaurant_services;

CREATE POLICY restaurant_services_insert
ON public.restaurant_services
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_services_update
ON public.restaurant_services;

CREATE POLICY restaurant_services_update
ON public.restaurant_services
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);
-- ============================================================================
-- restaurant_tables
-- ============================================================================

ALTER TABLE public.restaurant_tables
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_tables_select
ON public.restaurant_tables;

CREATE POLICY restaurant_tables_select
ON public.restaurant_tables
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_reservations()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_tables_insert
ON public.restaurant_tables;

CREATE POLICY restaurant_tables_insert
ON public.restaurant_tables
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_tables_update
ON public.restaurant_tables;

CREATE POLICY restaurant_tables_update
ON public.restaurant_tables
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
);
-- ============================================================================
-- restaurant_table_assignments
-- ============================================================================

ALTER TABLE public.restaurant_table_assignments
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_table_assignments_select
ON public.restaurant_table_assignments;

CREATE POLICY restaurant_table_assignments_select
ON public.restaurant_table_assignments
FOR SELECT
USING (
    public.belongs_to_reservation(reservation_id)
    AND public.can_view_reservations()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_table_assignments_insert
ON public.restaurant_table_assignments;

CREATE POLICY restaurant_table_assignments_insert
ON public.restaurant_table_assignments
FOR INSERT
WITH CHECK (
    public.belongs_to_reservation(reservation_id)
    AND public.can_manage_reservations()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_table_assignments_update
ON public.restaurant_table_assignments;

CREATE POLICY restaurant_table_assignments_update
ON public.restaurant_table_assignments
FOR UPDATE
USING (
    public.belongs_to_reservation(reservation_id)
    AND public.can_manage_reservations()
)
WITH CHECK (
    public.belongs_to_reservation(reservation_id)
    AND public.can_manage_reservations()
);
-- ============================================================================
-- restaurant_theme_settings
-- ============================================================================

ALTER TABLE public.restaurant_theme_settings
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_theme_settings_select
ON public.restaurant_theme_settings;

CREATE POLICY restaurant_theme_settings_select
ON public.restaurant_theme_settings
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_theme_settings_insert
ON public.restaurant_theme_settings;

CREATE POLICY restaurant_theme_settings_insert
ON public.restaurant_theme_settings
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_theme_settings_update
ON public.restaurant_theme_settings;

CREATE POLICY restaurant_theme_settings_update
ON public.restaurant_theme_settings
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);
-- ============================================================================
-- restaurant_notification_queue
-- ============================================================================

ALTER TABLE public.restaurant_notification_queue
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_notification_queue_select
ON public.restaurant_notification_queue;

CREATE POLICY restaurant_notification_queue_select
ON public.restaurant_notification_queue
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_reservations()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_notification_queue_insert
ON public.restaurant_notification_queue;

CREATE POLICY restaurant_notification_queue_insert
ON public.restaurant_notification_queue
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_notification_queue_update
ON public.restaurant_notification_queue;

CREATE POLICY restaurant_notification_queue_update
ON public.restaurant_notification_queue
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
);
-- ============================================================================
-- restaurant_waitlist
-- ============================================================================

ALTER TABLE public.restaurant_waitlist
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_waitlist_select
ON public.restaurant_waitlist;

CREATE POLICY restaurant_waitlist_select
ON public.restaurant_waitlist
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_reservations()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_waitlist_insert
ON public.restaurant_waitlist;

CREATE POLICY restaurant_waitlist_insert
ON public.restaurant_waitlist
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_waitlist_update
ON public.restaurant_waitlist;

CREATE POLICY restaurant_waitlist_update
ON public.restaurant_waitlist
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_reservations()
);
-- ============================================================================
-- schedule_settings
-- ============================================================================

ALTER TABLE public.schedule_settings
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS schedule_settings_select
ON public.schedule_settings;

CREATE POLICY schedule_settings_select
ON public.schedule_settings
FOR SELECT
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_view_catalog()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS schedule_settings_insert
ON public.schedule_settings;

CREATE POLICY schedule_settings_insert
ON public.schedule_settings
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS schedule_settings_update
ON public.schedule_settings;

CREATE POLICY schedule_settings_update
ON public.schedule_settings
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.can_manage_catalog()
);

-- ============================================================================
-- legal_documents
-- ============================================================================

ALTER TABLE public.legal_documents
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_select
ON public.legal_documents;

CREATE POLICY legal_documents_select
ON public.legal_documents
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_insert
ON public.legal_documents;

CREATE POLICY legal_documents_insert
ON public.legal_documents
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_update
ON public.legal_documents;

CREATE POLICY legal_documents_update
ON public.legal_documents
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_delete
ON public.legal_documents;

CREATE POLICY legal_documents_delete
ON public.legal_documents
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- restaurant_legal_acceptance
-- ============================================================================

ALTER TABLE public.restaurant_legal_acceptance
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_select
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_select
ON public.restaurant_legal_acceptance
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        public.belongs_to_restaurant(restaurant_id)
        AND public.is_owner()
    )
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_insert
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_insert
ON public.restaurant_legal_acceptance
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.is_owner()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_update
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_update
ON public.restaurant_legal_acceptance
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.is_owner()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.is_owner()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_delete
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_delete
ON public.restaurant_legal_acceptance
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- legal_events
-- ============================================================================

ALTER TABLE public.legal_events
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_select
ON public.legal_events;

CREATE POLICY legal_events_select
ON public.legal_events
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_insert
ON public.legal_events;

CREATE POLICY legal_events_insert
ON public.legal_events
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_update
ON public.legal_events;

CREATE POLICY legal_events_update
ON public.legal_events
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_delete
ON public.legal_events;

CREATE POLICY legal_events_delete
ON public.legal_events
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- liquidations
-- ============================================================================

ALTER TABLE public.liquidations
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_select
ON public.liquidations;

CREATE POLICY liquidations_select
ON public.liquidations
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        public.belongs_to_restaurant(restaurant_id)
        AND public.is_owner()
    )
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_insert
ON public.liquidations;

CREATE POLICY liquidations_insert
ON public.liquidations
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_update
ON public.liquidations;

CREATE POLICY liquidations_update
ON public.liquidations
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_delete
ON public.liquidations;

CREATE POLICY liquidations_delete
ON public.liquidations
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- role_modules
-- ============================================================================

ALTER TABLE public.role_modules
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_select
ON public.role_modules;

CREATE POLICY role_modules_select
ON public.role_modules
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_insert
ON public.role_modules;

CREATE POLICY role_modules_insert
ON public.role_modules
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_update
ON public.role_modules;

CREATE POLICY role_modules_update
ON public.role_modules
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_delete
ON public.role_modules;

CREATE POLICY role_modules_delete
ON public.role_modules
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- system_modules
-- ============================================================================

ALTER TABLE public.system_modules
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_select
ON public.system_modules;

CREATE POLICY system_modules_select
ON public.system_modules
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_insert
ON public.system_modules;

CREATE POLICY system_modules_insert
ON public.system_modules
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_update
ON public.system_modules;

CREATE POLICY system_modules_update
ON public.system_modules
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_delete
ON public.system_modules;

CREATE POLICY system_modules_delete
ON public.system_modules
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- wolf_invoices
-- ============================================================================

ALTER TABLE public.wolf_invoices
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_select
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_select
ON public.wolf_invoices
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        public.belongs_to_restaurant(restaurant_id)
        AND public.is_owner()
    )
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_insert
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_insert
ON public.wolf_invoices
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_update
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_update
ON public.wolf_invoices
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_delete
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_delete
ON public.wolf_invoices
FOR DELETE
USING (
    public.is_super_admin()
);

