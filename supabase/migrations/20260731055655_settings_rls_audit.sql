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
-- SELECT (PUBLIC)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_delivery_settings_public_select
ON public.restaurant_delivery_settings;

CREATE POLICY restaurant_delivery_settings_public_select
ON public.restaurant_delivery_settings
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

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_delivery_settings_select
ON public.restaurant_delivery_settings;

CREATE POLICY restaurant_delivery_settings_select
ON public.restaurant_delivery_settings
FOR SELECT
TO authenticated
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
TO authenticated
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
-- restaurant_hero_slides
-- ============================================================================

ALTER TABLE public.restaurant_hero_slides
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_hero_slides_public_select
ON public.restaurant_hero_slides;

CREATE POLICY restaurant_hero_slides_public_select
ON public.restaurant_hero_slides
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

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_hero_slides_select
ON public.restaurant_hero_slides;

CREATE POLICY restaurant_hero_slides_select
ON public.restaurant_hero_slides
FOR SELECT
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
-- restaurant_services
-- ============================================================================

ALTER TABLE public.restaurant_services
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT (PUBLIC)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_services_public_select
ON public.restaurant_services;

CREATE POLICY restaurant_services_public_select
ON public.restaurant_services
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

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_services_select
ON public.restaurant_services;

CREATE POLICY restaurant_services_select
ON public.restaurant_services
FOR SELECT
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
-- SELECT (PUBLIC)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_theme_settings_public_select
ON public.restaurant_theme_settings;

CREATE POLICY restaurant_theme_settings_public_select
ON public.restaurant_theme_settings
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

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_theme_settings_select
ON public.restaurant_theme_settings;

CREATE POLICY restaurant_theme_settings_select
ON public.restaurant_theme_settings
FOR SELECT
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
TO authenticated
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
-- SELECT (PUBLIC)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS schedule_settings_public_select
ON public.schedule_settings;

CREATE POLICY schedule_settings_public_select
ON public.schedule_settings
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

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS schedule_settings_select
ON public.schedule_settings;

CREATE POLICY schedule_settings_select
ON public.schedule_settings
FOR SELECT
TO authenticated
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
TO authenticated
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
-- MODULE: PWA
-- ============================================================================

-- ============================================================================
-- TABLE: restaurant_pwa_settings
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar políticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists restaurant_pwa_settings_public_select
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_select
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_insert
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_update
on public.restaurant_pwa_settings;

drop policy if exists restaurant_pwa_settings_delete
on public.restaurant_pwa_settings;

-- ----------------------------------------------------------------------------
-- SELECT (PÚBLICO)
-- ----------------------------------------------------------------------------

create policy restaurant_pwa_settings_public_select

on public.restaurant_pwa_settings

for select

to anon

using (

    exists (
        select 1
        from public.restaurants r
        where
            r.id = restaurant_id
            and r.active = true
            and r.suspended = false
    )

);

-- ----------------------------------------------------------------------------
-- SELECT (ADMIN)
-- ----------------------------------------------------------------------------

create policy restaurant_pwa_settings_select

on public.restaurant_pwa_settings

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and public.can_view_catalog()

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
    and public.can_manage_catalog()

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
    and public.can_manage_catalog()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and public.can_manage_catalog()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------
-- No DELETE policy.