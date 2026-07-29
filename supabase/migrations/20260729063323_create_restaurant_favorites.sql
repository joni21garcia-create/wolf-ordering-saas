-- ==========================================
-- Restaurant Favorites
-- ==========================================

create table public.restaurant_favorites (
    id uuid primary key default gen_random_uuid(),

    auth_user_id uuid not null references auth.users(id) on delete cascade,

    restaurant_id uuid not null references public.restaurants(id) on delete cascade,

    created_at timestamptz not null default now(),

    constraint restaurant_favorites_unique
        unique (auth_user_id, restaurant_id)
);

create index restaurant_favorites_user_idx
on public.restaurant_favorites(auth_user_id);

create index restaurant_favorites_restaurant_idx
on public.restaurant_favorites(restaurant_id);

alter table public.restaurant_favorites
enable row level security;

create policy "Users can view their favorites"
on public.restaurant_favorites
for select
using (
    auth.uid() = auth_user_id
);

create policy "Users can insert favorites"
on public.restaurant_favorites
for insert
with check (
    auth.uid() = auth_user_id
);

create policy "Users can delete favorites"
on public.restaurant_favorites
for delete
using (
    auth.uid() = auth_user_id
);