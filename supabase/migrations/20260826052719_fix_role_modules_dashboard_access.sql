-- ============================================================
-- Wolf Ordering
-- role_modules: permitir que cada usuario lea
-- únicamente los módulos de su propio rol.
-- Super Admin conserva acceso global.
-- ============================================================

DROP POLICY IF EXISTS role_modules_select
ON public.role_modules;

CREATE POLICY role_modules_select
ON public.role_modules
FOR SELECT
USING (
    public.is_super_admin()
    OR public.current_restaurant_role() = role_modules.role_id
);