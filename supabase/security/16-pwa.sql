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