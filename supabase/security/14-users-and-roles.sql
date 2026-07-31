-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

drop policy if exists restaurant_roles_select
on public.restaurant_roles;

drop policy if exists restaurant_roles_insert
on public.restaurant_roles;

drop policy if exists restaurant_roles_update
on public.restaurant_roles;

drop policy if exists restaurant_roles_delete
on public.restaurant_roles;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_roles_select

on public.restaurant_roles

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_roles_insert

on public.restaurant_roles

for insert

to authenticated

with check (

    public.is_super_admin()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_roles_update

on public.restaurant_roles

for update

to authenticated

using (

    public.is_super_admin()

)

with check (

    public.is_super_admin()

);

-- ============================================================================
-- DELETE
-- ============================================================================

create policy restaurant_roles_delete

on public.restaurant_roles

for delete

to authenticated

using (

    public.is_super_admin()

);
-- ============================================================================
-- Eliminar políticas existentes
-- ============================================================================

drop policy if exists restaurant_users_select
on public.restaurant_users;

drop policy if exists restaurant_users_insert
on public.restaurant_users;

drop policy if exists restaurant_users_update
on public.restaurant_users;

drop policy if exists restaurant_users_delete
on public.restaurant_users;

-- ============================================================================
-- SELECT
-- ============================================================================

create policy restaurant_users_select

on public.restaurant_users

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)

);

-- ============================================================================
-- INSERT
-- ============================================================================

create policy restaurant_users_insert

on public.restaurant_users

for insert

to authenticated

with check (

    public.is_super_admin()

);

-- ============================================================================
-- UPDATE
-- ============================================================================

create policy restaurant_users_update

on public.restaurant_users

for update

to authenticated

using (

    public.is_super_admin()

)

with check (

    public.is_super_admin()

);

-- ============================================================================
-- DELETE
-- ============================================================================

create policy restaurant_users_delete

on public.restaurant_users

for delete

to authenticated

using (

    public.is_super_admin()

);