-- Wolf Ordering: base mínima para repartidores.
-- La app Android usa el mismo usuario de Supabase Auth, pero el repartidor
-- tiene su propio perfil operativo y no depende de restaurant_users.

create table if not exists public.delivery_drivers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  active boolean not null default true,
  online boolean not null default false,
  zone text,
  last_latitude double precision,
  last_longitude double precision,
  last_location_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists delivery_drivers_active_online_idx
  on public.delivery_drivers(active, online);

alter table public.delivery_drivers enable row level security;

-- No se exponen filas directamente a clientes autenticados.
-- DeliveryWolf accede mediante las API /api/delivery del servidor.

comment on table public.delivery_drivers is
  'Perfil operativo de repartidores de Wolf Ordering.';
