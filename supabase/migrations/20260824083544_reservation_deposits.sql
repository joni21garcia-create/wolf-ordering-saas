-- Reservation deposits: independent from orders and Wolf subscriptions.
begin;

create table if not exists public.reservation_deposit_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants(id) on delete cascade,
  enabled boolean not null default false,
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  allow_cash boolean not null default true,
  allow_transfer boolean not null default true,
  allow_paypal boolean not null default false,
  qr_image_url text,
  transfer_instructions text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint reservation_deposit_settings_amount_check check (amount >= 0),
  constraint reservation_deposit_settings_currency_check check (currency in ('USD'))
);

create table if not exists public.reservation_deposits (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique references public.restaurant_reservations(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  payment_method text not null check (payment_method in ('cash','transfer','paypal')),
  status text not null default 'pending'
    check (status in ('pending','paid','failed','cancelled','refunded')),
  proof_url text,
  paypal_order_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservation_deposits_amount_check check (amount >= 0)
);

create index if not exists idx_reservation_deposits_restaurant_id
  on public.reservation_deposits(restaurant_id);

create index if not exists idx_reservation_deposits_status
  on public.reservation_deposits(status);

create index if not exists idx_reservation_deposits_paypal_order_id
  on public.reservation_deposits(paypal_order_id);

create or replace function public.set_reservation_deposit_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservation_deposit_settings_updated_at
on public.reservation_deposit_settings;

create trigger reservation_deposit_settings_updated_at
before update on public.reservation_deposit_settings
for each row execute function public.set_reservation_deposit_settings_updated_at();

create or replace function public.set_reservation_deposits_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservation_deposits_updated_at
on public.reservation_deposits;

create trigger reservation_deposits_updated_at
before update on public.reservation_deposits
for each row execute function public.set_reservation_deposits_updated_at();

alter table public.reservation_deposit_settings enable row level security;
alter table public.reservation_deposits enable row level security;

commit;
