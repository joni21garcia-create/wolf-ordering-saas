create table public.device_tokens (
    id bigserial primary key,

    restaurant_id uuid not null references public.restaurants(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,

    fcm_token text not null unique,

    platform text not null default 'android',

    active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_device_tokens_restaurant
    on public.device_tokens (restaurant_id);

create index idx_device_tokens_user
    on public.device_tokens (user_id);

create unique index idx_device_tokens_fcm
    on public.device_tokens (fcm_token);

alter table public.device_tokens enable row level security;