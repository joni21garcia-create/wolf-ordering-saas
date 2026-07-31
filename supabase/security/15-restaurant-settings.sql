-- ============================================================================
-- TABLE: restaurant_settings
-- ============================================================================

ALTER TABLE public.restaurant_settings
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

DROP POLICY IF EXISTS restaurant_settings_public_select
ON public.restaurant_settings;

DROP POLICY IF EXISTS restaurant_settings_select
ON public.restaurant_settings;

DROP POLICY IF EXISTS restaurant_settings_insert
ON public.restaurant_settings;

DROP POLICY IF EXISTS restaurant_settings_update
ON public.restaurant_settings;

DROP POLICY IF EXISTS restaurant_settings_delete
ON public.restaurant_settings;

-- ============================================================================
-- SELECT (PUBLIC)
-- ============================================================================

CREATE POLICY restaurant_settings_public_select

ON public.restaurant_settings

FOR SELECT

TO anon

USING (

    EXISTS (
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

CREATE POLICY restaurant_settings_select

ON public.restaurant_settings

FOR SELECT

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)
    AND
    public.can_view_catalog()

);

-- ============================================================================
-- INSERT
-- ============================================================================

CREATE POLICY restaurant_settings_insert

ON public.restaurant_settings

FOR INSERT

TO authenticated

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)
    AND
    public.can_manage_catalog()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

CREATE POLICY restaurant_settings_update

ON public.restaurant_settings

FOR UPDATE

TO authenticated

USING (

    public.belongs_to_restaurant(restaurant_id)
    AND
    public.can_manage_catalog()

)

WITH CHECK (

    public.belongs_to_restaurant(restaurant_id)
    AND
    public.can_manage_catalog()

);

-- ============================================================================
-- DELETE
-- ============================================================================

-- No DELETE policy.
-- La configuración del restaurante no debe eliminarse.