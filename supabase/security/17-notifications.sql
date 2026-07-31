-- ============================================================================
-- MODULE: NOTIFICATIONS
-- ============================================================================

-- ============================================================================
-- TABLE: push_subscriptions
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar políticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists push_subscriptions_select
on public.push_subscriptions;

drop policy if exists push_subscriptions_insert
on public.push_subscriptions;

drop policy if exists push_subscriptions_update
on public.push_subscriptions;

drop policy if exists push_subscriptions_delete
on public.push_subscriptions;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

create policy push_subscriptions_select

on public.push_subscriptions

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_view_orders()

);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

create policy push_subscriptions_insert

on public.push_subscriptions

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

create policy push_subscriptions_update

on public.push_subscriptions

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

-- No DELETE policy.



-- ============================================================================
-- TABLE: device_tokens
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Eliminar políticas existentes
-- ----------------------------------------------------------------------------

drop policy if exists device_tokens_select
on public.device_tokens;

drop policy if exists device_tokens_insert
on public.device_tokens;

drop policy if exists device_tokens_update
on public.device_tokens;

drop policy if exists device_tokens_delete
on public.device_tokens;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

create policy device_tokens_select

on public.device_tokens

for select

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_view_orders()

);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

create policy device_tokens_insert

on public.device_tokens

for insert

to authenticated

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

create policy device_tokens_update

on public.device_tokens

for update

to authenticated

using (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

)

with check (

    public.belongs_to_restaurant(restaurant_id)
    and
    public.can_manage_orders()

);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

-- No DELETE policy.