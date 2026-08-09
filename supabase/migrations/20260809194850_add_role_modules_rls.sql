-- ============================================================================
-- ROLE MODULES — RLS
-- Permite leer los módulos asignados al rol del usuario
-- y reserva la administración de permisos al Super Admin.
-- ============================================================================

-- Asegurar que RLS esté activo
ALTER TABLE public.role_modules ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- ELIMINAR POLÍTICAS ANTERIORES
-- ============================================================================

DROP POLICY IF EXISTS role_modules_select
ON public.role_modules;

DROP POLICY IF EXISTS role_modules_insert
ON public.role_modules;

DROP POLICY IF EXISTS role_modules_update
ON public.role_modules;

DROP POLICY IF EXISTS role_modules_delete
ON public.role_modules;


-- ============================================================================
-- SELECT
-- Un usuario autenticado puede leer los módulos del rol
-- que pertenece a su restaurante.
-- ============================================================================

CREATE POLICY role_modules_select

ON public.role_modules

FOR SELECT

TO authenticated

USING (

  EXISTS (
    SELECT 1
    FROM public.restaurant_roles rr
    WHERE rr.id = role_modules.role_id
      AND public.belongs_to_restaurant(rr.restaurant_id)
  )

);


-- ============================================================================
-- INSERT
-- Solo Super Admin puede asignar módulos a un rol.
-- ============================================================================

CREATE POLICY role_modules_insert

ON public.role_modules

FOR INSERT

TO authenticated

WITH CHECK (

  public.is_super_admin()

);


-- ============================================================================
-- UPDATE
-- Solo Super Admin puede modificar permisos existentes.
-- ============================================================================

CREATE POLICY role_modules_update

ON public.role_modules

FOR UPDATE

TO authenticated

USING (

  public.is_super_admin()

)

WITH CHECK (

  public.is_super_admin()

);


-- ============================================================================
-- DELETE
-- Solo Super Admin puede eliminar permisos.
-- ============================================================================

CREATE POLICY role_modules_delete

ON public.role_modules

FOR DELETE

TO authenticated

USING (

  public.is_super_admin()

);