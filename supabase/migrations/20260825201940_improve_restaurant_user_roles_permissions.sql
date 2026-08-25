-- ============================================================================
-- SUPER ADMIN: ACCESO GLOBAL A USUARIOS Y ROLES
-- ============================================================================
-- Regla:
--   super-user = sin restricciones por restaurante
--   demás usuarios = solamente su restaurante
-- ============================================================================


-- ============================================================================
-- RESTAURANT_ROLES
-- ============================================================================

DROP POLICY IF EXISTS restaurant_roles_select
ON public.restaurant_roles;

DROP POLICY IF EXISTS restaurant_roles_insert
ON public.restaurant_roles;

DROP POLICY IF EXISTS restaurant_roles_update
ON public.restaurant_roles;

DROP POLICY IF EXISTS restaurant_roles_delete
ON public.restaurant_roles;


-- SELECT
-- Super Admin: todos los roles de todos los restaurantes.
-- Usuario normal: solamente roles de su restaurante.

CREATE POLICY restaurant_roles_select
ON public.restaurant_roles
FOR SELECT
TO authenticated
USING (
    public.is_super_admin()
    OR public.belongs_to_restaurant(restaurant_id)
);


-- INSERT
-- Super Admin puede crear roles en cualquier restaurante.

CREATE POLICY restaurant_roles_insert
ON public.restaurant_roles
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_super_admin()
);


-- UPDATE
-- Super Admin puede modificar cualquier rol de cualquier restaurante.

CREATE POLICY restaurant_roles_update
ON public.restaurant_roles
FOR UPDATE
TO authenticated
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);


-- DELETE
-- Super Admin puede eliminar cualquier rol.

CREATE POLICY restaurant_roles_delete
ON public.restaurant_roles
FOR DELETE
TO authenticated
USING (
    public.is_super_admin()
);


-- ============================================================================
-- RESTAURANT_USERS
-- ============================================================================

DROP POLICY IF EXISTS restaurant_users_select
ON public.restaurant_users;

DROP POLICY IF EXISTS restaurant_users_insert
ON public.restaurant_users;

DROP POLICY IF EXISTS restaurant_users_update
ON public.restaurant_users;

DROP POLICY IF EXISTS restaurant_users_delete
ON public.restaurant_users;


-- SELECT
-- Super Admin: puede ver TODOS los usuarios de TODOS los restaurantes.
-- Usuario normal: solamente usuarios de su restaurante.

CREATE POLICY restaurant_users_select
ON public.restaurant_users
FOR SELECT
TO authenticated
USING (
    public.is_super_admin()
    OR public.belongs_to_restaurant(restaurant_id)
);


-- INSERT
-- Super Admin puede crear usuarios en cualquier restaurante.

CREATE POLICY restaurant_users_insert
ON public.restaurant_users
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_super_admin()
);


-- UPDATE
-- Super Admin puede modificar cualquier usuario de cualquier restaurante.

CREATE POLICY restaurant_users_update
ON public.restaurant_users
FOR UPDATE
TO authenticated
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);


-- DELETE
-- Super Admin puede eliminar cualquier usuario.

CREATE POLICY restaurant_users_delete
ON public.restaurant_users
FOR DELETE
TO authenticated
USING (
    public.is_super_admin()
);