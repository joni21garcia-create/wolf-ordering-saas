drop policy if exists restaurants_select on public.restaurants;
drop policy if exists restaurants_public_select on public.restaurants;

create policy restaurants_select
on public.restaurants
for select
to authenticated
using (
    public.is_super_admin()
    or public.belongs_to_restaurant(id)
);

create policy restaurants_public_select
on public.restaurants
for select
to anon
using (
    active = true
    and suspended = false
);