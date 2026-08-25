-- ============================================================================
-- WOLF ORDERING
-- USUARIOS Y ROLES
--
-- REGLAS:
--
-- SUPER ADMIN:
--   Acceso absoluto.
--   Puede ver, crear, modificar y eliminar usuarios y roles
--   de cualquier restaurante.
--
-- OWNER / MANAGER:
--   Pueden gestionar usuarios únicamente de su restaurante.
--
-- OTROS ROLES:
--   No pueden gestionar usuarios salvo que posteriormente
--   se les otorgue explícitamente un permiso.
-- ============================================================================


-- ============================================================================
-- RESTAURANT ROLES
-- ============================================================================

DROP POLICY IF EXISTS restaurant_roles_select
ON public.restaurant_roles;

DROP POLICY IF EXISTS restaurant_roles_insert
ON public.restaurant_roles;

DROP POLICY IF EXISTS restaurant_roles_update
ON public.restaurant_roles;

DROP POLICY IF EXISTS restaurant_roles_delete
ON public.restaurant_roles;


-- ---------------------------------------------------------------------------
-- SELECT
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_roles_select
ON public.restaurant_roles
FOR SELECT
TO authenticated
USING (
    public.is_super_admin()
    OR public.belongs_to_restaurant(restaurant_id)
);


-- ---------------------------------------------------------------------------
-- INSERT
--
-- Super Admin:
--   cualquier restaurante.
--
-- Owner / Manager:
--   solamente su restaurante.
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_roles_insert
ON public.restaurant_roles
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
);


-- ---------------------------------------------------------------------------
-- UPDATE
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_roles_update
ON public.restaurant_roles
FOR UPDATE
TO authenticated
USING (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
)
WITH CHECK (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
);


-- ---------------------------------------------------------------------------
-- DELETE
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_roles_delete
ON public.restaurant_roles
FOR DELETE
TO authenticated
USING (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
);


-- ============================================================================
-- RESTAURANT USERS
-- ============================================================================

DROP POLICY IF EXISTS restaurant_users_select
ON public.restaurant_users;

DROP POLICY IF EXISTS restaurant_users_insert
ON public.restaurant_users;

DROP POLICY IF EXISTS restaurant_users_update
ON public.restaurant_users;

DROP POLICY IF EXISTS restaurant_users_delete
ON public.restaurant_users;


-- ---------------------------------------------------------------------------
-- SELECT
--
-- Super Admin:
--   todos los restaurantes.
--
-- Owner / Manager / usuarios autorizados:
--   su restaurante.
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_users_select
ON public.restaurant_users
FOR SELECT
TO authenticated
USING (
    public.is_super_admin()
    OR public.belongs_to_restaurant(restaurant_id)
);


-- ---------------------------------------------------------------------------
-- INSERT
--
-- Super Admin:
--   cualquier restaurante.
--
-- Owner / Manager:
--   usuarios de su restaurante.
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_users_insert
ON public.restaurant_users
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
);


-- ---------------------------------------------------------------------------
-- UPDATE
--
-- Esto permite al Super Admin modificar ABSOLUTAMENTE cualquier usuario.
--
-- Owner / Manager:
--   solamente usuarios de su restaurante.
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_users_update
ON public.restaurant_users
FOR UPDATE
TO authenticated
USING (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
)
WITH CHECK (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
);


-- ---------------------------------------------------------------------------
-- DELETE
-- ---------------------------------------------------------------------------

CREATE POLICY restaurant_users_delete
ON public.restaurant_users
FOR DELETE
TO authenticated
USING (
    public.is_super_admin()
    OR (
        restaurant_id = public.current_restaurant_id()
        AND (
            public.is_owner()
            OR public.is_manager()
        )
    )
);