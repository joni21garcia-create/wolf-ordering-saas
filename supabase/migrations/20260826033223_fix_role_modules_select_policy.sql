DROP POLICY IF EXISTS role_modules_select
ON public.role_modules;

CREATE POLICY role_modules_select
ON public.role_modules
FOR SELECT
USING (
  public.is_super_admin()
  OR EXISTS (
    SELECT 1
    FROM public.restaurant_users ru
    WHERE ru.auth_user_id = auth.uid()
      AND ru.role_id = role_modules.role_id
  )
);