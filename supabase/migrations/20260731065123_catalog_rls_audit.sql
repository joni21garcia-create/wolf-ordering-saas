-- ============================================================================
-- Wolf Ordering
-- Security Policies
-- File: 04-categories.sql
--
-- Tabla:
--   public.categories
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena las categorías del menú de cada restaurante.
--
-- Los visitantes pueden consultar únicamente las categorías activas de
-- restaurantes activos y no suspendidos.
--
-- Los usuarios autenticados solo pueden acceder a las categorías de su propio
-- restaurante.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
--   • Categorías activas de restaurantes activos.
--
-- SELECT
--   • can_view_catalog()
--
-- INSERT
--   • can_manage_catalog()
--
-- UPDATE
--   • can_manage_catalog()
--
-- DELETE
--   • Sin política.
--     Las categorías deben desactivarse mediante el campo "active".
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_catalog()
-- public.can_manage_catalog()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

ALTER TABLE public.categories
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS categories_public_select
ON public.categories;

DROP POLICY IF EXISTS categories_select
ON public.categories;

DROP POLICY IF EXISTS categories_insert
ON public.categories;

DROP POLICY IF EXISTS categories_update
ON public.categories;

DROP POLICY IF EXISTS categories_delete
ON public.categories;

-- ============================================================================
-- SELECT (PUBLIC)
--
-- Permite consultar únicamente las categorías activas pertenecientes a
-- restaurantes activos y no suspendidos.
-- ============================================================================

CREATE POLICY categories_public_select

ON public.categories

FOR SELECT

TO anon

USING (

    active = true

    AND EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )

);

-- ============================================================================
-- SELECT
--
-- Permite consultar únicamente las categorías pertenecientes al restaurante
-- del usuario autenticado.
-- ============================================================================

CREATE POLICY categories_select

ON public.categories

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_view_catalog()

);

-- ============================================================================
-- INSERT
--
-- Permite crear categorías únicamente dentro del restaurante del usuario
-- autenticado y solo a quienes administran el catálogo.
-- ============================================================================

CREATE POLICY categories_insert

ON public.categories

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
--
-- Permite modificar categorías únicamente dentro del restaurante del usuario
-- autenticado y solo a quienes administran el catálogo.
-- ============================================================================

CREATE POLICY categories_update

ON public.categories

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

)

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación al no existir una política
-- que la permita.
--
-- Las categorías deben desactivarse utilizando el campo:
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
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena los productos pertenecientes al catálogo de cada restaurante.
--
-- Los visitantes pueden consultar únicamente los productos disponibles de
-- restaurantes activos y no suspendidos.
--
-- Los usuarios autenticados solo pueden acceder a los productos de su propio
-- restaurante.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
--   • Productos disponibles de restaurantes activos.
--
-- SELECT
--   • can_view_catalog()
--
-- INSERT
--   • can_manage_catalog()
--
-- UPDATE
--   • can_manage_catalog()
--
-- DELETE
--   • Sin política.
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
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

ALTER TABLE public.products
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS products_public_select
ON public.products;

DROP POLICY IF EXISTS products_select
ON public.products;

DROP POLICY IF EXISTS products_insert
ON public.products;

DROP POLICY IF EXISTS products_update
ON public.products;

DROP POLICY IF EXISTS products_delete
ON public.products;

-- ============================================================================
-- SELECT (PUBLIC)
-- ============================================================================

CREATE POLICY products_public_select

ON public.products

FOR SELECT

TO anon

USING (

    available = true

    AND EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )

);

-- ============================================================================
-- SELECT
-- ============================================================================

CREATE POLICY products_select

ON public.products

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY products_insert

ON public.products

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY products_update

ON public.products

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

)

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
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
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena las imágenes de la galería pertenecientes a cada restaurante.
--
-- Los visitantes pueden consultar únicamente las imágenes activas de
-- restaurantes activos y no suspendidos.
--
-- Los usuarios autenticados solo pueden acceder a las imágenes de su propio
-- restaurante.
--
-- Permisos
-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
--   • Imágenes activas de restaurantes activos.
--
-- SELECT
--   • can_view_catalog()
--
-- INSERT
--   • can_manage_catalog()
--
-- UPDATE
--   • can_manage_catalog()
--
-- DELETE
--   • Sin política.
--     Las imágenes deben desactivarse utilizando el campo "active".
--
-- Dependencias
-- ----------------------------------------------------------------------------
-- public.belongs_to_restaurant(uuid)
-- public.can_view_catalog()
-- public.can_manage_catalog()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

ALTER TABLE public.restaurant_gallery
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS gallery_public_select
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_select
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_insert
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_update
ON public.restaurant_gallery;

DROP POLICY IF EXISTS gallery_delete
ON public.restaurant_gallery;

-- ============================================================================
-- SELECT (PUBLIC)
-- ============================================================================

CREATE POLICY gallery_public_select

ON public.restaurant_gallery

FOR SELECT

TO anon

USING (

    active = true

    AND EXISTS (
        SELECT 1
        FROM public.restaurants r
        WHERE
            r.id = restaurant_id
            AND r.active = true
            AND r.suspended = false
    )

);

-- ============================================================================
-- SELECT
-- ============================================================================

CREATE POLICY gallery_select

ON public.restaurant_gallery

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY gallery_insert

ON public.restaurant_gallery

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY gallery_update

ON public.restaurant_gallery

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

)

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)

    AND public.can_manage_catalog()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
--
-- Para ocultar una imagen utilizar:
--
--     active = false
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
-- Descripción
-- ----------------------------------------------------------------------------
-- Almacena los productos pertenecientes a cada pedido.
--
-- Los permisos se determinan a través del pedido asociado.
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
-- public.belongs_to_order(uuid)
-- public.can_view_orders()
-- public.can_manage_orders()
--
-- Requisitos
-- ----------------------------------------------------------------------------
-- • 01-functions.sql
-- • 02-enable-rls.sql
--
-- ============================================================================

ALTER TABLE public.order_items
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS order_items_select
ON public.order_items;

DROP POLICY IF EXISTS order_items_insert
ON public.order_items;

DROP POLICY IF EXISTS order_items_update
ON public.order_items;

DROP POLICY IF EXISTS order_items_delete
ON public.order_items;

-- ============================================================================
-- SELECT
-- ============================================================================

CREATE POLICY order_items_select

ON public.order_items

FOR SELECT

TO authenticated

USING (

    public.belongs_to_order(order_id)

    AND public.can_view_orders()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY order_items_insert

ON public.order_items

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_order(order_id)

    AND public.can_manage_orders()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY order_items_update

ON public.order_items

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_order(order_id)

    AND public.can_manage_orders()

)

WITH CHECK (

    public.belongs_to_order(order_id)

    AND public.can_manage_orders()

);

-- ============================================================================
-- NOTA
-- ----------------------------------------------------------------------------
-- No existe política DELETE.
--
-- PostgreSQL deniega automáticamente esta operación.
--
-- Los detalles del pedido forman parte del historial operativo y no deben
-- eliminarse.
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