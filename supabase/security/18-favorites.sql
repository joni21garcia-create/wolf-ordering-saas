-- ============================================================================
-- TABLE: restaurant_favorites
-- ============================================================================

-- ============================================================================
-- Eliminar políticas existentes
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